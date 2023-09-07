import dotenv from 'dotenv';
import { StreamingTextResponse, LangChainStream } from 'ai';
import { currentUser } from '@clerk/nextjs';
import { Replicate } from 'langchain/llms/replicate';
import { CallbackManager } from 'langchain/callbacks';
import { NextResponse } from 'next/server';

import { MemoryManager } from '@/app/lib/memory';
import { rateLimit  } from '@/app/lib/rate-limit';
import prisma from '@/app/lib/prisma';

dotenv.config({ path: '.env' });

export async function POST(
    request: Request,
    { params }: { params: { chatId: string } }
) {
    try {
        const { prompt } = await request.json();
        const user = await currentUser();

        if (!user || !user.firstName || !user.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // rate limiter
        const identifier = request.url + '-' + user.id;
        const { success } = await rateLimit(identifier);

        console.log('success?: ', success);

        if (!success) {
            return new NextResponse('Rate limit exceeded', { status: 429 });
        }

        // store chat history in prisma db
        const celebrity = await prisma.celebrity.update({
            where: {
                id: params.chatId,
            },
            data: {
                messages: {
                    create: {
                        content: prompt,
                        role: 'user',
                        userId: user.id,
                    }
                }
            }
        });

        console.log('celebrity?: ', celebrity);

        if (!celebrity) {
            return new NextResponse('Celebrity not found', { status: 404 });
        }

        // redis memory
        const name = celebrity.id;
        const celebrity_file_name = name + '.txt';

        const celebrityKey = {
            celebrityName: name,
            userId: user.id,
            modelName: 'llama-2-13b',
        }

        // // check redis for chat history with user & celebrity
        const memoryManager = await MemoryManager.getInstance();

        console.log('MemoryManager.getInstance?: ', memoryManager);

        const records = await memoryManager.readLatestHistory(celebrityKey);

        console.log('records?: ', records);

        // seed chat if no records found
        if (records.length === 0) {
            await memoryManager.seedChatHistory(celebrity.seed, "\n\n", celebrityKey);
        }

        // // store chat history in vector db
        await memoryManager.writeToHistory('User: ' + prompt + '\n', celebrityKey);

        const recentChatHistory = await memoryManager.readLatestHistory(celebrityKey);

        console.log('recentChatHistory?: ', recentChatHistory);

        const similarDocs = await memoryManager.vectorSearch(
            recentChatHistory,
            celebrity_file_name,
        );

        console.log('similarDocs?: ', similarDocs);

        // // find relevant history in vector db
        let relevantHistory = '';

        if (!!similarDocs && similarDocs.length !== 0) {
            relevantHistory = similarDocs.map((doc) => doc.pageContent).join('\n');
        }

        const { handlers } = LangChainStream();

        console.log('REPLICATE_API_TOKEN?: ', process.env.REPLICATE_API_TOKEN)

        // https://replicate.com/meta/llama-2-13b-chat
        // what is the difference between llama-2 7b, 13b, 70b? - https://replicate.com/blog/all-the-llamas
        const model = new Replicate({
            model: "meta/llama-2-13b-chat:7457c09004773f9f9710f7eb3b270287ffcebcfb23a13c8ec30cfb98f6bff9b2",
            input: {
                max_length: 2048,
            },
            apiKey: process.env.REPLICATE_API_TOKEN,
            callbackManager: CallbackManager.fromHandlers(handlers),
        });

        // turn verbose on for debugging
        model.verbose = true;

        // system prompt to send to ai model
        // this prepended to the instructions and helps guide system behavior
        const resp = String(
            await model
              .call(
                `
              ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${celebrity.name}: prefix. 
      
              ${celebrity.instructions}
      
              Below are relevant details about ${celebrity.name}'s past and the conversation you are in.
              ${relevantHistory}
      
      
              ${recentChatHistory}\n${celebrity.name}:`
              )
              .catch(console.error)
        );

        // clean up response to return to client
        const cleaned = resp.replaceAll(',', '');
        console.log('cleaned up?: ', cleaned);
        const chunks = cleaned.split('\n');
        console.log('chunks?: ', chunks);
        const response = chunks[0];

        console.log('response?: ', response);

        await memoryManager.writeToHistory('' + response.trim(), celebrityKey);
        var Readable = require('stream').Readable;

        let stream = new Readable();
        stream.push(response);
        stream.push(null);

        console.log('response.trim()?: ', response.trim())

        if(response !== undefined && response.length > 1) {
            memoryManager.writeToHistory('' + response.trim(), celebrityKey);

            // update messages with responses from ai model
            await prisma.celebrity.update({
                where: {
                    id: params.chatId,
                },
                data: {
                    messages: {
                        create: {
                            content: response.trim(),
                            role: 'system',
                            userId: user.id,
                        },
                    },
                }
            });
        }


        return new StreamingTextResponse(stream);
    } catch (error) {
        console.log('[CHAT_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
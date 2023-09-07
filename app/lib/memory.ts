import { Redis } from '@upstash/redis';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeClient } from '@pinecone-database/pinecone';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

export type CelebrityKey = {
    celebrityName: string;
    modelName: string;
    userId: string;
}

export class MemoryManager {
    private static instance: MemoryManager;
    private history: Redis;
    private vectorDBClient: PineconeClient;

    public constructor() {
        this.history = Redis.fromEnv();
        this.vectorDBClient = new PineconeClient();
    }

    public async init() {
        if (this.vectorDBClient instanceof PineconeClient) {
          await this.vectorDBClient.init({
            apiKey: process.env.PINECONE_API_KEY!,
            environment: process.env.PINECONE_ENVIRONMENT!,
          });
        }
    }

    public async vectorSearch(
        recentChatHistory: string,
        companionFileName: string
    ) {
        const pineconeClient = <PineconeClient>this.vectorDBClient;
    
        const pineconeIndex = pineconeClient.Index(
          process.env.PINECONE_INDEX! || ""
        );
    
        const vectorStore = await PineconeStore.fromExistingIndex(
          new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
          { pineconeIndex }
        ); 
    
        const similarDocs = await vectorStore
          .similaritySearch(recentChatHistory, 3, { fileName: companionFileName })
          .catch((err) => {
            console.log("WARNING: failed to get vector search results.", err);
          });
        return similarDocs;
    }

    public static async getInstance(): Promise<MemoryManager> {
        if (!MemoryManager.instance) {
          MemoryManager.instance = new MemoryManager();
          await MemoryManager.instance.init();
        }
        return MemoryManager.instance;
    }

    private generateRedisCelebrityKey(celebrityKey: CelebrityKey): string {
        return `${celebrityKey.celebrityName}-${celebrityKey.modelName}-${celebrityKey.userId}`;
    }

    public async writeToHistory(text: string, celebrityKey: CelebrityKey) {
        if (!celebrityKey || typeof celebrityKey.userId == 'undefined') {
            console.log('Celebrity key set incorrectly');
            return '';
        }

        const key = this.generateRedisCelebrityKey(celebrityKey);
        const result = await this.history.zadd(key, {
            score: Date.now(),
            member: text,
        });

        return result;
    }

    public async readLatestHistory(celebrityKey: CelebrityKey): Promise<string> {
        if (!celebrityKey || typeof celebrityKey.userId == 'undefined') {
            console.log('Celebrity key set incorrectly');
            return '';
        }

        const key = this.generateRedisCelebrityKey(celebrityKey);
        let result = await this.history.zrange(key, 0, Date.now(), {
            byScore: true,
        });

        result = result.slice(-30).reverse();
        const recentChats = result.reverse().join('\n');
        return recentChats;
    }

    public async seedChatHistory(
        seedContent: String,
        delimiter: string = '\n',
        celebrityKey: CelebrityKey
    ) {
        const key = this.generateRedisCelebrityKey(celebrityKey);
        if (await this.history.exists(key)) {
            console.log('User already has chat history');
            return;
        }

        const content = seedContent.split(delimiter);
        let counter = 0;
        for (const line of content) {
            await this.history.zadd(key, { score: counter, member: line });
            counter += 1;
        }
    }
}
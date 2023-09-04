import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, instructions, seed, categoryId } = body;

        if(!user || !user.id || !user.firstName) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!src || !name || !description || !instructions || !seed || !categoryId) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // TODO: check for subscription

        const celebrity = await prisma.celebrity.create({
            data: {
                categoryId,
                userId: user.id,
                userName: user.firstName,
                src,
                name,
                description,
                instructions,
                seed
            }
        });

        return NextResponse.json(celebrity);

    } catch (error) {
        console.log('[CELEBRITY_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
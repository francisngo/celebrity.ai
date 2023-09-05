import { auth, currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import prisma from '@/app/lib/prisma';

export async function PATCH(
    req: Request, 
    { params }: { params: { celebrityId: string }}
) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, instructions, seed, categoryId } = body;

        if (!params.celebrityId) {
            return new NextResponse('Celebrity ID is required', { status: 400 });
        }

        if(!user || !user.id || !user.firstName) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!src || !name || !description || !instructions || !seed || !categoryId) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const celebrity = await prisma.celebrity.update({
            where: {
                id: params.celebrityId,
                userId: user.id,
            },
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
        console.log('[CELEBRITY_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { celebrityId: string }}
) {
    try {
        const { userId } = auth();

        if (!params.celebrityId) {
            return new NextResponse('Celebrity ID is required', { status: 400 });
        }

        if(!userId) {
            return new NextResponse('Unauthorized', { status: 401 } )
        }

        const celebrity = await prisma.celebrity.delete({
            where: {
                userId,
                id: params.celebrityId
            }
        });

        return NextResponse.json(celebrity);
    } catch (error) {
        console.log('[CELEBRITY_DELETE', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
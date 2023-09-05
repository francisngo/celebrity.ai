import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import { ChatClient } from "./components/chat-client";

interface ChatIdPageProps {
	params: {
		chatId: string;
	};
}

const ChatIdPage = async ({ params }: ChatIdPageProps) => {
	const { userId } = auth();

	if (!userId) {
		return redirectToSignIn();
	}

	const celebrity = await prisma.celebrity.findUnique({
		where: {
			id: params.chatId,
		},
		include: {
			messages: {
				orderBy: {
					createdAt: "asc",
				},
				where: {
					userId,
				},
			},
			_count: {
				select: {
					messages: true,
				},
			},
		},
	});

	if (!celebrity) {
		return redirect("/");
	}

	return <ChatClient celebrity={celebrity} />;
};

export default ChatIdPage;

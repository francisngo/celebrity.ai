"use client";

import { Celebrity, Message } from "@prisma/client";
import { ChatHeader } from "@/app/components/chat-header";

interface ChatClientProps {
	celebrity: Celebrity & {
		messages: Message[];
		_count: {
			messages: number;
		};
	};
}

export const ChatClient = ({ celebrity }: ChatClientProps) => {
	return (
		<div className="flex flex-col h-full p-4 space-y-2">
			<ChatHeader celebrity={celebrity} />
		</div>
	);
};

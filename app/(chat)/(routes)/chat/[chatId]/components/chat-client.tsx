"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCompletion } from "ai/react";
import { Celebrity, Message } from "@prisma/client";
import { ChatHeader } from "@/app/components/chat-header";
import { ChatMessages } from "@/app/components/chat-messages";
import { ChatMessageProps } from "@/app/components/chat-message";
import { ChatForm } from "@/app/components/chat-form";

interface ChatClientProps {
	celebrity: Celebrity & {
		messages: Message[];
		_count: {
			messages: number;
		};
	};
}

export const ChatClient = ({ celebrity }: ChatClientProps) => {
	const router = useRouter();
	const [messages, setMessages] = useState<ChatMessageProps[]>(
		celebrity.messages
	);

	const { input, isLoading, handleInputChange, handleSubmit, setInput } =
		useCompletion({
			api: `/api/chat/${celebrity.id}`,
			onFinish(_prompt, completion) {
				const systemMessage: ChatMessageProps = {
					role: "system",
					content: completion,
				};

				setMessages((current) => [...current, systemMessage]);
				setInput("");

				router.refresh();
			},
		});

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		const userMessage: ChatMessageProps = {
			role: "user",
			content: input,
		};

		setMessages((current) => [...current, userMessage]);
		handleSubmit(e);
	};

	return (
		<div className="flex flex-col h-full p-4 space-y-2">
			<ChatHeader celebrity={celebrity} />
			<ChatMessages
				celebrity={celebrity}
				isLoading={isLoading}
				messages={messages}
			/>
			<ChatForm
				isLoading={isLoading}
				input={input}
				handleInputChange={handleInputChange}
				onSubmit={onSubmit}
			/>
		</div>
	);
};

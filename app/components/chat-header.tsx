"use client";

import axios from "axios";
import {
	ChevronLeft,
	MessagesSquare,
	Edit,
	MoreVertical,
	Trash,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Celebrity, Message } from "@prisma/client";
import { Button } from "@/app/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useToast } from "@/app/components/ui/use-toast";
import { BotAvatar } from "./bot-avatar";

interface ChatHeaderProps {
	celebrity: Celebrity & {
		messages: Message[];
		_count: {
			messages: number;
		};
	};
}

export const ChatHeader = ({ celebrity }: ChatHeaderProps) => {
	const router = useRouter();
	const { user } = useUser();
	const { toast } = useToast();

	const onDelete = async () => {
		try {
			await axios.delete(`/api/celebrity/${celebrity.id}`);
			toast({
				description: "Success.",
			});
			router.refresh();
			router.push("/");
		} catch (error) {
			toast({
				variant: "destructive",
				description: "Something went wrong.",
			});
		}
	};

	return (
		<div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
			<div className="flex gap-x-2 items-center">
				<Button
					onClick={() => router.back()}
					size="icon"
					variant="ghost"
				>
					<ChevronLeft className="h-8 w-8" />
				</Button>
				<BotAvatar src={celebrity.src} />
				<div className="flex flex-col gap-y-1">
					<div className="flex items-center gap-x-2">
						<p className="font-bold">{celebrity.name}</p>
						<div className="flex items-center text-xs text-muted-foreground">
							<MessagesSquare className="w-3 h-3 mr-1" />
							{celebrity._count.messages}
						</div>
					</div>
					<p className="text-xs text-muted-foreground">
						Created by {celebrity.userName}
					</p>
				</div>
			</div>
			{user?.id === celebrity.userId && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="secondary" size="icon">
							<MoreVertical />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() =>
								router.push(`/companion/${celebrity.id}`)
							}
						>
							<Edit className="w-4 h-4 mr-2" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem onClick={onDelete}>
							<Trash className="w-4 h-4 mr-2" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
};

"use client";

import { Sparkles } from "lucide-react";
import { Poppins } from "next/font/google";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { MobileSidebar } from "@/app/components/mobile-sidebar";

const font = Poppins({
	weight: "600",
	subsets: ["latin"],
});

interface NavbarProps {
	isPro: boolean;
}

export const Navbar = ({ isPro }: NavbarProps) => {
	return (
		<div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
			<div className="flex items-center">
				<MobileSidebar isPro={isPro} />
				<Link href="/">
					<h1
						className={cn(
							"hidden md:block text-xl md:text-3xl font-bold text-primary",
							font.className
						)}
					>
						celebrity.ai
					</h1>
				</Link>
			</div>
			<div className="flex items-center gap-x-3">
				<Button variant="premium">
					Upgrade
					<Sparkles className="h-4 w-4 fill-white text-white ml-2" />
				</Button>
				<ThemeToggle />
				<UserButton />
			</div>
		</div>
	);
};

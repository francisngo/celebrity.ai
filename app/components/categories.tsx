"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@prisma/client";
import { cn } from "@/app/lib/utils";

interface CategoriesProps {
	data: Category[];
}

export const Categories = ({ data }: CategoriesProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const categoryId = searchParams.get("categoryId");

	const handleClick = (id: string | undefined) => {
		const query = { categoryId: id };

		const url = qs.stringifyUrl(
			{
				url: window.location.href,
				query,
			},
			{ skipNull: true }
		);

		router.push(url);
	};

	return (
		<div className="w-full overflow-x-auto space-x-2 flex p-1">
			<button
				onClick={() => handleClick(undefined)}
				className={cn(
					`flex items-center text-center text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition`,
					!categoryId ? "bg-primary/25" : "bg-primary/10"
				)}
			>
				Newest
			</button>
			{data.map((item) => (
				<button
					onClick={() => handleClick(item.id)}
					className={cn(
						`flex items-center text-center text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition`,
						item.id === categoryId
							? "bg-primary/25"
							: "bg-primary/10"
					)}
					key={item.id}
				>
					{item.name}
				</button>
			))}
		</div>
	);
};

import { SearchInput } from "@/app/components/search-input";
import { Categories } from "@/app/components/categories";
import { Celebrities } from "@/app/components/celebrities";
import prisma from "@/app/lib/prisma";

interface RootPageProps {
	searchParams: {
		categoryId: string;
		name: string;
	};
}

const RootPage = async ({ searchParams }: RootPageProps) => {
	const categories = await prisma.category.findMany();
	const celebrities = await prisma.celebrity.findMany({
		where: {
			categoryId: searchParams.categoryId,
			name: {
				search: searchParams.name,
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		include: {
			_count: {
				select: {
					messages: true,
				},
			},
		},
	});

	return (
		<div className="h-full p-4 space-y-2">
			<SearchInput />
			<Categories data={categories} />
			<Celebrities data={celebrities} />
		</div>
	);
};

export default RootPage;

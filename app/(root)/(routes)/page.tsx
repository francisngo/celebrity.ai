import { SearchInput } from "@/app/components/search-input";
import prisma from "@/app/lib/prisma";

import { Categories } from "@/app/components/categories";

const RootPage = async () => {
	const categories = await prisma.category.findMany();
	return (
		<div className="h-full p-4 space-y-2">
			<SearchInput />
			<Categories data={categories} />
		</div>
	);
};

export default RootPage;

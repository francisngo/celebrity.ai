import prisma from "@/lib/prisma";
import { CelebrityForm } from "./components/celebrity-form";

interface CelebrityIdPageProps {
	params: {
		CelebrityId: string;
	};
}

const CelebrityIdPage = async ({ params }: CelebrityIdPageProps) => {
	// TODO: Check subscription logic here
	const Celebrity = await prisma.celebrity.findUnique({
		where: {
			id: params.CelebrityId,
		},
	});

	const categories = await prisma.category.findMany();

	return <CelebrityForm initialData={Celebrity} categories={categories} />;
};

export default CelebrityIdPage;

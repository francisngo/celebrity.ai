import prisma from "@/app/lib/prisma";
import { CelebrityForm } from "./components/celebrity-form";

interface CelebrityIdPageProps {
	params: {
		celebrityId: string;
	};
}

const CelebrityIdPage = async ({ params }: CelebrityIdPageProps) => {
	// TODO: Check subscription logic here
	const Celebrity = await prisma.celebrity.findUnique({
		where: {
			id: params.celebrityId,
		},
	});

	const categories = await prisma.category.findMany();

	return <CelebrityForm initialData={Celebrity} categories={categories} />;
};

export default CelebrityIdPage;

import prisma from "@/lib/prisma";
import { CompanionForm } from "./components/companion-form";

interface CompanionIdPageProps {
	params: {
		companionId: string;
	};
}

const CompanionIdPage = async ({ params }: CompanionIdPageProps) => {
	// TODO: Check subscription logic here
	const companion = await prisma.companion.findUnique({
		where: {
			id: params.companionId,
		},
	});

	const categories = await prisma.category.findMany();

	return <CompanionForm initialData={companion} categories={categories} />;
};

export default CompanionIdPage;

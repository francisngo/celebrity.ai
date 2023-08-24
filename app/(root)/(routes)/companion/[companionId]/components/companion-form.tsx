"use client";

import * as z from "zod";
import { Companion, Category } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

interface CompanionFormProps {
	initialData: Companion | null;
	categories: Category[];
}

const formSchema = z.object({
	name: z.string().min(1, {
		message: "Name is required.",
	}),
	description: z.string().min(1, {
		message: "Description is required.",
	}),
	instructions: z.string().min(200, {
		message: "Instructions is require at least 200 characters.",
	}),
	seed: z.string().min(200, {
		message: "Seed is require at least 200 characters.",
	}),
	src: z.string().min(1, {
		message: "Image is required",
	}),
	categoryId: z.string().min(1, {
		message: "Category is required",
	}),
});

export const CompanionForm = ({
	initialData,
	categories,
}: CompanionFormProps) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: "",
			description: "",
			instructions: "",
			seed: "",
			src: "",
			categoryId: undefined,
		},
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
	};

	return (
		<div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}></form>
			</Form>
		</div>
	);
};

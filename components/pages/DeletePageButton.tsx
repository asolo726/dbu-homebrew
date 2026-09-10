"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiDeleteBinLine } from "react-icons/ri";
import { useEditingState } from "../edit/useEditingState";

interface DeletePageButtonProps {
	title: string;
}

export default function DeletePageButton({ title }: DeletePageButtonProps) {
	const { keyName, canDelete } = useEditingState();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState("");

	if (!canDelete) return null;

	const titleMatches = value === title;

	async function handleDelete(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!titleMatches || deleting) return;

		setDeleting(true);
		setError("");
		try {
			const response = await fetch("/api/deleteContent", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ keyName, title: value }),
			});
			if (!response.ok) {
				const result = await response.json().catch(() => ({}));
				throw new Error(result.error || "Unable to delete page.");
			}
			router.push("/");
			router.refresh();
		} catch (deleteError) {
			setError(
				deleteError instanceof Error
					? deleteError.message
					: "Unable to delete page.",
			);
			setDeleting(false);
		}
	}

	return (
		<>
			<button
				type="button"
				onClick={() => {
					setError("");
					setValue("");
					setOpen(true);
				}}
				title="Delete page"
				className="self-center inline-flex items-center gap-1 rounded border border-red-500/70 px-2 py-1 text-[0.6rem] font-semibold uppercase text-red-300 transition-colors hover:border-red-400 hover:bg-red-950/40"
			>
				<RiDeleteBinLine size={14} />
				Delete
			</button>

			{open && (
				<div
					className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4"
					role="presentation"
					onMouseDown={(event) => {
						if (event.target === event.currentTarget)
							setOpen(false);
					}}
				>
					<form
						onSubmit={handleDelete}
						className="w-full max-w-md border border-red-500/60 bg-dbu-bg2 p-5 shadow-2xl"
					>
						<h2 className="text-lg font-bold text-red-300">
							Delete page?
						</h2>
						<p className="mt-2 text-sm text-dbu-text">
							This permanently deletes this page. Type the exact
							title to continue:
						</p>
						<p className="mt-3 wrap-break-word font-semibold text-dbu-header">
							{title}
						</p>
						<input
							autoFocus
							value={value}
							onChange={(event) => setValue(event.target.value)}
							aria-label="Page title confirmation"
							className="mt-3 w-full border border-dbu-line bg-dbu-bg3 px-3 py-2 text-sm text-dbu-text outline-none focus:border-red-400"
						/>
						{error && (
							<p className="mt-2 text-sm text-red-300">{error}</p>
						)}
						<div className="mt-5 flex justify-end gap-2">
							<button
								type="button"
								onClick={() => setOpen(false)}
								className="border border-dbu-line px-3 py-2 text-sm text-dbu-text hover:border-dbu-header"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={!titleMatches || deleting}
								className="border border-red-500 bg-red-900/40 px-3 py-2 text-sm font-semibold text-red-100 disabled:cursor-not-allowed disabled:opacity-40"
							>
								{deleting ? "Deleting..." : "Delete page"}
							</button>
						</div>
					</form>
				</div>
			)}
		</>
	);
}

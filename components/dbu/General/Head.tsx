"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "../../../lib/reactTooltip";
import PageVoteButtons from "../../pages/PageVoteButtons";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";
import {
	loadAspects,
	getCustomAspectNames,
	formatTransformationType,
} from "./util/headUtil";
import { ScrollToTop } from "../../navigation/ScrollBackToTopButton";
import BasicStat from "./headHelpers/BasicStats";
import AttributeModsTable from "./headHelpers/AttributeTable";
import Aspects, { type Aspect } from "./headHelpers/Aspects";
import { useEditingState } from "@/components/edit/useEditingState";

export interface Data {
	identity: string; // Shows what collection this page is associated with. Can be used to determine the Form/Enhancement type as well.
	keyName: string; // Search key for a page.
	author: string; // Author of the page.
	authorID: number; // Author number
	tag: string; // Tags a page with category of content, such as "Pocket Monsters" for the Pocket Monster expansion.
	credits: {
		bannerAuthor: string; // Author of the banner image.
		collabs: string; // If the Author collaborated with other authors, this is where they can be credited.
	};
	management: {
		status: string; // TODO: This is currently unused, but could be used to indicate the status of a page, such as "Draft", "Published", or "Archived".
		approved: boolean; // TODO: This is currently unused, but could be used to indicate whether a page has been approved by an admin or moderator.
		isCommunity: boolean; // Indicates whether the page is a community page. Community pages are usually created by multiple authors and may have different rules for editing and publishing.
		toggle: string; // The name of the toggle that controls whether the page is public or hidden. This is used to determine whether the page should be visible to the public or only to the author and admins.
	};
}

interface Head {
	title: string;
	banner: string;
	desc: string;
	details: {
		raceReq?: string;
		preReq?: string;
		stressTest?: string;
		tier?: string;
		transStage?: number;
		transLine?: string;
		attributeModifiers?: any[];
		aspects?: Aspect[];
		maxFactor?: string; // Only used by Factors
		maxStacks?: string; // Only used by Awakenings
		enhancementType?: string; // Standard or Special
		initialEnhancement?: string; // Only for Special Enhancements. Specials usually have a hyperlink to the form they apply to. The user can add this manually.
		awakeningType?: string; // Lesser, Greater, Super
		awakeningOrigin?: string; // Body or Mind
		evolvedStageType?: string; // Generic or Unique. Uniques usually have a hyperlink to the form they apply to. The user can add this manually.
		raceInfo?: {
			RLM: number; // Racial Life Modifier
			saves: string[]; // Racial Saving Throws
			skillRanks: number;
			attributeScores: string;
		};
	};
}

interface Form {
	data: Data;
	head: Head;
}

interface HeadProps {
	Form: Form;
}

export default function Head({ Form }: Readonly<HeadProps>) {
	const editMode = useEditMode();
	const {
		isEditing = false,
		pendingChanges = {},
		setChange,
		toggleStatus,
	} = useEditingState();
	const isAuthor = editMode !== null;
	const requirementNameStyle = "font-bold text-dbu-header";
	const [uploading, setUploading] = useState(false);
	const [toggling, setToggling] = useState(false);
	const [localPublic, setLocalPublic] = useState(true);
	const router = useRouter();
	const toggle = Form.data.management.toggle;
	const author = Form.data.author;
	const [aspectsReady, setAspectsReady] = useState(false);

	const isPublic =
		localPublic !== null ? localPublic : !toggle || !!toggleStatus;

	async function handleTogglePublish() {
		if (!toggle || toggling) return;
		setToggling(true);
		try {
			const res = await fetch("/api/settings/toggles", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					toggleName: toggle,
					enabled: !isPublic,
					targetAuthor: author,
				}),
			});
			if (res.ok) {
				setLocalPublic(!isPublic);
				router.refresh();
			}
		} finally {
			setToggling(false);
		}
	}

	// Saves Aspects when user changes them with modal
	function handleAspectChange(newAspects: Aspect[]) {
		setChange?.("head.details.aspects", newAspects);
	}

	// Allows users to upload an image and set the banner URL in the head object.
	async function handleImageUpload(file: File) {
		if (!file || !setChange) return;
		setUploading(true);
		try {
			const fd = new FormData();
			fd.append("file", file);
			const res = await fetch("/api/uploadImage", {
				method: "POST",
				body: fd,
			});
			const data = await res.json();
			if (data.url) setChange("head.banner", data.url);
		} finally {
			setUploading(false);
		}
	}
	// This useEffect scrolls the user to the top of a page, but only if they haven't visited the page before in this session.
	// It uses sessionStorage to track whether the user has visited the page, and if not, it scrolls to the top instantly and sets a flag in sessionStorage to prevent future automatic scrolling during the same session.
	useEffect(() => {
		const hasVisited = sessionStorage.getItem("hasVisitedPage");
		if (hasVisited !== Form.data.keyName) {
			ScrollToTop("instant");
			sessionStorage.setItem("hasVisitedPage", Form.data.keyName);
		}
	}, []);

	// This effect loads the aspect data for tooltips. It sets a flag when the data is ready to avoid rendering tooltips with missing content.
	useEffect(() => {
		let cancelled = false;

		loadAspects().then(() => {
			if (!cancelled) setAspectsReady(true);
		});

		return () => {
			cancelled = true;
		};
	}, []);
	const customAspectNames = getCustomAspectNames();

	const currentBanner =
		pendingChanges?.["head.banner"] ??
		(Form.head.banner !== "" ? Form.head.banner : null) ??
		"https://9pensrt47gzxrsro.public.blob.vercel-storage.com/whosthatzfighter.webp";

	// Get current (possibly pending) value of tier for formatting
	const currentTier =
		pendingChanges?.["head.details.tier"] ?? Form.head.details.tier;

	const currentIsCommunity =
		pendingChanges?.["data.management.isCommunity"] ??
		Form.data.management.isCommunity ??
		false;

	return (
		<div className="grow">
			<div className="flex items-center justify-center gap-2 mb-4">
				<h1 className="text-dbu-header text-[2em] sm:text-[3em] font-bold text-center tracking-wide">
					{isEditing ? (
						<EditableText
							path="head.title"
							value={Form.head.title}
						/>
					) : (
						Form.head.title
					)}
				</h1>
				{currentIsCommunity && (
					<span className="self-center text-[0.55rem] font-semibold tracking-wide uppercase border rounded px-1.5 py-0.5 text-blue-300 border-blue-400">
						Community
					</span>
				)}
				{isAuthor &&
					(isEditing && toggle ? (
						<button
							type="button"
							onClick={handleTogglePublish}
							disabled={toggling}
							title={
								isPublic
									? "Click to hide this page"
									: "Click to publish this page"
							}
							className={`self-center text-[0.55rem] font-semibold tracking-wide uppercase border rounded px-1.5 py-0.5 transition-colors cursor-pointer disabled:opacity-50 ${
								isPublic
									? "text-green-400 border-green-500 hover:text-red-400 hover:border-red-500"
									: "text-gray-200 border-gray-400 hover:text-green-400 hover:border-green-500"
							}`}
						>
							{toggling ? "..." : isPublic ? "Public" : "Hidden"}
						</button>
					) : (
						<span
							className={`self-center text-[0.55rem] font-semibold tracking-wide uppercase border rounded px-1.5 py-0.5 ${
								isPublic
									? "text-green-400 border-green-500"
									: "text-gray-200 border-gray-400"
							}`}
						>
							{isPublic ? "Public" : "Hidden"}
						</span>
					))}
			</div>

			{/* Image with upload overlay in edit mode */}
			<a
				className="justify-self-center max-w-full mb-3 block"
				href={!isEditing ? currentBanner : null}
				target={!isEditing ? "_blank" : undefined}
				rel="noreferrer"
			>
				<div
					className="relative cursor-pointer"
					data-tooltip-id="art-credit-tooltip"
					data-tooltip-content={
						!isEditing &&
						Form.data.credits.bannerAuthor &&
						Form.data.credits.bannerAuthor !== ""
							? `Art Credit: ${Form.data.credits.bannerAuthor}`
							: undefined
					}
				>
					<Image
						src={currentBanner}
						className="max-w-full"
						width={1500}
						height={1500}
						alt=""
						priority={true}
					/>
					{isEditing && (
						<label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded">
							<span className="px-4 py-2 bg-dbu-bg2 border border-dbu-header rounded-lg text-dbu-header text-sm font-medium">
								{uploading ? "Uploading…" : "Change Image"}
							</span>
							<input
								type="file"
								accept="image/*"
								className="hidden"
								disabled={uploading}
								onChange={(e) => {
									const f = e.target.files?.[0];
									if (f) handleImageUpload(f);
								}}
							/>
						</label>
					)}
				</div>
			</a>

			{/* Art credit editable in edit mode */}
			{isEditing && (
				<p className="text-xs text-center text-dbu-text/50 mb-2">
					Art Credit:{" "}
					<EditableText
						path="data.credits.bannerAuthor"
						value={Form.data.credits.bannerAuthor || ""}
						className="text-xs"
					/>
				</p>
			)}

			<div
				className="flex flex-col items-center justify-center mr-5 mb-3"
				data-tooltip-id="art-credit-tooltip"
				data-tooltip-content={"Like this homebrew? Give it an upvote!"}
			>
				<PageVoteButtons
					keyName={Form.data.keyName}
					initialUpvotes={0}
				/>
			</div>
			<Tooltip id="art-credit-tooltip" />
			{(isEditing || Form.head.desc) && (
				<p className="text-pretty text-md tracking-wide md:text-lg whitespace-pre-wrap">
					<EditableText
						path="head.desc"
						value={Form.head.desc ?? ""}
						className="block w-full min-h-6"
					/>
				</p>
			)}
			<ul className="list-disc ml-10 mt-3 text-md md:text-lg">
				<BasicStat
					statName={"raceReq"}
					statValue={Form.head.details.raceReq}
					isEditing={isEditing}
					spanStyle={requirementNameStyle}
					spanText="Racial Requirement: "
				/>
				<BasicStat
					statName={"evolvedStageType"}
					statValue={Form.head.details.evolvedStageType}
					isEditing={isEditing}
					spanStyle={requirementNameStyle}
					spanText="Evolved Stage Type: "
				/>
				<BasicStat
					statName={"identity"}
					statValue={formatTransformationType(Form.data.identity)}
					isEditing={isEditing}
					spanStyle={requirementNameStyle}
					spanText="Transformation Type: "
				/>
				<BasicStat
					statName={"identity"}
					statValue={Form.data.identity}
					isEditing={isEditing}
					spanStyle={requirementNameStyle}
					spanText="Form Type: "
				/>
				<BasicStat
					statName={"enhancementType"}
					statValue={Form.head.details.enhancementType}
					isEditing={isEditing}
					spanStyle={requirementNameStyle}
					spanText="Enhancement Type: "
				/>
				{Form.head.details.initialEnhancement ? (
					<li>
						<p>
							<span className={requirementNameStyle}>
								Initial Enhancement:
							</span>{" "}
							<a
								href={Form.head.details.initialEnhancement.url}
								target="_blank"
								className="text-dbu-link hover:underline"
							>
								{Form.head.details.initialEnhancement.name}
							</a>
						</p>
					</li>
				) : (
					<></>
				)}
				<BasicStat
					statName="awakeningType"
					statValue={Form.head.details.awakeningType}
					isEditing={isEditing}
					spanStyle={requirementNameStyle}
					spanText="Awakening Type: "
				/>
				<BasicStat
					statName="awakeningOrigin"
					statValue={Form.head.details.awakeningOrigin}
					isEditing={isEditing}
					spanStyle={requirementNameStyle}
					spanText="Awakening Origin: "
				/>
				<BasicStat
					statName="maxFactor"
					statValue={Form.head.details.maxFactor}
					isEditing={isEditing}
					spanStyle={requirementNameStyle}
					spanText="Maximum Factor: "
				/>
				<BasicStat
					statName="preReq"
					statValue={Form.head.details.preReq}
					isEditing={isEditing}
					spanStyle={requirementNameStyle}
					spanText="Prerequisite(s): "
				/>
				<BasicStat
					statName="transLine"
					statValue={Form.head.details.transLine}
					isEditing={isEditing}
					spanStyle={requirementNameStyle}
					spanText="Transformation Line: "
				/>
				<BasicStat
					statName="transStage"
					statValue={Form.head.details.transStage}
					isEditing={isEditing}
					spanStyle={requirementNameStyle}
					spanText="Transformation Stage: "
				/>
				<BasicStat
					statName="stressTest"
					statValue={Form.head.details.stressTest}
					isEditing={isEditing}
					spanStyle={requirementNameStyle}
					spanText="Stress Test Requirement: "
				/>
				<BasicStat
					statName="maxStacks"
					statValue={
						(Object.hasOwn(Form.head.details, "maxStacks") &&
							Form.head.details.maxStacks.toString()) ||
						undefined
					}
					isEditing={isEditing}
					spanStyle={requirementNameStyle}
					spanText="Maximum No of Stacks: "
				/>

				{Object.hasOwn(Form.head.details, "tier") ? (
					(Form.head.details.tier.length > 0 || isEditing) && (
						<li>
							<p>
								<span className={requirementNameStyle}>
									Tier of Power Requirement:{" "}
								</span>{" "}
								{isEditing ? (
									<EditableText
										path="head.details.tier"
										value={String(Form.head.details.tier)}
									/>
								) : (
									currentTier +
									(!Number.isNaN(Number(currentTier))
										? "+"
										: "")
								)}
							</p>
						</li>
					)
				) : (
					<></>
				)}
				<Aspects
					aspects={Form.head.details.aspects}
					customAspectNames={customAspectNames}
					isEditing={isEditing}
					spanStyle={requirementNameStyle}
					aspectsReady={aspectsReady}
					pendingChanges={pendingChanges}
					handleAspectChange={handleAspectChange}
				/>
			</ul>
			<AttributeModsTable
				attrTable={Form.head.details.attributeModifiers}
				isEditing={isEditing}
				pendingChanges={pendingChanges}
			/>
			<Tooltip
				id="my-tooltip"
				className="tooltip"
				style={{ maxWidth: "400px" }}
			/>
		</div>
	);
}

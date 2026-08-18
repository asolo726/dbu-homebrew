"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "../../../lib/reactTooltip";
import PageVoteButtons from "../../pages/PageVoteButtons";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";
import { loadAspects, getCustomAspectNames } from "./util/headUtil";
import { ScrollToTop } from "../../navigation/ScrollBackToTopButton";
import BasicStat from "./headHelpers/BasicStats";
import AttributeModsTable from "./headHelpers/AttributeTable";
import Aspects from "./headHelpers/Aspects";

export default function Head({ Form }) {
    const editMode = useEditMode();
    const { isEditing, pendingChanges, setChange, toggleStatus, isAdmin } =
        editMode || {};
    const isAuthor = editMode !== null;
    const requirementNameStyle = "font-bold text-dbu-header";
    const [uploading, setUploading] = useState(false);
    const [toggling, setToggling] = useState(false);
    const [localPublic, setLocalPublic] = useState(null);
    const router = useRouter();
    const toggle = Form.head.toggle;
    const author = Form.head.author;
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

    // Allows users to upload an image and set the banner URL in the head object.
    async function handleImageUpload(file) {
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
        if (hasVisited !== Form.head.keyName) {
            ScrollToTop("instant");
            sessionStorage.setItem("hasVisitedPage", Form.head.keyName);
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
    const currentTier = pendingChanges?.["head.tier"] ?? Form.head.tier;

    const currentIsCommunity =
        pendingChanges?.["head.isCommunity"] ?? Form.head.isCommunity ?? false;

    // Community pages always hide the author credit
    const currentDontShowAuthor =
        currentIsCommunity ||
        (pendingChanges?.["head.dontShowAuthor"] ??
            Form.head.dontShowAuthor ??
            false);

    return (
        <div className="grow">
            <div className="flex items-center justify-center gap-2 mb-4">
                <h1 className="text-dbu-header text-[2em] sm:text-[3em] font-bold text-center tracking-wide">
                    {Form.head.title}
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

            {/* Author line — always visible in edit mode so the toggle is accessible */}
            {(isEditing || !currentDontShowAuthor) && (
                <div className="flex items-center justify-center gap-2 mb-10">
                    <h3
                        className={`text-dbu-header text-[1.5em] sm:text-[1.8em] italic text-center transition-opacity ${
                            isEditing && currentDontShowAuthor
                                ? "line-through opacity-40"
                                : ""
                        }`}
                    >
                        by {Form.head.author}
                    </h3>
                    {isEditing && !currentIsCommunity && (
                        <button
                            type="button"
                            onClick={() =>
                                setChange?.(
                                    "head.dontShowAuthor",
                                    !currentDontShowAuthor,
                                )
                            }
                            title={
                                currentDontShowAuthor
                                    ? "Show author credit"
                                    : "Hide author credit"
                            }
                            className="text-xs px-2 py-1 rounded border border-dbu-line text-dbu-text/60 hover:text-dbu-header hover:border-dbu-header transition-colors shrink-0"
                        >
                            {currentDontShowAuthor ? "Show" : "Hide"}
                        </button>
                    )}
                </div>
            )}

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
                        Form.head.bannerAuthor &&
                        Form.head.bannerAuthor !== ""
                            ? `Art Credit: ${Form.head.bannerAuthor}`
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
                        path="head.bannerAuthor"
                        value={Form.head.bannerAuthor || ""}
                        className="text-xs"
                    />
                </p>
            )}

            <div className="flex flex-col items-center justify-center mr-5 mb-3">
                <PageVoteButtons
                    keyName={Form.head.keyName}
                    initialUpvotes={Form.head.upvotes ?? 0}
                />
                <p className="italic text-sm text-gray-500">
                    Like this homebrew? Give it an upvote!
                </p>
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
                    statValue={Form.head.raceReq}
                    isEditing={isEditing}
                    spanStyle={requirementNameStyle}
                    spanText="Racial Requirement: "
                />
                <BasicStat
                    statName={"evolvedStageType"}
                    statValue={Form.head.evolvedStageType}
                    isEditing={isEditing}
                    spanStyle={requirementNameStyle}
                    spanText="Evolved Stage Type: "
                />
                <BasicStat
                    statName={"transformationType"}
                    statValue={Form.head.transformationType}
                    isEditing={isEditing}
                    spanStyle={requirementNameStyle}
                    spanText="Transformation Type: "
                />
                <BasicStat
                    statName={"formType"}
                    statValue={Form.head.formType}
                    isEditing={isEditing}
                    spanStyle={requirementNameStyle}
                    spanText="Form Type: "
                />
                <BasicStat
                    statName={"enhancementType"}
                    statValue={Form.head.enhancementType}
                    isEditing={isEditing}
                    spanStyle={requirementNameStyle}
                    spanText="Enhancement Type: "
                />
                {Form.head.initialEnhancement ? (
                    <li>
                        <p>
                            <span className={requirementNameStyle}>
                                Initial Enhancement:
                            </span>{" "}
                            <a
                                href={Form.head.initialEnhancement[1]}
                                target="_blank"
                                className="text-dbu-link hover:underline"
                            >
                                {Form.head.initialEnhancement[0]}
                            </a>
                        </p>
                    </li>
                ) : (
                    <></>
                )}
                <BasicStat
                    statName="awakeningType"
                    statValue={Form.head.awakeningType}
                    isEditing={isEditing}
                    spanStyle={requirementNameStyle}
                    spanText="Awakening Type: "
                />
                <BasicStat
                    statName="awakeningOrigin"
                    statValue={Form.head.awakeningOrigin}
                    isEditing={isEditing}
                    spanStyle={requirementNameStyle}
                    spanText="Awakening Origin: "
                />
                <BasicStat
                    statName="maxFactor"
                    statValue={Form.head.maxFactor}
                    isEditing={isEditing}
                    spanStyle={requirementNameStyle}
                    spanText="Maximum Factor: "
                />
                <BasicStat
                    statName="preReq"
                    statValue={Form.head.preReq}
                    isEditing={isEditing}
                    spanStyle={requirementNameStyle}
                    spanText="Prerequisite(s): "
                />
                <BasicStat
                    statName="transLine"
                    statValue={Form.head.transLine} 
                    isEditing={isEditing}
                    spanStyle={requirementNameStyle}
                    spanText="Transformation Line: "
                />
                <BasicStat
                    statName="transStage"
                    statValue={Form.head.transStage}
                    isEditing={isEditing}
                    spanStyle={requirementNameStyle}
                    spanText="Transformation Stage: "
                />
                <BasicStat
                    statName="stress"
                    statValue={Form.head.stress}
                    isEditing={isEditing}
                    spanStyle={requirementNameStyle}
                    spanText="Stress Test Requirement: "
                />
                <BasicStat
                    statName="maxStacks"
                    statValue={Object.hasOwn(Form.head, "maxStacks") && Form.head.maxStacks.toString() || undefined}
                    isEditing={isEditing}
                    spanStyle={requirementNameStyle}
                    spanText="Maximum No of Stacks: "
                />
                
                {Object.hasOwn(Form.head, "tier") ? (Form.head.tier.length > 0 || isEditing) && (
                    <li>
                        <p>
                            <span className={requirementNameStyle}>
                                Tier of Power Requirement:{" "}
                            </span>{" "}
                            {isEditing ? (
                                <EditableText
                                    path="head.tier"
                                    value={String(Form.head.tier)}
                                />
                            ) : (
                                currentTier +
                                (!Number.isNaN(Number(currentTier)) ? "+" : "")
                            )}
                        </p>
                    </li>
                ) : <></>}
                <Aspects
                    aspects={Form.head.aspects}
                    customAspectNames={customAspectNames}
                    isEditing={isEditing}
                    spanStyle={requirementNameStyle}
                    aspectsReady={aspectsReady}
                />
            </ul>
            <AttributeModsTable
                attrTable={Form.head.attributeModifiers}
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

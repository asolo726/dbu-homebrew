"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { aspectData } from "../../Aspects/aspectData";
import { Tooltip } from "../../../lib/reactTooltip";
import PageVoteButtons from "../../pages/PageVoteButtons";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";

const getAspectTooltip = (aspectName) => {
  const cleanName = aspectName.replace(/\s*\(.*?\)$/, "");
  const aspectInfo = aspectData[cleanName];
  const isPositive = aspectInfo.type === "Positive";
  const textColorClass = isPositive
    ? "text-dbu-pos-aspect"
    : "text-dbu-neg-aspect";

  return `<div class="p-3">
    <div class="text-lg font-bold ${textColorClass} mb-1">
      ${cleanName}
    </div>
    <div class="italic text-sm mb-2 text-gray-300">
      ${aspectInfo.type} Aspect
    </div>
    <div class="text-sm leading-relaxed text-gray-100">
      ${aspectInfo.effects}
    </div>
  </div>`;
};

export default function Head({ Form }) {
  const editMode = useEditMode();
  const { isEditing, pendingChanges, setChange, toggleStatus, isAdmin } = editMode || {};
  const isAuthor = editMode !== null;
  const requirementNameStyle = "font-bold text-dbu-header";
  const [uploading, setUploading] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [localPublic, setLocalPublic] = useState(null);
  const router = useRouter();
  const toggle = Form.head.toggle;
  const author = Form.head.author;

  const isPublic = localPublic !== null ? localPublic : (!toggle || !!toggleStatus);

  async function handleTogglePublish() {
    if (!toggle || toggling) return;
    setToggling(true);
    try {
      const res = await fetch("/api/settings/toggles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toggleName: toggle, enabled: !isPublic, targetAuthor: author }),
      });
      if (res.ok) {
        setLocalPublic(!isPublic);
        router.refresh();
      }
    } finally {
      setToggling(false);
    }
  }

  const areAuthorAndBannerAuthorDifferent = () => {
    try {
      return !(
        Form.head.bannerAuthor.toLowerCase() === author.toLowerCase()
      );
    } catch (e) {
      return false;
    }
  };

  const currentBanner =
    pendingChanges?.["head.banner"] ??
    (Form.head.banner !== "" ? Form.head.banner : null) ??
    "https://9pensrt47gzxrsro.public.blob.vercel-storage.com/whosthatzfighter.webp";

  // Get current (possibly pending) value of tier for formatting
  const currentTier = pendingChanges?.["head.tier"] ?? Form.head.tier;

  const currentIsCommunity = pendingChanges?.["head.isCommunity"] ?? Form.head.isCommunity ?? false;

  // Community pages always hide the author credit
  const currentDontShowAuthor =
    currentIsCommunity || (pendingChanges?.["head.dontShowAuthor"] ?? Form.head.dontShowAuthor ?? false);

  async function handleImageUpload(file) {
    if (!file || !setChange) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploadImage", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setChange("head.banner", data.url);
    } finally {
      setUploading(false);
    }
  }

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
        {isAuthor && (
          isEditing && toggle ? (
            <button
              onClick={handleTogglePublish}
              disabled={toggling}
              title={isPublic ? "Click to hide this page" : "Click to publish this page"}
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
          )
        )}
      </div>

      {/* Author line — always visible in edit mode so the toggle is accessible */}
      {(isEditing || !currentDontShowAuthor) && (
        <div className="flex items-center justify-center gap-2 mb-10">
          <h3
            className={`text-dbu-header text-[1.5em] sm:text-[1.8em] italic text-center transition-opacity ${
              isEditing && currentDontShowAuthor ? "line-through opacity-40" : ""
            }`}
          >
            by {Form.head.author}
          </h3>
          {isEditing && !currentIsCommunity && (
            <button
              onClick={() => setChange?.("head.dontShowAuthor", !currentDontShowAuthor)}
              title={currentDontShowAuthor ? "Show author credit" : "Hide author credit"}
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
        href={!isEditing ? currentBanner : undefined}
        target={!isEditing ? "_blank" : undefined}
        rel="noreferrer"
      >
        <div
          className="relative cursor-default"
          data-tooltip-id="art-credit-tooltip"
          data-tooltip-content={
            !isEditing &&
            Form.head.bannerAuthor &&
            Form.head.bannerAuthor !== "" &&
            areAuthorAndBannerAuthorDifferent()
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
      <p className="text-pretty text-md tracking-wide md:text-lg whitespace-pre-wrap">
        <EditableText path="head.desc" value={Form.head.desc} />
      </p>
      <ul className="list-disc ml-10 mt-3 text-md md:text-lg">
        {Form.head.raceReq ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Racial Requirement:</span>{" "}
              <EditableText path="head.raceReq" value={Form.head.raceReq} />
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.evolvedStageType ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Evolved Stage Type:</span>{" "}
              <EditableText path="head.evolvedStageType" value={Form.head.evolvedStageType} />
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.transformationType ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Transformation Type:</span>{" "}
              <EditableText path="head.transformationType" value={Form.head.transformationType} />
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.formType ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Form Type:</span>{" "}
              <EditableText path="head.formType" value={Form.head.formType} />
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.enhancementType ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Enhancement Type:</span>{" "}
              <EditableText path="head.enhancementType" value={Form.head.enhancementType} />
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.initialEnhancement ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Initial Enhancement:</span>{" "}
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
        {Form.head.awakeningType ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Awakening Type:</span>{" "}
              <EditableText path="head.awakeningType" value={Form.head.awakeningType} />
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.awakeningOrigin ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Awakening Origin:</span>{" "}
              <EditableText path="head.awakeningOrigin" value={Form.head.awakeningOrigin} />
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.maxFactor ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Maximum Factor:</span>{" "}
              <EditableText path="head.maxFactor" value={Form.head.maxFactor} />
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.preReq ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Prerequisite(s): </span>{" "}
              <EditableText path="head.preReq" value={Form.head.preReq} />
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.transLine ? (
          <li>
            <p>
              <span className={requirementNameStyle}>
                Transformation Line:{" "}
              </span>{" "}
              <EditableText path="head.transLine" value={Form.head.transLine} />
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.transStage ? (
          <li>
            <p>
              <span className={requirementNameStyle}>
                Transformation Stage:{" "}
              </span>{" "}
              <EditableText path="head.transStage" value={Form.head.transStage} />
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.stress ? (
          <li>
            <p>
              <span className={requirementNameStyle}>
                Stress Test Requirement:{" "}
              </span>
              <EditableText path="head.stress" value={Form.head.stress} />
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.maxStacks ? (
          <li>
            <p>
              <span className={requirementNameStyle}>
                Maximum No of Stacks:{" "}
              </span>
              <EditableText path="head.maxStacks" value={Form.head.maxStacks} />
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.tier ? (
          <li>
            <p>
              <span className={requirementNameStyle}>
                Tier of Power Requirement:{" "}
              </span>{" "}
              {isEditing ? (
                <EditableText path="head.tier" value={String(Form.head.tier)} />
              ) : (
                currentTier + (!Number.isNaN(Number(currentTier)) ? "+" : "")
              )}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.aspects && Form.head.aspects.length > 0 ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Aspects: </span>{" "}
              {Form.head.aspects.map((aspect, id) => {
                const lastAspect = id === Form.head.aspects.length - 1;
                return (
                  <span key={id}>
                    <a
                      data-tooltip-id="my-tooltip"
                      data-tooltip-html={getAspectTooltip(aspect.name)}
                      className="cursor-help"
                    >
                      {aspect.name}
                    </a>
                    {aspect.link && (
                      <>
                        {" "}
                        (
                        <a
                          href={aspect.link.url}
                          target="_blank"
                          className="text-dbu-link hover:underline"
                        >
                          {aspect.link.name}
                        </a>
                        )
                      </>
                    )}
                    {aspect.level !== 0 && <> (LV{aspect.level})</>}
                    {!lastAspect && ", "}
                  </span>
                );
              })}
            </p>
          </li>
        ) : (
          <></>
        )}
      </ul>
      {Form.head.attributeModifiers &&
      Form.head.attributeModifiers.length > 0 ? (
        <div className="flex justify-center py-5">
          <table className="table-fixed w-full border-collapse text-center text-md md:text-xl font-light ">
            <thead>
              <tr>
                {Form.head.attributeModifiers.map((modifier, id) => (
                  <th
                    key={id}
                    className="border border-dbu-header min-w-[3em] max-w-[10em] py-2 break-all"
                  >
                    {modifier.attribute}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Form.head.attributeModifiers.map((modifier, id) => {
                  const currentBonus = pendingChanges?.[`head.attributeModifiers.${id}.Bonus`] ?? modifier.Bonus;
                  const currentMultiplier = pendingChanges?.[`head.attributeModifiers.${id}.Multiplier`] ?? modifier.Multiplier;
                  return (
                    <td
                      className="border border-dbu-header min-w-[3em] max-w-[10em] py-2 break-all"
                      key={id}
                    >
                      {isEditing ? (
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-0.5">
                            +<EditableText
                              path={`head.attributeModifiers.${id}.Bonus`}
                              value={String(modifier.Bonus)}
                              className="w-10 text-center"
                            />
                          </div>
                          <EditableText
                            path={`head.attributeModifiers.${id}.Multiplier`}
                            value={modifier.Multiplier}
                            className="w-full text-center text-sm"
                          />
                        </div>
                      ) : currentBonus > 0 ? (
                        currentMultiplier.length === 0
                          ? `+${currentBonus}`
                          : `+${currentBonus}(${currentMultiplier})`
                      ) : (
                        "-"
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <></>
      )}
      <Tooltip
        id="my-tooltip"
        className="tooltip"
        style={{ maxWidth: "400px" }}
      />
    </div>
  );
}

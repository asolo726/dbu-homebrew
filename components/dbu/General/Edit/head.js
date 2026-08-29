import Image from "next/image";
import { aspectData } from "../../Aspects/aspectData";
import { Tooltip } from "../../../lib/reactTooltip";

/**
 * Generates formatted HTML tooltip for an aspect
 */
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

/**
 *
 * @returns Editable Head of the page. Including Title, Banner, Requirements, and Stat Buff Table
 */
export default function HeadEdit({ Form }) {
  const requirementNameStyle = "font-bold text-dbu-header";
  const areAuthorAndBannerAuthorDifferent = () => {
    try {
      return !(
        Form.data.credits.bannerAuthor.toLowerCase() === Form.data.author.toLowerCase()
      );
    } catch (e) {
      // This is an easy way for accounting for cases where either bannerAuthor or author aren't present.
      return false;
    }
  };
  const imageSrc =
    Form.head.banner != ""
      ? Form.head.banner
      : "https://9pensrt47gzxrsro.public.blob.vercel-storage.com/whosthatzfighter.webp";
  return (
    <div className="grow">
      <h1 className="text-dbu-header text-[2em] sm:text-[3em] font-bold text-center mb-4 tracking-wide">
        {Form.data.title}
      </h1>
      {!Form.data.management.dontShowAuthor ? (
        <h3 className="text-dbu-header text-[1.5em] sm:text-[1.8em] italic text-center mb-10">
          by {Form.data.author}
        </h3>
      ) : (
        <></>
      )}
      <Image
        src={
          Form.head.banner != ""
            ? Form.head.banner
            : "https://9pensrt47gzxrsro.public.blob.vercel-storage.com/whosthatzfighter.webp"
        }
        className="justify-self-center max-w-full mb-5"
        width={1500}
        height={1500}
        alt=""
        priority={true}
      />
      {Form.data.credits.bannerAuthor != "" &&
      Form.data.credits.bannerAuthor &&
      areAuthorAndBannerAuthorDifferent ? (
        <p className="text-md md:text-lg text-center mb-3">
          (Art Credit: {Form.data.credits.bannerAuthor})
        </p>
      ) : (
        <></>
      )}
      <p className="text-pretty text-md tracking-wide md:text-lg whitespace-pre-wrap">
        {Form.head.desc}
      </p>
      <ul className="list-disc ml-10 mt-3 text-md md:text-lg">
        {Form.head.details.raceReq ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Racial Requirement:</span>{" "}
              {Form.head.details.raceReq}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.details.evolvedStageType ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Evolved Stage Type:</span>{" "}
              {Form.head.details.evolvedStageType}
            </p>
          </li>
        ) : (
          <></>
        )}
        {/** Need to change this */}
        {Form.head.details.transformationType ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Transformation Type:</span>{" "}
              {Form.head.details.transformationType}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.details.formType ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Form Type:</span>{" "}
              {Form.head.details.formType}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.details.enhancementType ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Enhancement Type:</span>{" "}
              {Form.head.details.enhancementType}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.details.initialEnhancement ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Initial Enhancement:</span>{" "}
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
        {Form.head.details.awakeningType ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Awakening Type:</span>{" "}
              {Form.head.details.awakeningType}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.details.awakeningOrigin ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Awakening Origin:</span>{" "}
              {Form.head.details.awakeningOrigin}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.details.maxFactor ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Maximum Factor:</span>{" "}
              {Form.head.details.maxFactor}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.details.preReq ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Prerequisite(s): </span>{" "}
              {Form.head.details.preReq}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.details.transLine ? (
          <li>
            <p>
              <span className={requirementNameStyle}>
                Transformation Line:{" "}
              </span>{" "}
              {Form.head.details.transLine}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.details.transStage ? (
          <li>
            <p>
              <span className={requirementNameStyle}>
                Transformation Stage:{" "}
              </span>{" "}
              {Form.head.details.transStage}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.details.stress ? (
          <li>
            <p>
              <span className={requirementNameStyle}>
                Stress Test Requirement:{" "}
              </span>
              {Form.head.details.stress}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.details.maxStacks ? (
          <li>
            <p>
              <span className={requirementNameStyle}>
                Maximum No of Stacks:{" "}
              </span>
              {Form.head.details.maxStacks}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.details.tier ? (
          <li>
            <p>
              <span className={requirementNameStyle}>
                Tier of Power Requirement:{" "}
              </span>{" "}
              {Form.head.details.tier +
                (!Number.isNaN(Number(Form.head.details.tier)) ? "+" : "")}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.details.aspects && Form.head.details.aspects.length > 0 ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Aspects: </span>{" "}
              {Form.head.details.aspects.map((aspect, id) => {
                const lastAspect = id === Form.head.details.aspects.length - 1;
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
      {Form.head.details.attributeModifiers &&
      Form.head.details.attributeModifiers.length > 0 ? (
        <div className="flex justify-center py-5">
          <table className="table-fixed w-full border-collapse text-center text-md md:text-xl font-light ">
            <thead>
              <tr>
                {Form.head.details.attributeModifiers.map((modifier, id) => (
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
                {Form.head.details.attributeModifiers.map((modifier, id) =>
                  modifier.Bonus > 0 ? (
                    <td
                      className="border border-dbu-header min-w-[3em] max-w-[10em] py-2 break-all"
                      key={id}
                    >
                      {modifier.Multiplier.length === 0
                        ? `+${modifier.Bonus}`
                        : `+${modifier.Bonus}(${modifier.Multiplier})`}
                    </td>
                  ) : (
                    <td
                      className="border border-dbu-header min-w-[3em] max-w-[10em] py-2 break-all"
                      key={id}
                    >
                      -
                    </td>
                  ),
                )}
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

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
 * @returns Head of the page. Including Title, Banner, Requirements, and Stat Buff Table
 */
export default function Head({ Form }) {
  const requirementNameStyle = "font-bold text-dbu-header";
  return (
    <div className="flex-grow-1">
      <h1 className="text-dbu-header text-[2em] sm:text-[3em] font-bold text-center mb-4 tracking-wide">
        {Form.head.title}
      </h1>
      <h3 className="text-dbu-header text-[1.5em] sm:text-[1.8em] italic text-center mb-10">
        by {Form.head.author}
      </h3>
      {console.log(Form.head.banner == "")}
      <Image
        src={
          Form.head.banner != ""
            ? Form.head.banner
            : "https://9pensrt47gzxrsro.public.blob.vercel-storage.com/whosthatzfighter.webp"
        }
        className="justify-self-center max-w-[100%] mb-5"
        width={1500}
        height={1500}
        alt=""
        priority={true}
      />
      {Form.head.bannerAuthor != "" || Form.head.bannerAuthor ? (
        <p className="text-md md:text-lg text-center mb-3">
          (Art Credit: {Form.head.bannerAuthor})
        </p>
      ) : (
        <></>
      )}
      <p className="text-pretty text-md tracking-wide md:text-lg">
        {Form.head.desc}
      </p>
      <ul className="list-disc ml-10 mt-3 text-md md:text-lg">
        {Form.head.raceReq ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Racial Requirement:</span>{" "}
              {Form.head.raceReq}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.evolvedStageType ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Evolved Stage Type:</span>{" "}
              {Form.head.evolvedStageType}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.transformationType ? (
        <li>
          <p>
            <span className={requirementNameStyle}>Transformation Type:</span>{" "}
            {Form.head.transformationType}
          </p>
        </li>) : (
          <></>
        )}
        {Form.head.formType ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Form Type:</span>{" "}
              {Form.head.formType}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.enhancementType ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Enhancement Type:</span>{" "}
              {Form.head.enhancementType}
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
              {Form.head.awakeningType}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.awakeningOrigin ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Awakening Origin:</span>{" "}
              {Form.head.awakeningOrigin}
            </p>
          </li>
        ) : (
          <></>
        )}
        {Form.head.maxFactor ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Maximum Factor:</span>{" "}
              {Form.head.maxFactor}
            </p>
          </li>
        ) : (
          <></>
        )}
        <li>
          <p>
            <span className={requirementNameStyle}>Prerequisite(s): </span>{" "}
            {Form.head.preReq}
          </p>
        </li>
        {Form.head.transLine ? (
          <li>
            <p>
              <span className={requirementNameStyle}>
                Transformation Line:{" "}
              </span>{" "}
              {Form.head.transLine}
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
              {Form.head.transStage}
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
              {Form.head.stress}
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
              {Form.head.maxStacks}
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
            {Form.head.tier +
              (!Number.isNaN(Number(Form.head.tier)) ? "+" : "")}
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
      <div className="flex justify-center py-5">
        {Form.head.attributeModifiers && Form.head.attributeModifiers.length > 0 ? (
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
              {Form.head.attributeModifiers.map((modifier, id) =>
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
        </table>) : (
          <></>
        )}
        <Tooltip
          id="my-tooltip"
          className="tooltip"
          style={{ maxWidth: "400px" }}
        />
      </div>
    </div>
  );
}

import Image from "next/image";
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
      <Image
        src={Form.head.banner}
        className="justify-self-center max-w-[100%] mb-5"
        width={1500}
        height={1500}
        alt=""
        priority={true}
      />
      {Form.head.bannerAuthor != "" ? (
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
        <li>
          <p>
            <span className={requirementNameStyle}>Transformation Type:</span>{" "}
            {Form.head.type}
          </p>
        </li>
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
        <li>
          <p>
            <span className={requirementNameStyle}>
              Tier of Power Requirement:{" "}
            </span>{" "}
            {Form.head.tier +
              (!Number.isNaN(Number(Form.head.tier)) ? "+" : "")}
          </p>
        </li>
        {Form.head.aspects.length > 0 ? (
          <li>
            <p>
              <span className={requirementNameStyle}>Aspects: </span>{" "}
              {Form.head.aspects.map((aspect, id) =>
                id === Form.head.aspects.length - 1
                  ? aspect.name +
                    (aspect.level === 0 ? " " : " (LV" + aspect.level + ") ")
                  : aspect.name +
                    (aspect.level === 0 ? ", " : " (LV" + aspect.level + "), "),
              )}
            </p>
          </li>
        ) : (
          <></>
        )}
      </ul>
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
        </table>
      </div>
    </div>
  );
}

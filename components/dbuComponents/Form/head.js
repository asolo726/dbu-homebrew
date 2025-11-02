import Image from "next/image";
/**
 *
 * @returns Head of the page. Including Title, Banner, Requirements, and Stat Buff Table
 */
export default function Head(props) {
    const requirementNameStyle = "font-bold text-dbu-header";
    return (
        <div className="flex-grow-1">
            <h1 className="text-dbu-header text-[2em] sm:text-[3em] font-bold text-center mb-4 tracking-wide">
                {props.title}
            </h1>
            <h3 className="text-dbu-header text-[1.5em] sm:text-[1.8em] italic text-center mb-10">
                by {props.author}
            </h3>
            <Image
                src={props.banner}
                className="justify-self-center max-w-[100%] mb-5"
                width={1500}
                height={1500}
                alt=""
            />
            <p className="text-pretty text-md tracking-wide md:text-lg">
                {props.mainDesc}
            </p>
            <ul className="list-disc ml-10 mt-3 text-md md:text-lg">
                <li>
                    <p>
                        <span className={requirementNameStyle}>
                            Racial Requirement:
                        </span>{" "}
                        {props.raceReq}
                    </p>
                </li>
                <li>
                    <p>
                        <span className={requirementNameStyle}>
                            Transformation Type:
                        </span>{" "}
                        Enhancement Power
                    </p>
                </li>
                <li>
                    <p>
                        <span className={requirementNameStyle}>
                            Prerequisite(s):{" "}
                        </span>{" "}
                        {props.preReq}
                    </p>
                </li>
                {/* {props.transLine.length > 0 ? (
                    <li>
                        <p>
                            <span className={requirementNameStyle}>
                                Transformation Line:{" "}
                            </span>{" "}
                            {props.transLine}
                        </p>
                    </li>
                ) : <></>}
                {props.transStage.length > 0 ? (
                    <li>
                        <p>
                            <span className={requirementNameStyle}>
                                Transformation Stage:{" "}
                            </span>{" "}
                            {props.transStage}
                        </p>
                    </li>
                ): <></>} */}
                {props.stress !== "" && (
                    <li>
                        <p>
                            <span className={requirementNameStyle}>
                                Stress Test Requirement:{" "}
                            </span>
                            {props.stress}
                        </p>
                    </li>
                )}
                <li>
                    <p>
                        <span className={requirementNameStyle}>
                            Tier of Power Requirement{" "}
                        </span>{" "}
                        {props.tier}
                    </p>
                </li>
                <li>
                    <p>
                        <span className={requirementNameStyle}>Aspects </span>{" "}
                        {props.aspects.map((aspect, id) =>
                            id === props.aspects.length - 1
                                ? aspect.name +
                                  (aspect.level === 0
                                      ? " "
                                      : " (LV" + aspect.level + ") ")
                                : aspect.name +
                                  (aspect.level === 0
                                      ? ", "
                                      : " (LV" + aspect.level + "), ")
                        )}
                    </p>
                </li>
            </ul>
            <div className="flex justify-center py-5">
                <table className="table-fixed w-full border-collapse text-center text-xl font-light ">
                    <thead>
                        <tr>
                            {props.attributeModifiers.map((modifier, id) => (
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
                            {props.attributeModifiers.map((modifier, id) =>
                                modifier.Bonus > 0 ? (
                                    <td
                                        className="border border-dbu-header min-w-[3em] max-w-[10em] py-2 break-all"
                                        key={id}
                                    >
                                        {`+${modifier.Bonus}(${modifier.Multiplier})`}
                                    </td>
                                ) : (
                                    <td
                                        className="border border-dbu-header min-w-[3em] max-w-[10em] py-2 break-all"
                                        key={id}
                                    >
                                        -
                                    </td>
                                )
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

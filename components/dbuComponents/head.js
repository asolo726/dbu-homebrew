/**
 *
 * @returns Head of the page. Including Title, Banner, Requirements, and Stat Buff Table
 */
export default function Head(props) {
    const requirementNameStyle = "font-bold text-dbu-header";
    return (
        <div className="">
            <h1 className="text-dbu-header text-5xl font-bold text-center">{props.title}</h1>
            <img src={props.banner} width="100%" height="100%" />
            <p>{props.mainDesc}</p>
            {/* 
            Racial Requirement: Any
            Transformation Type: Enhancement Power
            Prerequisite(s): Access to the God Ki Special State
            Stress Test Requirement: 18
            Tier of Power Requirement. 6+
            Aspects: God Ki, Mindful (LV2), Strainless, Weakening*/}
            <ul className="">
                <li className="">
                    <p><span className={requirementNameStyle}>Racial Requirement: </span> {props.race} </p>
                </li>
                <li>
                    <p className={requirementNameStyle}>Transformation Type</p>
                    <p>{props.type}</p>
                </li>
                <li>
                    <p>Prerequisite(s)</p>
                    <p>{props.prereq}</p>
                </li>
                <li>
                    <p>Stress Test Requirement</p>
                    <p>{props.stress}</p>
                </li>
                <li>
                    <p>Tier of Power Requirement</p>
                    <p>{props.tier}</p>
                </li>
                <li>
                    <p>Aspects</p>
                    <p>{props.aspects}</p>
                </li>
            </ul>
        </div>
    );
}

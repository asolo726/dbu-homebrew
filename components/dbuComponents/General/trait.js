import Ability from "./ability";
export default function Trait({title = "", desc = "", abilities}) {
    
    return (
        <div className="flex-grow-1 mt-2">
            { title == "" && desc == "" ? 
                <p className="text-dbu-text text-md md:text-lg text-left">
                    <span className="font-bold text-dbu-header">{title}:</span>{" "}
                    {desc}
            </p> : "" }
            <Ability abilityList={abilities} />
        </div>
    );
}

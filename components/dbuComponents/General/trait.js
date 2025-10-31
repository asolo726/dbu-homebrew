import Ability from "./ability";
export default function Trait({traitIntro, abilities}) {
    
    return (
        <div className="flex-grow-1">
            <p className="text-dbu-text text-md md:text-lg text-left">
                <span className="font-bold text-dbu-header">{traitIntro.title}:</span>{" "}
                {traitIntro.desc}
            </p>
            <Ability abilityList={abilities} />
        </div>
    );
}

import Ability from "../General/ability";
export default function MasteryTrait({title = "", desc = "", ability}) {
    return (
        <div className="mt-10">
            <p className="text-dbu-header text-center text-md md:text-2xl my-3 font-bold tracking-widest">
                MASTERY TRAIT
            </p>
            <p className="text-dbu-text text-md md:text-lg text-left">
                <span className="font-bold text-dbu-header">{title}:</span>{" "}
                {desc}
            </p>
            <Ability abilityList={ability} />
        </div>
    );
}

import Ability from "../General/ability";
export default function BurstLimit({ burstLimit = [] }) {
    return (
        <div className="mt-10">
            <p className="text-dbu-header text-center text-xl md:text-2xl my-3 font-bold tracking-widest">
                BURST LIMIT
            </p>
            {burstLimit.map((trait, key) => (
                <div key={key} className="">
                    <p className="text-dbu-text text-md md:text-lg text-left">
                        <span className="font-bold text-dbu-header">
                            {trait.title}:
                        </span>{" "}
                        {trait.desc}
                    </p>
                    <Ability abilityList={trait.abilities} />
                </div>
            ))}
        </div>
    );
}

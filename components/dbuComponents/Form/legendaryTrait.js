import Ability from "../General/ability";
export default function LegendaryTrait({ legendaryTraitList = [] }) {
  return (
    <div className="mt-10">
      <p className="text-dbu-header text-center text-md md:text-2xl my-3 font-bold tracking-widest">
        {legendaryTraitList.length < 1 ? "LEGENDARY TRAIT" : "LEGENDARY TRAITS"}
      </p>
      {legendaryTraitList.map((trait, key) => (
        <div key={key} className="flex-grow-1 mt-2">
          <p className="text-dbu-text text-md md:text-lg text-left">
            <span className="font-bold text-dbu-header">{trait.title}:</span>{" "}
            {trait.desc}
          </p>
          <Ability abilityList={trait.abilities} />
        </div>
      ))}
    </div>
  );
}

import Ability from "../General/ability";
export default function MasteryTrait({ masteryTraitList = [] }) {
  return (
    <div className="mt-10">
      <p className="text-dbu-header text-center text-md md:text-2xl my-3 font-bold tracking-widest">
        {masteryTraitList.length < 2 ? "MASTERY TRAIT" : "MASTERY TRAIT(S)"}
      </p>
      {masteryTraitList.map((trait, key) => (
        <div key={key} className="flex-grow-1 mt-2">
          <p className="text-dbu-text text-md md:text-lg text-left">
            <span className="font-bold text-dbu-header">
              {trait.title + (key > 1 ? ` (${key})` : "")}:
            </span>{" "}
            {trait.desc}
          </p>
          <Ability abilityList={trait.abilities} />
        </div>
      ))}
    </div>
  );
}

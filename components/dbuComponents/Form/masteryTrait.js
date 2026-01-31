import Ability from "../General/ability";
import Table from "../General/table";
export default function MasteryTrait({ masteryTraitList = [] }) {
  const hasMultipleMasteryTraits = masteryTraitList.length > 1;
  return (
    <div className="mt-10">
      <p className="text-dbu-header text-center text-md md:text-2xl my-3 font-bold tracking-widest">
        {!hasMultipleMasteryTraits ? "MASTERY TRAIT" : "MASTERY TRAIT(S)"}
      </p>
      {masteryTraitList.map((trait, key) => (
        <div key={key} className="flex-grow-1 mt-2">
          <p className="text-dbu-text text-md md:text-lg text-left">
            <span className="font-bold text-dbu-header">
              {trait.title + (hasMultipleMasteryTraits ? ` (${key+1})` : "")}:
            </span>{" "}
            {trait.desc}
          </p>
          <Ability abilityList={trait.abilities} />
          {trait.tables && trait.tables.map((table, tKey) => (
            <div key={tKey} className="mt-5 mb-5">
              <Table table={table} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

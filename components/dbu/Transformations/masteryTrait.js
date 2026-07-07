import Trait from "../General/trait";
import Table from "../General/table";

export default function MasteryTrait({ masteryTraitList = [], path }) {
  const hasMultipleMasteryTraits = masteryTraitList.length > 1;
  return (
    <div className="mt-10">
      <p className="text-dbu-header text-center text-md md:text-2xl my-3 font-bold tracking-widest">
        {!hasMultipleMasteryTraits ? "MASTERY TRAIT" : "MASTERY TRAIT(S)"}
      </p>
      {masteryTraitList.map((trait, key) => (
        <div key={key}>
          <Trait
            title={trait.title}
            desc={trait.desc}
            abilities={trait.abilities}
            path={path ? `${path}.${key}` : undefined}
          />
          {trait.tables &&
            trait.tables.map((table, tKey) => (
              <div key={tKey} className="mt-5 mb-5">
                <Table table={table} />
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

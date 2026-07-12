import Trait from "../General/trait";

export default function LegendaryTrait({ legendaryTraitList = [], path }) {
  return (
    <div className="mt-10">
      <p className="text-dbu-header text-center text-md md:text-2xl my-3 font-bold tracking-widest">
        {legendaryTraitList.length < 1 ? "LEGENDARY TRAIT" : "LEGENDARY TRAITS"}
      </p>
      {legendaryTraitList.map((trait, key) => (
        <Trait
          key={key}
          title={trait.title}
          desc={trait.desc}
          abilities={trait.abilities}
          path={path ? `${path}.${key}` : undefined}
        />
      ))}
    </div>
  );
}

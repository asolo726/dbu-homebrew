import Trait from "../General/trait";

export default function BurstLimit({ burstLimit = [], path }) {
  return (
    <div className="mt-10">
      <p className="text-dbu-header text-center text-xl md:text-2xl my-3 font-bold tracking-widest">
        BURST LIMIT
      </p>
      {burstLimit.map((trait, key) => (
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

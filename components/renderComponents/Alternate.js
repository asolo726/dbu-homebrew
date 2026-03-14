import Head from "../dbuComponents/General/head";
import Trait from "../../components/dbuComponents/General/trait";
import MasteryTrait from "../dbuComponents/Form/masteryTrait";

export default function AlternateRenderPage({ content }) {
  return (
    <div className="flex flex-col flex-col-1 max-w-5xl px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
      <Head Form={content} />
      {content.traits.map((trait, key) => {
        return (
          <Trait
            title={trait.title}
            desc={trait.desc}
            abilities={trait.abilities}
            key={key}
          />
        );
      })}
      <MasteryTrait masteryTraitList={content.masteryTrait} />
    </div>
  );
}

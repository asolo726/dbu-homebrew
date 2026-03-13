import Head from "../../components/dbuComponents/Form/head";
import Trait from "../../components/dbuComponents/General/trait";
import BurstLimit from "../../components/dbuComponents/Form/burstLimit";
import MasteryTrait from "../dbuComponents/Form/masteryTrait";

export default function EnhancementRenderPage({ content }) {
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
      <BurstLimit burstLimit={content.burstLimit} />
      {content.masteryTrait ? (
        <MasteryTrait masteryTraitList={content.masteryTrait} />
      ) : (
        <></>
      )}
      {/* Transcendant Traits may need to be added... follow the optional display for it like masteryTrait here*/}
    </div>
  );
}

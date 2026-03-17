import Head from "../dbu/General/head";
import Trait from "../../components/dbu/General/trait";
import MasteryTrait from "../dbu/Transformations/masteryTrait";
import LegendaryTrait from "../dbu/Transformations/legendaryTrait";
import AddendumBox from "../dbu/General/addendumBox";

export default function EvolvedStageRenderPage({ content }) {
  return (
    <div className="flex flex-col flex-col-1 w-full max-w-5xl mx-auto px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
      <Head Form={content} />
      {content.traits.map((trait, index) => {
        return (
          <Trait
            key={index}
            title={trait.title}
            desc={trait.desc}
            abilities={trait.abilities}
          />
        );
      })}
      {content.legendaryTrait ? (
        <LegendaryTrait legendaryTraitList={content.legendaryTrait} />
      ) : (
        <></>
      )}
      {content.masteryTrait ? (
        <MasteryTrait masteryTraitList={content.masteryTrait} />
      ) : (
        <></>
      )}
    </div>
  );
}

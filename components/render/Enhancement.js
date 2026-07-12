import Head from "../dbu/General/head";
import TraitsSection from "../dbu/General/TraitsSection";
import BurstLimit from "../../components/dbu/Transformations/burstLimit";
import MasteryTrait from "../dbu/Transformations/masteryTrait";

export default function EnhancementRenderPage({ content }) {
  return (
    <div className="flex flex-col flex-col-1 w-full max-w-5xl mx-auto px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
      <Head Form={content} />
      <TraitsSection traits={content.traits} basePath="traits" />
      <BurstLimit burstLimit={content.burstLimit} path="burstLimit" />
      {content.masteryTrait ? (
        <MasteryTrait masteryTraitList={content.masteryTrait} path="masteryTrait" />
      ) : (
        <></>
      )}
      {content.transcendentTrait ? (
        <div className="mt-10">
          <p className="text-dbu-header text-center text-md md:text-2xl my-3 font-bold tracking-widest">
            Transcendent Trait
          </p>
          <Trait
            title={content.transcendentTrait.title}
            desc={content.transcendentTrait.desc}
            abilities={content.transcendentTrait.abilities}
            path="transcendentTrait"
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

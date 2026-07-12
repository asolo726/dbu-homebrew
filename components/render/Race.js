import Head from "../dbu/General/head";
import TraitsSection from "../dbu/General/TraitsSection";
import RaceFeatures from "../dbu/Race/raceFeatures";

export default function RaceRenderPage({ content }) {
  const hasSubraces =
    content.subraces && content.subraces != "" && content.subraces != null;
  const header2Style =
    "text-dbu-header text-[1.5em] sm:text-[1.8em] font-bold text-center mt-5 mb-4";
  return (
    <div className="flex flex-col flex-col-1 w-full max-w-5xl mx-auto px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
      <Head Form={content} />
      <RaceFeatures
        racialLifeModifier={content.raceFeatures.racialLifeModifier}
        savingThrows={content.raceFeatures.savingThrows}
        skillRanks={content.raceFeatures.skillRanks}
        attributeScores={content.raceFeatures.attributeScores}
        minionSize={content.raceFeatures.minionSize}
        availableFactors={content.raceFeatures.availableFactors}
      />
      <p className={header2Style}>Primary Racial Traits</p>
      <TraitsSection traits={content.primaryTraits} basePath="primaryTraits" />
      <p className={header2Style}>Secondary Racial Traits</p>
      <TraitsSection traits={content.secondaryTraits} basePath="secondaryTraits" />
      {hasSubraces ? (
        content.subraces.map((subrace, subraceIndex) => (
          <div key={subraceIndex}>
            <p className={header2Style}>
              {`${subrace.subraceName} Subrace Traits`}
            </p>
            <TraitsSection
              traits={subrace.traits}
              basePath={`subraces.${subraceIndex}.traits`}
            />
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
}

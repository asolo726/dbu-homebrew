import Head from "../dbu/General/head";
import Trait from "../dbu/General/trait";
import RaceFeatures from "../dbu/Race/raceFeatures";

/**
 * Note: We need to figure out a good way of handling subraces
 */

export default function RaceRenderPage({ content }) {
  const hasSubraces =
    content.subraces && content.subraces != "" && content.subraces != null;
  const headerStyle =
    "text-dbu-header text-center text-xl md:text-2xl my-3 font-bold tracking-widest";
  const header2Style =
    "text-dbu-header text-[1.5em] sm:text-[1.8em] font-bold text-center mt-5 mb-4";
  return (
    <div className="flex flex-col flex-col-1 max-w-5xl px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
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
      {content.primaryTraits.map((trait, index) => {
        return (
          <Trait
            key={index}
            title={trait.title}
            desc={trait.desc}
            abilities={trait.abilities}
          />
        );
      })}
      <p className={header2Style}>Secondary Racial Traits</p>
      {content.secondaryTraits.map((trait, index) => {
        return (
          <Trait
            key={index}
            title={trait.title}
            desc={trait.desc}
            abilities={trait.abilities}
          />
        );
      })}
      {hasSubraces ? (
        content.subraces.map((subrace, index) => {
          return (
            <div key={index}>
              <p className={header2Style}>
                {`${subrace.subraceName} Subrace Traits`}
              </p>
              {subrace.traits.map((trait, index) => {
                return (
                  <Trait
                    key={index}
                    title={trait.title}
                    desc={trait.desc}
                    abilities={trait.abilities}
                  />
                );
              })}
            </div>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
}

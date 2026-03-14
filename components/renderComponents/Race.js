import Head from "../dbuComponents/General/head";
import Trait from "../dbuComponents/General/trait";
import RaceFeatures from "../dbuComponents/Race/raceFeatures";

/**
 * Note: We need to figure out a good way of handling subraces
 */

export default function RaceRenderPage({ content }) {
    const subraces = Object.keys(content)
        .filter(key => key.startsWith("subrace_"))
        .sort()
        .map(key => content[key]);

    return (
        <div className="flex flex-col flex-col-1 max-w-5xl px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
            <Head Form={content} />
            <RaceFeatures 
                racialLifeModifier={content.racialLifeModifier}
                savingThrows={content.savingThrows}
                skillRanks={content.skillRanks}
                attributeModifiers={content.attributeModifiers}
                minionSize={content.minionSize}
                availableFactors={content.availableFactors}
            />
            <p className="text-dbu-header text-center text-md md:text-2xl my-3 font-bold tracking-widest">
                Primary Racial Traits
            </p>
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
            <p className="text-dbu-header text-center text-md md:text-2xl my-3 font-bold tracking-widest">
                Secondary Racial Traits
            </p>
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
            {subraces.length > 0 ? (
                subraces.map((subrace, index) => {
                    return (
                        <div>
                            <p className="text-dbu-header text-center text-md md:text-2xl my-3 font-bold tracking-widest">
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
                                )
                             })
                            }
                        </div>
                     )
                })) : (
                    <></>
                )};
        </div>
    )
}
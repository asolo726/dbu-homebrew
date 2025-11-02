import AlternateHead from "../../../../classes/Forms/Alternate/altHead.Class";
import Alternate from "../../../../classes/Forms/Alternate/alternate.Class";
import Head from "../../../../components/dbuComponents/Form/head";
import MasteryTrait from "../../../../components/dbuComponents/Form/masteryTrait";
import MasteryTraitClass from "../../../../classes/Forms/Alternate/masteryTrait.Class";
import Trait from "../../../../components/dbuComponents/General/trait";
import TraitClass from "../../../../classes/General Classes/trait.Class";

export default function Test_DarkRessurrection() {
    const aspects = [
        { name: "Scaling", level: 2 },
        { name: "Realization", level: 0 },
        { name: "Dedicated", level: 0 },
        { name: "Difficult", level: 2 },
    ];
    const attributeModifiers = [
        { attribute: "AG", Bonus: 0, Multiplier: "T" },
        { attribute: "FO", Bonus: 1, Multiplier: "T" },
        { attribute: "TE", Bonus: 0, Multiplier: "T" },
        { attribute: "SC", Bonus: 0, Multiplier: "T" },
        { attribute: "IN", Bonus: 0, Multiplier: "T" },
        { attribute: "MA", Bonus: 1, Multiplier: "T" },
        { attribute: "PE", Bonus: 0, Multiplier: "T" },
    ];
    const altHead = new AlternateHead({
        title: "Dark Ressurrection",
        desc: "Be it by a curse, a quirk of your biology, or something more sinister, you have acquired the ability to spontaneously and temporarily raise yourself from the dead after you’ve been defeated - staggering up as a walking corpse or rising as a foul spirit, and assaulting your enemies unrelentingly.",
        author: "Comaeu",
        banner: "/Comaeu's Son.webp",
        raceReq: "Any Race (except Robot)",
        stress: "10",
        top: "1",
        aspects: aspects,
        attributeModifiers: attributeModifiers,
    });

    const trait1 = {
        title: "Morbid Return",
        desc: "Even as you lay dead on the ground, you can rise back up - and continue to fight on as a member of the undead.",
        abilities: [
            {
                condition: "Permanent",
                desc: "You cannot enter this Transformation except through the 2nd effect of Morbid Return.",
            },
            {
                condition: "Constant, Triggered/Start of Turn, 1/Encounter]",
                desc: "If you are Defeated, you may stop being Defeated, and enter this Transformation as an Out-of-Sequence Maneuver.",
            },
            {
                condition: "Automatic/Transform",
                desc: "Enter the Undying State until you exit this Transformation",
            },
            {
                condition: "Permanent, Option",
                desc: "Upon gaining access to this Transformation, choose from either of the following Factor Traits:",
            },
            {
                list: ["Undead Survival (Undead)", "Ghost (Monster)"],
            },
            {
                condition: "Automatic/Transform",
                desc: "Gain your chosen Factor Trait from the 4th effect of this Trait, replacing one of your Secondary Racial Traits until you exit this Transformation.",
            },
            {
                condition: "Triggered/Undefeated",
                desc: "Regain Life Points and Ki Points equal to 1/3 of their respective Maximums, ignoring any Traits or effects which would prevent you from regaining Life Points. You may only apply this effect after triggering the fourth effect of this Transformation Trait.",
            },
            {
                condition: "Automatic/Start of Turn",
                desc: "If your current Life Points would be below 0, make a Steadfast Check. If you fail, immediately exit this Transformation.",
            },
        ],
    };
    const trait2 = {
        title: "Macabre Fighter",
        desc: "Rising from the grave, you draw strength from your transmogrified being, and make the most of your unliving state.",
        abilities: [
            {
                condition: "Triggered/Transform",
                desc: "If you would use the 2nd effect of Morbid Return to stop being Defeated and enter this Transformation, you may enter the Surging State against the Opponent who Defeated you (if applicable) until the end of your next turn.",
            },
            {
                condition: "Choice",
                desc: "Depending on your selection of Factor Trait for the 4th effect of Morbid Return, gain the following effects:",
            },
            {
                miniTraitList: [
                    {
                        title: "Undead Survival",
                        desc: " Increase your Attribute Modifier Bonus (TE) by +1(T).",
                    },
                    {
                        title: "Ghost",
                        desc: "Increase your Attribute Modifier Bonus (AG) by +1(T).",
                    },
                ],
            },
            {
                condition: "Choice",
                desc: "Depending on your selection of Factor Trait for the 4th effect of Morbid Return, gain the following effects:",
            },
            {
                miniTraitList: [
                    {
                        title: "Undead Survival [1/Round]",
                        desc: "If you suffer no Damage from an Opponent’s Attacking Maneuver that targets you due to any reason (including simply avoiding it), you may use the Movement Maneuver to move in a straight line towards that Opponent or away from that Opponent as an Out-of-Sequence Maneuver.",
                    },
                    {
                        title: "Ghost [1/Round]",
                        desc: " If you suffer no Damage from an Opponent’s Attacking Maneuver that targets you due to any reason (including simply avoiding it), you may spend 4(bT) Ki Points to cause them to suffer from the Oblivious Combat Condition until the end of your next turn or until after you make an Attacking Maneuver against them.",
                    },
                ],
            },
        ],
    };
    const traitObj1 = new TraitClass(trait1.title, trait1.desc, trait1.abilities);
    const traitObj2 = new TraitClass(trait2.title, trait2.desc, trait2.abilities);
    
    const masteryTrait = {
        title: "Night Warrior",
        desc: "Having perfected the art of your corpse transmogrification, you are no longer hindered by the state of undeath - and may enter it while your body still lives.",
        abilities: [
            {
                condition: "Passive",
                desc: " Increase the Attribute Modifier Bonus (IN) of Dark Resurrection by +1(T).",
            },
            {
                condition: "Passive",
                desc: " Ignore the third effect of the Undying State.",
            },
            {
                condition: "Passive",
                desc: " You may gain your chosen Factor Trait through the 5th effect of Morbid Return without replacing one of your Racial Traits.",
            },
            {
                condition: "Choice",
                desc: "Depending on your selection of Factor Trait for the 4th effect of Morbid Return, gain the following effects:",
            },
            {
                miniTraitList: [
                    {
                        title: "Undead Survival",
                        desc: " Ignore the third effect of the Undead Survival Trait (see - Undead) whenever you would benefit from Legend Realized.",
                    },
                    {
                        title: "Ghost",
                        desc: " Reduce the Damage Category of all Magic Attacks that hit you by 1 Category (for your Damage Calculation).",
                    },
                ],
            },
            {
                condition: "Permanent",
                desc: "Ignore the first effect of Morbid Return.",
            },
        ],
    };
    const masteryTraitObj = new MasteryTraitClass(masteryTrait.title, masteryTrait.desc, masteryTrait.abilities);

    const alternateFormObj = new Alternate(
        altHead,
        [traitObj1, traitObj2],
        masteryTraitObj
    );

    return (
        <div className="flex flex-col flex-col-1 max-w-5xl px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
            <Head
                title={alternateFormObj.head.title}
                banner={alternateFormObj.head.banner}
                desc={alternateFormObj.head.desc}
                author={alternateFormObj.head.author}
                raceReq={alternateFormObj.head.raceReq}
                preReq={alternateFormObj.head.preReq}
                top={alternateFormObj.head.top}
                aspects={alternateFormObj.head.aspects}
                attributeModifiers={alternateFormObj.head.attributeModifiers}
                stress={alternateFormObj.head.stress}
                transLine={alternateFormObj.head.transLine}
                transStage={alternateFormObj.head.transStage}
            />
            {
                alternateFormObj.traits.map((trait, key) => {
                    return <Trait title={trait.title} desc={trait.desc} ability={trait.abilities} key={key}/>;
                })
            }
            <MasteryTrait title={masteryTraitObj.title} desc={masteryTraitObj.desc} ability={masteryTraitObj.abilities} />
        </div>
    );
}

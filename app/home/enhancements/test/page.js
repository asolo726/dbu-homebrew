import Head from "../../../../components/dbuComponents/Form/head";
import Trait from "../../../../components/dbuComponents/General/trait";
import BurstLimit from "../../../../components/dbuComponents/Form/burstLimit";

import EnhancementHeadClass from "../../../../classes/Forms/Enhancement/enhancementHead.Class";
import EnhancementClass from "../../../../classes/Forms/Enhancement/enhancement.Class";
import BurstLimitClass from "../../../../classes/Forms/Enhancement/burstLimit.Class";
import TraitClass from "../../../../classes/General Classes/trait.Class";

/**
 *
 * @returns Test Page for Righteous Indignation Enhancement power
 */
export default function Test_Righteous_Indignation() {
    const title = "Righteous Indignation";
    const author = "Blasteroid";
    const mainDesc =
        "While it is well known that intense emotions can give rise to immense bursts of strength, raw, unfocused feelings can often lead to excess waste, leaving the individual weaker when their momentary outburst ends. What is better is harnessing that emotion towards something greater, something beyond yourself, and the good nature of your soul pushes you to virtuous action. You are not simply angry for the sake of being angry or for some prideful reason; you burn with righteous fury and fight to defend and protect what is dear.";
    const aspects = [
        { name: "Raging", level: 3 },
        { name: "High Speed", level: 1 },
        { name: "Strainless", level: 0 },
        { name: "Dedicated", level: 0 },
        { name: "Temporary ", level: 3 },
        { name: "Limited ", level: 1 },
    ];
    const banner = "/I_told_you_mom_said_its_MY_turn_on_the_xbox.webp";

    const attributeModifiers = [
        { attribute: "AG", Bonus: 1, Multiplier: "T" },
        { attribute: "FO", Bonus: 2, Multiplier: "T" },
        { attribute: "TE", Bonus: 2, Multiplier: "T" },
        { attribute: "SC", Bonus: 0, Multiplier: "T" },
        { attribute: "IN", Bonus: 0, Multiplier: "T" },
        { attribute: "MA", Bonus: 2, Multiplier: "T" },
        { attribute: "PE", Bonus: 0, Multiplier: "T" },
    ];

    const head = new EnhancementHeadClass({
        title: title,
        banner: banner,
        desc: mainDesc,
        author: author,
        raceReq: "Any",
        preReq: "Good or Pure Good Z-Soul Alignment",
        tier: "3",
        aspects: aspects,
        attributeModifiers: attributeModifiers,
        stress: "15",
    });

    const featureTitle1 = {
        title: "Limitless Rage",
        desc: "The flames of your soil continue to toil even as your vigor begins to fall, renewing you and pushing you far beyond your natural limits.",
    };
    const featureTitle2 = {
        title: "Limitless Resolve",
        desc: "Though you are beaten, bruised, and nearly at death’s door, the cries of those you care about and the future of the innocent that hangs in the balance bestows you with the strength to press on.",
    };

    const featureAbilities1 = [
        {
            condition: "Constant, Triggered/Defeated, 1/Encounter",
            desc: "Enter this Transformation as an Out-of-Sequence Maneuver. After triggering this effect, select one of the following:",
        },
        {
            list: [
                "Enter a Core Transformation you possess, automatically succeeding its Stress Test. Ignore the Stress Test Requirement of Righteous Indignation.",
                "Activate this Transformation’s Burst Limit, even if you’ve already used a Burst Limit this encounter. ",
                "Enter the Surging State for 3 rounds.",
            ],
        },
        {
            condition: "Automatic/Transform, 1/Encounter",
            desc: "For every Health Threshold you are below prior to entering this Transformation, regain 1d10(T) + your Power Level in Life and Ki Points. ",
        },
        {
            condition: "Automatic/Transform",
            desc: "Enter the Raging State until you leave this transformation. You do not suffer from the Raging State’s 2nd effect.",
        },
        {
            condition: "Passive",
            desc: "You do not suffer from any Health Threshold penalties.",
        },
        {
            condition: "1/Round",
            desc: "Gain a stack of Power as an Instant Maneuver",
        },
        {
            condition: "Triggered, 3/Round",
            desc: "Apply the effects of the Karmic Edge (See —Weapons) to your Attacking Maneuver. If you would already apply this Quality’s effects to the Attacking Maneuver, increase the Dice Category of its Wound roll bonus by 1.",
        },
    ];
    const featureAbilities2 = [
        {
            condition: "Ruling",
            desc: "If you apply Power Control: Improvement to this Transformation, the 2nd effect of Limitless Rage gains the Triggered/Transform keyword instead of Automatic/Transform.",
        },
        {
            condition:
                "Triggered/Transform, Triggered/Start of Turn, 3/Encounter",
            desc: " Gain 2 Temporary Karma Points. Temporary Karma Points function as normal Karma Points but disappear at the end of the Encounter and do not count against your maximum.",
        },
        {
            condition: "Passive",
            desc: "When you use the Empower Maneuver, the ally regains Life Points equal to the Ki they receive, and treat the Empower Maneuver as having an additional amount of KP spent equal to your Power Level.",
        },
        {
            condition: "1/Encounter",
            desc: "When you use the 5th effect of Limitless Rage, enter the Furious State until the end of the turn and use the Movement or Energy Charge Maneuvers as an Out-of-Sequence Maneuver. You do not suffer from the Furious State’s 2nd effect.",
        },
        {
            condition: "Triggered, 1/Encounter",
            desc: "If you would lose a Duel Maneuver, trigger a Power Surge and make an additional Strike Roll as part of the Duel Maneuver.",
        },
    ];

    const traits = [
        new TraitClass(
            featureTitle1.title,
            featureTitle1.desc,
            featureAbilities1
        ),
        new TraitClass(
            featureTitle2.title,
            featureTitle2.desc,
            featureAbilities2
        ),
    ];

    const burstQuote = "You Scum!!!!";
    const burstDesc =
        "You refuse to allow the innocent around you continue experiencing injustice as your spirit is riled with anger and determination.";
    const burstAbility = [
        {
            condition: "Triggered/Transform",
            desc: "Gain a stack of Power, double the Life and Ki Points gained through Limitless Rage’s 2nd effect, and use the Empower Maneuver as an Out-of-Sequence Maneuver.",
        },
    ];

    const burstLimit = new BurstLimitClass(burstQuote, burstDesc, burstAbility);

    const enhancement = new EnhancementClass(head, traits, burstLimit);
    return (
        <div className="flex flex-col flex-col-1 max-w-5xl px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
            <Head 
                Form={enhancement} 
            />
            {enhancement.traits.map((trait, key) => {
                return (
                    <Trait
                        title={trait.title}
                        desc={trait.desc}
                        abilities={trait.abilities}
                        key={key}
                    />
                );
            })}
            <BurstLimit
                title={enhancement.burstLimit.title}
                desc={enhancement.burstLimit.desc}
                ability={enhancement.burstLimit.abilities}
            />
        </div>
    );
}

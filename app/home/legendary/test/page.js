//Components
import Head from "../../../../components/dbuComponents/Form/head";
import Trait from "../../../../components/dbuComponents/General/trait";
import LegendaryTrait from "../../../../components/dbuComponents/Form/legendaryTrait";

//Classses
import LegendaryHead from "../../../../classes/Forms/Legendary/legendaryHead.Class.js";
import LegendaryClass from "../../../../classes/Forms/Legendary/legendary.Class.js";
import TraitClass from "../../../../classes/General Classes/trait.Class.js";

export default function Test_BlackBlade() {
    const aspects = [
        { name: "Battle Uniform", level: 0 },
        { name: "Growth", level: 2 },
        { name: "High Speed", level: 2 },
        { name: "Natural", level: 0 },
        { name: "Peaked", level: 0 },
        { name: "Strainless", level: 0 },
        { name: "Long Transformation", level: 1 },
    ];
    const attributeModifiers = [
        { attribute: "AG", Bonus: 6, Multiplier: "T" },
        { attribute: "FO", Bonus: 7, Multiplier: "T" },
        { attribute: "TE", Bonus: 6, Multiplier: "T" },
        { attribute: "SC", Bonus: 0, Multiplier: "T" },
        { attribute: "IN", Bonus: 3, Multiplier: "T" },
        { attribute: "MA", Bonus: 7, Multiplier: "T" },
        { attribute: "PE", Bonus: 0, Multiplier: "T" },
    ];

    const legendaryHead = new LegendaryHead({
        title: "Black Blade",
        desc: "Since time immemorial, light has always been followed by shadow. Be it body, mind, or soul, even the most sanctified of light–the luminescence of the gods– can fall to the corruption of the dark. However, shadow does not only birth disorder and despair, for that same darkness can be wielded as a holy blade. A blade born from black, forged to grant even the gods their Destined Death. Brandished by warriors, of unbreakable will and loyalty, seeking only to maintain the order of the world. Yes, indeed, these are the Black Blades. ",
        banner: "/black_blade.webp",
        author: "Blasteroid",
        raceReq: "Any",
        preReq: "None",
        tier: "5",
        aspects: aspects,
        attributeModifiers: attributeModifiers,
        stress: "30",
    });

    const traits = [
        {
            title: "Shadow of the Gods",
            desc: "You exist in the shadow of the gods, waiting to unleash the judgment of the dark upon their very being.",
            abilities: [
                {
                    condition: "Automatic/Transform",
                    desc: "Enter the Superior State until you leave this transformation.",
                },
                {
                    condition: "Passive",
                    desc: "You are considered to have God Ki for the effects of other Character’s God Ki State.",
                },
                {
                    condition: "Passive",
                    desc: "Increase your Might Clashes by +2(T)",
                },
                {
                    condition: "Automatic",
                    desc: "Against characters with God Ki:",
                },
                {
                    list: [
                        "Increase your Damage Reduction against their Attacking Maneuvers by 2(T).",
                        "Increase the Wound Roll of your Attacking Maneuvers against them by 3(T).",
                    ],
                },
                {
                    condition: "Automatic",
                    desc: "If you would cause an Immortal opponent to become Defeated, any effects that would allow them to resurrect are nullified. ",
                },
                {
                    condition: "Triggered",
                    desc: "When you use an Attacking Maneuver with the Soaring or Sweeping Profile, reduce the Profile’s KP cost by half. If you would make an Armed Attack with these profiles, increase your Strike Roll by 1(T). ",
                },
                {
                    condition: "Triggered/Power, 1/Round",
                    desc: "When you use the Power Up Maneuver and gain a stack of Power, gain an additional Stack of Power until the end of your next turn and make a Might Clash against all opponents within a Sphere AoE (centered on you) as you release a mighty roar in response to your surging power. If you win, the losing character(s) gain the Guard Down Combat Condition and are knocked back a number of squares equal to your Might in a straight line.",
                },
            ],
        },
        {
            title: "Weapon of Death",
            desc: "All Black Blades are equipped with their eponymous Black Blade, a powerful weapon imbued with a fragment of the rune of Death.",
            abilities: [
                {
                    condition: "Automatic/Transform",
                    desc: "Select one weapon you are wielding. That Weapon becomes your Black Blade. Your Black Blade turns a deep black in color and gains the Elemental Blade(Light) and Destined Death qualities. Your Black Blade’s Size also becomes Big.",
                },
                {
                    condition: "Automatic",
                    desc: "Your Critical Target for Wound Rolls using the Black Blade is set to 8.",
                },
                {
                    condition: "Passive",
                    desc: "All of your Armed Attacks made with the Black Blade have their Damage Category increased by 1.",
                },
                {
                    condition: "Triggered, 2/Round",
                    desc: "When you make an Armed Attack with the Soaring or Sweeping profiles with the Black Blade, you may perform one of the following;",
                },
                {
                    miniTraitList: [
                        {
                            title: "Black Retreat (Soaring)",
                            desc: "Move any number of Squares up to your Boosted Speed at no KP Cost, as part of making your Armed Attack. You cannot move closer to your target and this does not provoke an Exploit Maneuver.",
                        },
                        {
                            title: "Black Dance (Soaring)",
                            desc: "After making your initial attack, make an additional Armed Attack with the Soaring profile, adding half the bonus to your Wound Roll from the Soaring Profile if you do so. If you use this option, once per round, you can immediately pay 3(bT) KP to move up to your Boosted Speed towards an opponent at no additional cost. This triggers Rapid Movement and you can make one Armed Attack with the Sweeping Profile once you reach your opponent (this cannot be used alongside Black Death). Gain the Guard Down Combat Condition until the end of your next turn after performing the Sweeping Armed Attack.",
                        },
                        {
                            title: "Black Death (Sweeping) [1/Round]",
                            desc: "You strike the ground with your Black Blade and cause an eruption of red and black slashes to appear in a Large Sphere AoE (centered on you). This Armed Attack automatically gains the effects of Destined Death and doubles the bonus to Wound granted from a Ki Wager. If you Ki Wager at least 2(bT) KP, your opponents must make a Corporeal saving throw (TN Hard) or be pushed back a number of Squares equal to your Might in a straight line and suffer the effects of the Guard Down Combat Conditio until the end of their next turn.",
                        },
                    ],
                },
                {
                    addendumBox: {
                        boxTitle: "Destined Death Quality",
                        title: "Destined Death",
                        desc: "Within the Black Blade lies the Rune of Death, a fragment of shadow capable of bringing an end to any and all life, including even the most powerful deities.",
                        abilities: [
                            
                        ],
                    },
                },
            ],
        },
    ];

    const traitObjs = [
        new TraitClass(traits[0].title, traits[0].desc, traits[0].abilities),
        new TraitClass(traits[1].title, traits[1].desc, traits[1].abilities),
    ];

    const legendaryTraits = [
        {
            title: "Clergy of Shadow",
            desc: "The secrets of shadow become known to you, enhancing your physical prowess and scholarship. ",
            abilities: [
                {
                    condition: "Passive",
                    desc: "Increase your Racial Health Modifier by +2.",
                },
                {
                    condition: "Permanent",
                    desc: "You gain 1 Super Stack, regardless of your Force and Agility. You ignore the penalties of the first super stack.",
                },
                {
                    condition: "Automatic",
                    desc: "When you create a Signature Technique with a Physical or Elemental Foundation, reduce the TP cost by half. This does not stack with similar effects.",
                },
                {
                    condition: "Triggered/Transform, 1/Encounter",
                    desc: "Upon entering the Black Blade Legendary Form and gaining the effects of Legend Realized, you can choose to forgo regaining Life Points and regain twice as many Ki Points. Regardless, for the next 1(bT) rounds, gain an additional Action at the start of your turn.",
                },
            ],
        },
    ];

    const legendaryTraitsObj = [
        new TraitClass(
            legendaryTraits[0].title,
            legendaryTraits[0].desc,
            legendaryTraits[0].abilities
        ),
    ];

    const legendary = new LegendaryClass({
        head: legendaryHead,
        traits: traitObjs,
        legendaryTrait: legendaryTraitsObj,
    });

    return (
        <div className="flex flex-col flex-col-1 max-w-5xl px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
            <Head Form={legendary} />
            {legendary.traits.map((trait, index) => {
                return (
                    <Trait
                        key={index}
                        title={trait.title}
                        desc={trait.desc}
                        abilities={trait.abilities}
                    />
                );
            })}
            <LegendaryTrait legendaryTraitList={legendary.legendaryTrait} />
        </div>
    );
}

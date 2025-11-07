import Head from "../../../../components/dbuComponents/Form/head";
import Trait from "../../../../components/dbuComponents/General/trait";
import ManifestHeadClass from "../../../../classes/Forms/Manifested/manifestedHead.Class.js";
import ManifestedClass from "../../../../classes/Forms/Manifested/manifested.Class.js";
import TraitClass from "../../../../classes/General Classes/trait.Class";

export default function Test_Deific_Saiyan() {
    const attributeModifiers = [
        { attribute: "AG", Bonus: 1, Multiplier: "" },
        { attribute: "FO", Bonus: 3, Multiplier: "" },
        { attribute: "TE", Bonus: 2, Multiplier: "" },
        { attribute: "SC", Bonus: 0, Multiplier: "" },
        { attribute: "IN", Bonus: 1, Multiplier: "" },
        { attribute: "MA", Bonus: 3, Multiplier: "" },
        { attribute: "PE", Bonus: 0, Multiplier: "" },
    ];
    const manifestHead = new ManifestHeadClass({
        title: "Deific Saiyan",
        banner: "/deific.png",
        desc:
            "Though the scarlet flames may fade from your body, your Saiyan cells hold steadfast to the godly power they were exposed to. While not as powerful as the Super Saiyan God, your base power is now far beyond what it once was, capable of combating even the most experienced of deities without even transforming. \n" +
            "This Manifested Power can be obtained in one of two ways. The first and most common method is to enter the Super Saiyan God Transformation once, after which upon exiting the Transformation you immediately gain this Manifested power. The other method is to enter the God Ki State through a Core Transformation. Upon exiting this Transformation, you may gain this Manifested Power by spending DT unlocking a form.",
        author: "Blasteroid",
        raceReq: "Saiyan",
        preReq: "Have entered the God Ki State or Super Saiyan God Transformations at some point. You do not have the Divine Candidate Manifested Power.",
        tier: "4",
        attributeModifiers: attributeModifiers,
        maxStacks: 1,
    });

    const traits = [
        {
            title: "Divine Echelon",
            desc: "Like the Super Saiyan God of Legend, you have entered into the domain of Gods. In this plane of existence, you realize the true pinnacle of Saiyan power.",
            abilities: [
                {
                    condition: "Passive",
                    desc: "While you are in a Core Transformation with the God Ki Aspect, increase Z by 1 for the effects of the Zenkai Manifested Power.",
                },
                {
                    condition: "Option, Permanent",
                    desc: "Select a God Ki Maneuver (See —God Ki), other than Divine Counter. You always have access to this Maneuver while in the God Ki State.",
                },
                {
                    condition: "Triggered/Defeated, 1/Encounter",
                    desc:
                        "Use the Transformation Maneuver as an Out-of-Sequence Maneuver to enter a Transformation with the God Ki Aspect you possess or once possessed. If you do not currently possess this Transformation, increase the Stress Test by +4." +
                        "\nIf you succeed, you fall to 1 Hit Points and are not Defeated, and may use the Divine Counter Maneuver as an Out-of-Sequence Maneuver. You may do so even if you do not have Divine Ki Points, however, if you do, exit your Transformation and gain 1 rank of Slowed until the end of the Combat Encounter.",
                },
            ],
        },
        {
            title: "Well of Divine Power",
            desc: "Though the Divine Power you experienced may wither, it never fully fades. Your Saiyan nature which thrives for power and battle allows your Divine Ki to persevere, always being there for your next fight.",
            abilities: [
                {
                    condition: "Passive",
                    desc: "You always count as being in the God Ki State for the purposes of your Opponent’s God Ki State.",
                },
                {
                    condition: "Triggered, 1/Round",
                    desc: "Upon applying a Stack of Battle Born to a Combat Roll while in a Transformation with the God Ki Aspect, regain 1(bT) Ki Points. Double this recovery if the Transformation’s Racial Requirement is Saiyan.",
                },
                {
                    condition: "Triggered/Transform, Triggered, 2/Encounter",
                    desc: " Upon entering a Core Transformation with the God Ki Aspect, or a Core Transformation that lacks the God Ki Aspect after previously being in the God Ki State this Encounter, enter the Superior State.",
                },
                {
                    condition: "Triggered, 1/Encounter",
                    desc: "While you have 2+ stack(s) of Battle Born applied to your Combat Rolls, when you use an Ultimate Signature Technique, gain 1(bT) Divine Ki Points to be wagered towards this Attacking Maneuver immediately for every 2 stacks of Battle Born applied. Double the Divine Ki Points you may wager if in a Core Transformation with the God Ki Aspect, or a Core Transformation that lacks the God Ki Aspect after previously being in the God Ki State this Encounter.",
                },
            ],
        },
    ];
    const traitObjs = [
        new TraitClass(traits[0].title, traits[0].desc, traits[0].abilities),
        new TraitClass(traits[1].title, traits[1].desc, traits[1].abilities),
    ];

    const manifested = new ManifestedClass(manifestHead, traitObjs);

    return (
        <div className="flex flex-col flex-col-1 max-w-5xl px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
            <Head Form={manifested} />
            {manifested.traits.map((trait, key) => {
                return <Trait key={key} title={trait.title} desc={trait.desc} abilities={trait.abilities} />;
            })}
        </div>
    );
}

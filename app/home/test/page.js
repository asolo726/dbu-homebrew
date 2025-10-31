import Head from "../../../components/dbuComponents/head";
import Feature from "../../../components/dbuComponents/feature";
import BurstLimit from "../../../components/dbuComponents/burstLimit";
import { title } from "process";

/**
 *
 * @returns Test Page for Righteous Indignation  Enhancement power
 */
export default function Test() {
    const title = "Righteous Indignation";
    const author = "Blasteroid";
    const mainDesc =
        "While it is well known that intense emotions can give rise to immense bursts of strength, raw, unfocused feelings can often lead to excess waste, leaving the individual weaker when their momentary outburst ends. What is better is harnessing that emotion towards something greater, something beyond yourself, and the good nature of your soul pushes you to virtuous action. You are not simply angry for the sake of being angry or for some prideful reason; you burn with righteous fury and fight to defend and protect what is dear.";
    const aspects = [
        { name: "Raging", level: 3 },
        { name: "High Speed", level: 1 },
        { name: "Strainless", level: 1 },
        { name: "Dedicated", level: 1 },
        { name: "Temporary ", level: 3 },
        { name: "Limited ", level: 1 },
    ];
    const banner = "/I_told_you_mom_said_its_MY_turn_on_the_xbox.webp";
    const attributeModifiers = [
        {attribute: "AG", "Bonus": 1, "Multiplier": "T"},
        {attribute: "FO", "Bonus": 2, "Multiplier": "T"},
        {attribute: "TE", "Bonus": 2, "Multiplier": "T"},
        {attribute: "SC", "Bonus": 0, "Multiplier": "T"},
        {attribute: "IN", "Bonus": 0, "Multiplier": "T"},
        {attribute: "MA", "Bonus": 2, "Multiplier": "T"},
        {attribute: "PE", "Bonus": 0, "Multiplier": "T"},
    ]

    const featureTitle1 = {title: "Limitless Rage", desc: "The flames of your soil continue to toil even as your vigor begins to fall, renewing you and pushing you far beyond your natural limits."};
    const featureTitle2 = {title: "Limitless Resolve", desc:"Though you are beaten, bruised, and nearly at death’s door, the cries of those you care about and the future of the innocent that hangs in the balance bestows you with the strength to press on."};

    const featureAbilities1 = [
        { condition: "Constant, Triggered/Defeated, 1/Encounter", desc: ""},
        { condition: "Automatic/Transform, 1/Encounter", desc: ""},
        { condition: "Automatic/Transform", desc: ""},
        { condition: "Passive", desc: ""},
        { condition: "1/Round", desc: ""},
        { condition: "Triggered, 3/Round", desc: ""},
    ]
    const featureAbilities2 = [
        
    ]
    const burstQuote = "You Scum!!!!";
    return (
        <div className="flex flex-row max-w-5xl px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 sm:rounded-[4em]">
            <Head
                title={title}
                author={author}
                prerequisite="Good or Pure Good Z-Soul Alignment"
                type="Enhancement Power"
                tier="3+"
                stress="15"
                race="Any"
                prereq="Good or Pure Good Z-Soul Alignment"
                mainDesc={mainDesc}
                aspects={aspects}
                banner={banner}
                attributeModifiers={attributeModifiers}
            />
            <Feature title={featureTitle1} abilities={featureAbilities1}/>
            <Feature title={featureTitle2} abilities={featureAbilities2}/>
            <BurstLimit
                title={burstQuote}
             />
        </div>
    );
}

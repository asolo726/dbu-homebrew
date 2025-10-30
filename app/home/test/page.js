import Head from "../../../components/dbuComponents/head";

/**
 *
 * @returns Test Page for Righteous Indignation  Enhancement power
 */
export default function Test() {
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
    return (
        <div className="flex flex-row max-w-4xl px-10 py-10 md:px-25 sm:m-10 justify-center content-center text-wrap bg-dbu-bg3 rounded-xl">
            <Head
                title="Righteous Indignation"
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
        </div>
    );
}

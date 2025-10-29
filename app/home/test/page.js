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
    // Strainless, Dedicated, Temporary (LV3), Limited (LV1), Special (Enraged)
    return (
        <div className="flex flex-row justify-center content-center w-250 text-wrap bg-dbu-bg2 m-10">
            <Head
                title="Righteous Indignation"
                prerequisite="Good or Pure Good Z-Soul Alignment"
                type="Enhancement Power"
                tier="3+"
                stress="15"
                race="Any"
                mainDesc={mainDesc}
            />
        </div>
    );
}

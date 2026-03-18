import Card from "./card"

export default function CardGenerator({ entries }) {
    return (
        <div className="grid gap-6 mt-6 mb-4 ml-2 p-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {entries.map((entry, i) => (
                <Card
                    key={i}
                    link={`/${entry.head.keyName}`}
                    imageUrl={entry.head.banner}
                    pageName={entry.head.title}
                    pageType={entry.head.identity}
                    raceRestriction={entry.head.raceReq}
                    tierOfPower={entry.head.tier}
                    author={entry.head.author}
                    enhancementType={entry.head.enhancementType} // Only for Enhancements (Standard, Special)
                    awakeningType={entry.head.awakeningType} // Only for Awakenings (Lesser, Greater, Super)
                    awakeningOrigin={entry.head.awakeningOrigin} // Only for Awakenings (Body, Mind)
                    tag={entry.head.tag} // For homebrew that is part of a set (E.g. Invincible, Pocket Monster)
                />
            ))}
        </div>
    );
}
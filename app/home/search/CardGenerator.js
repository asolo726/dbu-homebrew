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
                />
            ))}
        </div>
    );
}
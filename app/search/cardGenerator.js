import Card from "./card";

export default function CardGenerator({ entries }) {
  return (
    <div
      className="grid gap-6 mt-6 mb-4 ml-2 p-6"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
    >
      {entries.map((entry, i) => (
        <Card
          key={entry.data.keyName}
          link={`/${entry.data.keyName}`}
          imageUrl={entry.head.banner}
          pageName={entry.head.title}
          pageType={entry.data.identity}
          raceRestriction={entry.head.raceReq}
          tierOfPower={entry.head.tier}
          author={entry.data.author}
          enhancementType={entry.head.details.enhancementType}
          awakeningType={entry.head.details.awakeningType}
          awakeningOrigin={entry.head.details.awakeningOrigin}
          tag={entry.data.tag}
          keyName={entry.data.keyName}
          upvotes={entry.head.upvotes ?? 0}
          views={entry.head.views ?? 0}
        />
      ))}
    </div>
  );
}

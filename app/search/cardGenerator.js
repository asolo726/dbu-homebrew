import Card from "./card";

export default function CardGenerator({ entries }) {
	return (
		<div
			className="grid gap-6 mt-6 mb-4 ml-2 p-6"
			style={{
				gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
			}}
		>
			{entries.map((entry, i) => {
				const data = entry?.data ?? {};
				const head = entry?.head ?? {};
				const details = head.details ?? {};

				return (
					<Card
						key={data.keyName ?? i}
						link={`/${data.keyName ?? ""}`}
						imageUrl={head.banner}
						pageName={head.title}
						pageType={data.identity}
						raceRestriction={details.raceReq}
						tierOfPower={details.tier}
						author={data.author}
						enhancementType={details.enhancementType}
						awakeningType={details.awakeningType}
						awakeningOrigin={details.awakeningOrigin}
						tag={data.tag}
						keyName={data.keyName}
						upvotes={head.upvotes ?? 0}
						views={head.views ?? 0}
					/>
				);
			})}
		</div>
	);
}

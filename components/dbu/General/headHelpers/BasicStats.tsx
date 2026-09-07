import EditableText from "../../../edit/EditableText";

// interface BasicStatProps {
//     stat: string;
// }
interface BasicStatsProps {
	statName: string;
	statValue: string | number | undefined;
	isEditing: boolean;
	spanStyle: string;
	spanText?: string;
}

export default function BasicStats({
	statName,
	statValue,
	isEditing,
	spanStyle,
	spanText,
}: Readonly<BasicStatsProps>) {
	if (statValue === undefined) {
		return;
	} else if (String(statValue).length > 0 || isEditing) {
		return (
			<li>
				<p>
					<span className={spanStyle}>{spanText || statName}</span>
					<EditableText
						path={`head.details.${statName}`}
						value={String(statValue)}
					/>
				</p>
			</li>
		);
	} else {
		return <></>;
	}
}

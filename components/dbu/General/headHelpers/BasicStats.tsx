import EditableText from "../../../edit/EditableText";

// interface BasicStatProps {
//     stat: string;
// }
interface BasicStatsProps {
    statName: string;
    statValue: string | undefined;
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
    }
    else if (statValue.length > 0 || isEditing) {
        return (
            <li>
                <p>
                    <span className={spanStyle}>{spanText || statName}</span>
                    <EditableText path={`head.${statName}`} value={statValue} />
                </p>
            </li>
        );
    } else {
        return <></>;
    }
}

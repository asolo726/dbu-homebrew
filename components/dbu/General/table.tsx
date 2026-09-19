import EditableText from "../../edit/EditableText";
export interface TableData {
	columns: string[];
	rows: string[][];
}

interface TableProps {
	tableData: TableData;
	path: string | undefined;
}

export default function Table({ tableData, path }: Readonly<TableProps>) {
	const { columns, rows } = tableData;
	return (
		<div className="overflow-x-auto">
			<table className="w-full border-collapse text-center text-md font-light">
				<thead>
					<tr>
						{columns.map((item, key) => (
							<th
								className="border border-dbu-header min-w-[7em] max-w-[15em] py-2 text-sm"
								key={key}
							>
								<EditableText
									path={`${path}.columns.${key}`}
									value={item}
								/>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, rowKey) => (
						<tr key={rowKey}>
							{row.map((val, key) => (
								<td
									key={key}
									className={
										key === row.length - 1
											? "border border-dbu-header py-2 w-auto px-3"
											: "border border-dbu-header min-w-[7em] max-w-[25em] py-2"
									}
								>
									<EditableText
										path={`${path}.rows.${rowKey}.${key}`}
										value={val}
									/>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

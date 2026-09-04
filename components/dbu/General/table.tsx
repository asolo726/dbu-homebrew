export interface TableData {
	columns: string[];
	rows: string[][];
}

interface TableProps {
	tableData: TableData;
}

export default function Table({ tableData }: Readonly<TableProps>) {
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
								{item}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, key) => (
						<tr key={key}>
							<td
								key={key}
								className={
									key === row.length - 1
										? "border border-dbu-header py-2 w-auto px-3"
										: "border border-dbu-header min-w-[7em] max-w-[25em] py-2"
								}
							>
								row
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default function Table({ rows }) {
    return (
        <table className="table-fixed w-full border-collapse text-center text-xl font-light">
            <thead>
                {rows[0].map((item, key) => (
                    <th
                        className="border border-dbu-header min-w-[3em] max-w-[10em] py-2 break-all"
                        key={key}
                    >
                        {item}
                    </th>
                ))}
            </thead>
            <tbody>
                {rows.map((row, key) => (
                    <tr key={key}>
                        {row.map((item, key) => (
                            <td
                                className="border border-dbu-header min-w-[3em] max-w-[10em] py-2 break-all"
                                key={key}
                            >
                                {item}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

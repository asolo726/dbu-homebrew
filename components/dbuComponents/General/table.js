export default function Table({tableData}) {
  const { headers, rows } = tableData;
  console.log("headers: ", headers, "rows: ", rows);
  return (
    <table className="table-fixed w-full border-collapse text-center text-md font-light">
      <thead>
        {headers.map((item, key) => (
          <td
            className="border border-dbu-header min-w-[3em] max-w-[10em] py-2"
            key={key}
          >
            <th className="text-center">{item}</th>
          </td>
        ))}
      </thead>
      <tbody>
        {rows.map((row, key) => (
          <tr key={key}>
            {row.map((item, key) => (
              <td
                className="border border-dbu-header min-w-[3em] max-w-[10em] py-2"
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

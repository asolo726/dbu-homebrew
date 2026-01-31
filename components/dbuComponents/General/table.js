import Trait from "./trait";
export default function Table({ tableData }) {
  const { headers, rows } = tableData;
  //console.log("headers: ", headers, "rows: ", rows);
  return (
    <table className="w-full border-collapse text-center text-md font-light">
      <thead>
        <tr>
          {headers.map((item, key) => (
            <th
              className="border border-dbu-header min-w-[6em] max-w-[10em] py-2"
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
            {row.map((item, key) => (
              <td
                key={key}
                className={
                  key === row.length - 1
                    ? "border border-dbu-header py-2 w-auto px-3"
                    : "border border-dbu-header min-w-[3em] max-w-[10em] py-2"
                }
              >
                {!Array.isArray(item) ? (
                  item
                ) : (
                  <Trait
                    title={item[0]}
                    desc={item[1]}
                    abilities={item[2]}
                    key={key}
                  />
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

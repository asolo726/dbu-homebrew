import Trait from "./trait";
export default function Table({ tableData }) {
  const { headers, rows } = tableData;
  //console.log("headers: ", headers, "rows: ", rows);
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-center text-md font-light">
        <thead>
          <tr>
            {headers.map((item, key) => (
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
              {row.map((item, key) => (
                <td
                  key={key}
                  className={
                    key === row.length - 1
                      ? "border border-dbu-header py-2 w-auto px-3"
                      : "border border-dbu-header min-w-[7em] max-w-[25em] py-2"
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
    </div>
  );
}

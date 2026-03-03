import AddendumBox from "./addendumBox";
import Table from "./table";

export default function Ability({ abilityList = [{}], key }) {
  let conditionAbilityCount = 0;
  return (
    <div className="mt-2" key={key}>
      {abilityList.map((item, key) => {
        if ("condition" in item) {
          conditionAbilityCount++;
          return (
            <p
              className="text-dbu-text text-md md:text-lg text-left my-1"
              key={key}
            >
              {"("}
              <span className="font-bold text-dbu-header">
                {conditionAbilityCount}
              </span>
              {")-["}
              <span className="font-bold text-dbu-header">
                {`${item.condition}`}
              </span>
              {"]: "}
              {item.desc}
            </p>
          );
        } else if ("list" in item) {
          let indentor = 10;
          if ("sublist" in item) {
            indentor += item.sublist * 10;
          }
          //console.log("indentor: ", indentor);
          return (
            <ul key={key} className={`list-disc ml-${indentor}`}>
              {item.list.map((listItem, key) => {
                return (
                  <li
                    className="my-2 text-dbu-text text-md md:text-lg text-left"
                    style={{
                      listStyleType:
                        indentor > 20
                          ? "square"
                          : indentor > 10
                            ? "circle"
                            : "disc",
                    }}
                    key={key}
                  >
                    {listItem}
                  </li>
                );
              })}
            </ul>
          );
        } else if ("miniTraitList" in item) {
          let indentor = 10;
          if ("sublist" in item) {
            indentor += item.sublist * 10;
          }
          return (
            <ul key={key} className="list-disc ml-10">
              {item.miniTraitList.map((listItem, key) => {
                return (
                  <li
                    className="my-2 text-dbu-text text-md md:text-lg text-left"
                    key={key}
                  >
                    <span className="font-bold text-dbu-header">{`${listItem.title}: `}</span>
                    {listItem.desc}
                  </li>
                );
              })}
            </ul>
          );
        } else if ("addendumBox" in item) {
          return (
            <ul key={key} className="list-disc ml-10">
              <AddendumBox
                boxTitle={item.boxTitle}
                title={item.title}
                desc={item.desc}
                abilities={item.abilities}
              />
            </ul>
          );
        } else if ("table" in item) {
          const tableData = {
            headers: item.table.headers,
            rows: item.table.rows,
          };
          //console.log(tableData);
          return (
            <ul key={key} className="list-disc ml-10">
              <Table tableData={tableData} />
            </ul>
          );
        }
      })}
    </div>
  );
}

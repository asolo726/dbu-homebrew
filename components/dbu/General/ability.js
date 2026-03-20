import AddendumBox from "./addendumBox";
import Table from "./table";
import EditableText from "../../edit/EditableText";

export default function Ability({ abilityList = [{}], key, path }) {
  let conditionAbilityCount = 0;
  return (
    <div className="mt-2" key={key}>
      {abilityList.map((item, itemIndex) => {
        if ("condition" in item) {
          const isLabel =
            item.condition.startsWith("–") || item.condition.startsWith("-");
          if (isLabel) {
            const labelText = item.condition.replace(/^[–-]/, "").trim();
            return (
              <p
                className="text-dbu-text text-md md:text-lg text-left my-1"
                key={itemIndex}
              >
                {"–"}
                <span className="font-bold text-dbu-header">{labelText}</span>
                {": "}
                {path ? (
                  <EditableText
                    path={`${path}.abilities.${itemIndex}.desc`}
                    value={item.desc}
                  />
                ) : (
                  item.desc
                )}
              </p>
            );
          }
          conditionAbilityCount++;
          return (
            <p
              className="text-dbu-text text-md md:text-lg text-left my-1"
              key={itemIndex}
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
              {path ? (
                <EditableText
                  path={`${path}.abilities.${itemIndex}.desc`}
                  value={item.desc}
                />
              ) : (
                item.desc
              )}
            </p>
          );
        } else if ("list" in item) {
          const depth = "sublist" in item ? item.sublist : 0;
          const marginLeft = `${(depth + 1) * 2.5}rem`;
          const listStyleType =
            depth >= 2 ? "square" : depth >= 1 ? "circle" : "disc";
          return (
            <ul key={itemIndex} className="list-disc" style={{ marginLeft }}>
              {item.list.map((listItem, key) => {
                return (
                  <li
                    className="my-2 text-dbu-text text-md md:text-lg text-left"
                    style={{ listStyleType }}
                    key={key}
                  >
                    {listItem}
                  </li>
                );
              })}
            </ul>
          );
        } else if ("miniTraitList" in item) {
          const depth = "sublist" in item ? item.sublist : 0;
          const marginLeft = `${(depth + 1) * 2.5}rem`;
          return (
            <ul key={itemIndex} className="list-disc" style={{ marginLeft }}>
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
            <ul key={itemIndex} className="list-disc ml-10">
              <AddendumBox
                boxTitle={item.addendumBox.boxTitle}
                title={item.addendumBox.title}
                desc={item.addendumBox.desc}
                abilities={item.addendumBox.abilities}
                traits={item.addendumBox.traits}
              />
            </ul>
          );
        } else if ("table" in item) {
          const tableData = {
            headers: item.table.headers,
            rows: item.table.rows,
          };
          return (
            <ul key={itemIndex} className="list-disc ml-10">
              <Table tableData={tableData} />
            </ul>
          );
        }
      })}
    </div>
  );
}

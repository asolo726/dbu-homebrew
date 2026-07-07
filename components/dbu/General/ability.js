"use client";
import AddendumBox from "./addendumBox";
import Table from "./table";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";
import { RiArrowUpLine, RiArrowDownLine } from "react-icons/ri";

export default function Ability({ abilityList = [{}], key, path, selectedIndices, onToggleSelect, onMove }) {
  const { isEditing } = useEditMode() || {};
  let conditionAbilityCount = 0;

  return (
    <div className="mt-2" key={key}>
      {abilityList.map((item, itemIndex) => {
        // Build the inner content for this item (no key — key goes on the wrapper)
        let inner;

        if ("condition" in item) {
          const isLabel =
            item.condition.startsWith("–") || item.condition.startsWith("-");

          if (isLabel) {
            const labelText = item.condition.replace(/^[–-]/, "").trim();
            inner = (
              <p className="text-dbu-text text-md md:text-lg text-left my-1">
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
          } else {
            conditionAbilityCount++;
            inner = (
              <p className="text-dbu-text text-md md:text-lg text-left my-1">
                {"("}
                <span className="font-bold text-dbu-header">
                  {conditionAbilityCount}
                </span>
                {")-["}
                <span className="font-bold text-dbu-header">
                  {item.condition}
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
          }
        } else if ("list" in item) {
          const depth = "sublist" in item ? item.sublist : 0;
          const marginLeft = `${(depth + 1) * 2.5}rem`;
          const listStyleType =
            depth >= 2 ? "square" : depth >= 1 ? "circle" : "disc";
          inner = (
            <ul className="list-disc" style={{ marginLeft }}>
              {item.list.map((listItem, i) => (
                <li
                  className="my-2 text-dbu-text text-md md:text-lg text-left"
                  style={{ listStyleType }}
                  key={i}
                >
                  {path ? (
                    <EditableText
                      path={`${path}.abilities.${itemIndex}.list.${i}`}
                      value={listItem}
                    />
                  ) : (
                    listItem
                  )}
                </li>
              ))}
            </ul>
          );
        } else if ("miniTraitList" in item) {
          const depth = "sublist" in item ? item.sublist : 0;
          const marginLeft = `${(depth + 1) * 2.5}rem`;
          inner = (
            <ul className="list-disc" style={{ marginLeft }}>
              {item.miniTraitList.map((listItem, i) => (
                <li
                  className="my-2 text-dbu-text text-md md:text-lg text-left"
                  key={i}
                >
                  <span className="font-bold text-dbu-header">
                    {path ? (
                      <EditableText
                        path={`${path}.abilities.${itemIndex}.miniTraitList.${i}.title`}
                        value={listItem.title}
                      />
                    ) : (
                      listItem.title
                    )}:{" "}
                  </span>
                  {path ? (
                    <EditableText
                      path={`${path}.abilities.${itemIndex}.miniTraitList.${i}.desc`}
                      value={listItem.desc}
                    />
                  ) : (
                    listItem.desc
                  )}
                </li>
              ))}
            </ul>
          );
        } else if ("addendumBox" in item) {
          const depth = "sublist" in item ? item.sublist : -1;
          const marginLeft = depth >= 0 ? `${(depth + 1) * 2.5}rem` : undefined;
          inner = (
            <div style={marginLeft ? { marginLeft } : {}}>
              <AddendumBox
                boxTitle={item.addendumBox.boxTitle}
                title={item.addendumBox.title}
                desc={item.addendumBox.desc}
                abilities={item.addendumBox.abilities}
                traits={item.addendumBox.traits}
                path={path ? `${path}.abilities.${itemIndex}.addendumBox` : undefined}
              />
            </div>
          );
        } else if ("table" in item) {
          inner = (
            <ul className="list-disc ml-10">
              <Table tableData={{ headers: item.table.headers, rows: item.table.rows }} />
            </ul>
          );
        }

        if (inner == null) return null;

        // In edit mode wrap each item with a checkbox + move buttons for selection/reordering
        if (isEditing && onToggleSelect) {
          const checked = selectedIndices?.has(itemIndex) ?? false;
          const isFirst = itemIndex === 0;
          const isLast = itemIndex === abilityList.length - 1;
          return (
            <div
              key={itemIndex}
              className={`flex items-start gap-1 rounded transition-colors ${
                checked ? "bg-red-900/20" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleSelect(itemIndex)}
                className="mt-2 shrink-0 accent-red-500 cursor-pointer"
              />
              {onMove && (
                <div className="flex flex-col shrink-0 mt-0.5">
                  <button
                    onClick={() => onMove(itemIndex, -1)}
                    disabled={isFirst}
                    title="Move up"
                    className="text-dbu-text/50 hover:text-dbu-header disabled:opacity-20 disabled:cursor-not-allowed leading-none"
                  >
                    <RiArrowUpLine size={14} />
                  </button>
                  <button
                    onClick={() => onMove(itemIndex, 1)}
                    disabled={isLast}
                    title="Move down"
                    className="text-dbu-text/50 hover:text-dbu-header disabled:opacity-20 disabled:cursor-not-allowed leading-none"
                  >
                    <RiArrowDownLine size={14} />
                  </button>
                </div>
              )}
              <div className="flex-1 min-w-0">{inner}</div>
            </div>
          );
        }

        return <div key={itemIndex}>{inner}</div>;
      })}
    </div>
  );
}

"use client";
import AddendumBox from "./addendumBox";
import Table from "./table";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";
import { RiArrowUpLine, RiArrowDownLine } from "react-icons/ri";

export default function Ability({ abilityList = [{}], key, path, selectedIndices, onToggleSelect, onMove, onUpdateAbility }) {
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
                {/* In view mode show – as static prefix; in edit mode it's part of the editable condition string */}
                {!isEditing && "–"}
                <span className="font-bold text-dbu-header">
                  <EditableText
                      path={path ? `${path}.abilities.${itemIndex}.condition` : undefined}
                      value={item.condition}
                    />
                </span>
                {": "}
                <EditableText
                    path={path ? `${path}.abilities.${itemIndex}.desc` : undefined}
                    value={item.desc}
                  />
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
                  <EditableText
                      path={path ? `${path}.abilities.${itemIndex}.condition` : undefined}
                      value={item.condition}
                    />
                </span>
                {"]: "}
                <EditableText
                    path={path ? `${path}.abilities.${itemIndex}.desc` : undefined}
                    value={item.desc}
                  />
              </p>
            );
          }
        } else if ("list" in item) {
          const depth = "sublist" in item ? item.sublist : 0;
          const marginLeft = `${(depth + 1) * 2.5}rem`;
          const listStyleType =
            depth >= 2 ? "square" : depth >= 1 ? "circle" : "disc";
          inner = (
            <div>
              <ul style={{ marginLeft, listStyleType }}>
                {item.list.map((listItem, i) => (
                  <li
                    className="my-2 text-dbu-text text-md md:text-lg text-left"
                    key={i}
                  >
                    <EditableText
                      path={ path ? `${path}.abilities.${itemIndex}.list.${i}` : undefined }
                      value={listItem}
                    />
                    {isEditing && onUpdateAbility && (
                      <button
                        onClick={() => onUpdateAbility(itemIndex, { type: "list:remove", index: i })}
                        className="ml-2 text-red-400/40 hover:text-red-400 text-sm leading-none"
                        title="Remove bullet"
                      >×</button>
                    )}
                  </li>
                ))}
              </ul>
              {isEditing && onUpdateAbility && (
                <button
                  onClick={() => onUpdateAbility(itemIndex, { type: "list:add" })}
                  style={{ marginLeft }}
                  className="text-xs text-dbu-text/40 hover:text-dbu-header mt-0.5"
                >+ Add bullet</button>
              )}
            </div>
          );
        } else if ("miniTraitList" in item) {
          const depth = "sublist" in item ? item.sublist : 0;
          const marginLeft = `${(depth + 1) * 2.5}rem`;
          const listStyleType = depth >= 2 ? "square" : depth >= 1 ? "circle" : "disc";
          inner = (
            <div>
              <ul style={{ marginLeft, listStyleType }}>
                {item.miniTraitList.map((listItem, i) => (
                  <li
                    className="my-2 text-dbu-text text-md md:text-lg text-left"
                    key={i}
                  >
                    <span className="font-bold text-dbu-header">
                      <EditableText
                          path={path ? `${path}.abilities.${itemIndex}.miniTraitList.${i}.title` : undefined}
                          value={listItem.title}
                        />
                        :{" "}
                    </span>
                    <EditableText
                      path={path ? `${path}.abilities.${itemIndex}.miniTraitList.${i}.desc` : undefined}
                      value={listItem.desc}
                    />
                    {isEditing && onUpdateAbility && (
                      <button
                        onClick={() => onUpdateAbility(itemIndex, { type: "miniTraitList:remove", index: i })}
                        className="ml-2 text-red-400/40 hover:text-red-400 text-sm leading-none"
                        title="Remove item"
                      >×</button>
                    )}
                  </li>
                ))}
              </ul>
              {isEditing && onUpdateAbility && (
                <button
                  onClick={() => onUpdateAbility(itemIndex, { type: "miniTraitList:add" })}
                  style={{ marginLeft }}
                  className="text-xs text-dbu-text/40 hover:text-dbu-header mt-0.5"
                >+ Add item</button>
              )}
            </div>
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
        } else if ("seeRef" in item) {
          const nameVal = item.seeRef.name;
          const urlVal = item.seeRef.url;
          if (isEditing && path) {
            inner = (
              <div className="my-1">
                <div className="flex items-baseline gap-1 text-dbu-text text-md md:text-lg">
                  {"(See —"}
                  <EditableText
                    path={`${path}.abilities.${itemIndex}.seeRef.name`}
                    value={nameVal}
                  />
                  {")"}
                </div>
                <div className="flex items-center gap-1 text-xs text-dbu-text/50 mt-0.5">
                  <span className="shrink-0">URL:</span>
                  <EditableText
                    path={`${path}.abilities.${itemIndex}.seeRef.url`}
                    value={urlVal}
                    className="text-xs"
                  />
                </div>
              </div>
            );
          } else {
            inner = (
              <p className="text-dbu-text text-md md:text-lg text-left my-1">
                {"(See —"}
                <a
                  href={urlVal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dbu-link hover:underline"
                >
                  {nameVal}
                </a>
                {")"}
              </p>
            );
          }
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

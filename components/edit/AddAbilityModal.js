"use client";
import { useState } from "react";
import { RxChevronRight } from "react-icons/rx";

function AbilityPreview({ type, conditionText, labelText, desc, boxTitle, listSubtype, listItems, miniItems, listDepth }) {
  const empty = <span className="italic text-dbu-text/30">…</span>;

  if (type === "label") {
    return (
      <p className="text-dbu-text text-md text-left my-1">
        {"–"}
        <span className="font-bold text-dbu-header">{labelText.trim() || empty}</span>
        {": "}
        {desc.trim() || empty}
      </p>
    );
  }

  if (type === "addendumbox") {
    return (
      <div className="border border-dbu-header/50 rounded">
        <div className="flex items-center gap-2 px-3 py-2 text-sm">
          <RxChevronRight className="shrink-0" />
          <span>{boxTitle.trim() || empty}</span>
        </div>
      </div>
    );
  }

  if (type === "list") {
    const styleType = listDepth >= 2 ? "square" : listDepth >= 1 ? "circle" : "disc";
    const ml = `${(listDepth + 1) * 2.5}rem`;
    if (listSubtype === "bold") {
      const filled = miniItems.filter((it) => it.title.trim() || it.desc.trim());
      return (
        <ul style={{ marginLeft: ml }}>
          {filled.length === 0 ? (
            <li className="my-2 text-dbu-text/30 italic text-sm" style={{ listStyleType: styleType }}>…</li>
          ) : (
            filled.map((item, i) => (
              <li key={i} className="my-2 text-dbu-text text-md text-left" style={{ listStyleType: styleType }}>
                {item.title.trim() && (
                  <span className="font-bold text-dbu-header">{item.title.trim()}: </span>
                )}
                {item.desc}
              </li>
            ))
          )}
        </ul>
      );
    }
    const filled = listItems.filter((s) => s.trim());
    return (
      <ul style={{ marginLeft: ml }}>
        {filled.length === 0 ? (
          <li className="my-2 text-dbu-text/30 italic text-sm" style={{ listStyleType: styleType }}>…</li>
        ) : (
          filled.map((item, i) => (
            <li key={i} className="my-2 text-dbu-text text-md text-left" style={{ listStyleType: styleType }}>{item}</li>
          ))
        )}
      </ul>
    );
  }

  return (
    <p className="text-dbu-text text-md text-left my-1">
      {"(1)-["}
      <span className="font-bold text-dbu-header">{conditionText.trim() || empty}</span>
      {"]: "}
      {desc.trim() || empty}
    </p>
  );
}

const inputClass =
  "w-full px-3 py-2 rounded-md bg-dbu-bg2 border border-dbu-line text-dbu-text text-sm focus:outline-none focus:border-dbu-header";

export default function AddAbilityModal({ onSave, onClose }) {
  const [type, setType] = useState("condition");
  const [conditionText, setConditionText] = useState("");
  const [labelText, setLabelText] = useState("");
  const [desc, setDesc] = useState("");
  const [boxTitle, setBoxTitle] = useState("");
  const [boxTraitTitle, setBoxTraitTitle] = useState("");
  const [boxTraitDesc, setBoxTraitDesc] = useState("");
  const [listSubtype, setListSubtype] = useState("plain");
  const [listItems, setListItems] = useState([""]);
  const [miniItems, setMiniItems] = useState([{ title: "", desc: "" }]);
  const [listDepth, setListDepth] = useState(0);

  const isValid =
    type === "label"
      ? labelText.trim() !== ""
      : type === "addendumbox"
      ? boxTitle.trim() !== ""
      : type === "list"
      ? listSubtype === "bold"
        ? miniItems.some((it) => it.title.trim() !== "" || it.desc.trim() !== "")
        : listItems.some((s) => s.trim() !== "")
      : conditionText.trim() !== "";

  function handleSave() {
    if (!isValid) return;
    if (type === "label") {
      onSave({ condition: `–${labelText.trim()}`, desc: desc.trim() });
    } else if (type === "addendumbox") {
      onSave({
        addendumBox: {
          boxTitle: boxTitle.trim(),
          title: boxTraitTitle.trim(),
          desc: boxTraitDesc.trim(),
          abilities: [],
        },
      });
    } else if (type === "list") {
      const depth = listDepth > 0 ? { sublist: listDepth } : {};
      if (listSubtype === "bold") {
        const filtered = miniItems.filter((it) => it.title.trim() || it.desc.trim());
        onSave({ miniTraitList: filtered, ...depth });
      } else {
        const filtered = listItems.filter((s) => s.trim());
        onSave({ list: filtered, ...depth });
      }
    } else {
      onSave({ condition: conditionText.trim(), desc: desc.trim() });
    }
  }

  function updateListItem(i, val) {
    const next = [...listItems];
    next[i] = val;
    setListItems(next);
  }

  function updateMiniItem(i, field, val) {
    setMiniItems(miniItems.map((it, j) => j === i ? { ...it, [field]: val } : it));
  }

  const subtypeBtn = (s, label) => (
    <button
      onClick={() => setListSubtype(s)}
      className={`px-3 py-1 rounded text-xs transition-colors ${
        listSubtype === s
          ? "bg-dbu-header text-dbu-bg font-semibold"
          : "text-dbu-text hover:text-dbu-header"
      }`}
    >
      {label}
    </button>
  );

  const typeBtn = (t, label) => (
    <button
      onClick={() => setType(t)}
      className={`flex-1 py-2 rounded-md text-sm border transition-colors ${
        type === t
          ? "bg-dbu-header text-dbu-bg border-dbu-header font-semibold"
          : "border-dbu-line text-dbu-text hover:border-dbu-header"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-60"
      onClick={onClose}
    >
      <div
        className="bg-dbu-bg2 border border-dbu-line rounded-lg w-full max-w-3xl mx-4 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-dbu-line">
          <h2 className="text-dbu-header font-semibold">Add to Trait?</h2>
          <p className="text-xs text-dbu-text/50 mt-0.5">
            Tip: use <code className="text-dbu-header/80">[text](url)</code> in any description for inline hyperlinks, e.g. <code className="text-dbu-header/80">(See —[Passive Abilities](url))</code>
          </p>
        </div>

        {/* Body */}
        <div className="flex divide-x divide-dbu-line min-h-65">
          {/* Form */}
          <div className="w-1/2 p-6 flex flex-col gap-4">
            <div className="flex gap-2">
              {typeBtn("condition", "Effect")}
              {typeBtn("label", "Label")}
              {typeBtn("list", "List")}
              {typeBtn("addendumbox", "Box")}
            </div>

            {type === "condition" && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-dbu-text/50">Keywords</label>
                <input
                  value={conditionText}
                  onChange={(e) => setConditionText(e.target.value)}
                  placeholder="e.g. When attacking…"
                  className={inputClass}
                />
              </div>
            )}

            {type === "label" && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-dbu-text/50">Label Name</label>
                <input
                  value={labelText}
                  onChange={(e) => setLabelText(e.target.value)}
                  placeholder="e.g. Passive"
                  className={inputClass}
                />
              </div>
            )}

            {type === "list" && (
              <>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-dbu-text/50">Format</label>
                  <div className="flex gap-0.5 rounded-md border border-dbu-line p-0.5">
                    {subtypeBtn("plain", "Simple List")}
                    {subtypeBtn("bold", "Effects List")}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-dbu-text/50">Indent</label>
                  <select
                    value={listDepth}
                    onChange={(e) => setListDepth(Number(e.target.value))}
                    className={inputClass}
                  >
                    <option value={0}>• Disc — Indent 1</option>
                    <option value={1}>◦ Circle — Indent 2</option>
                    <option value={2}>▪ Square — Indent 3</option>
                  </select>
                </div>

                {listSubtype === "plain" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-dbu-text/50">Items</label>
                    {listItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          value={item}
                          onChange={(e) => updateListItem(i, e.target.value)}
                          placeholder={`Item ${i + 1}…`}
                          className={`${inputClass} flex-1`}
                        />
                        {listItems.length > 1 && (
                          <button
                            onClick={() => setListItems(listItems.filter((_, j) => j !== i))}
                            className="text-red-400 hover:text-red-300 shrink-0 text-lg leading-none"
                            title="Remove item"
                          >×</button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => setListItems([...listItems, ""])}
                      className="text-xs text-dbu-text/50 hover:text-dbu-header text-left"
                    >+ Add item</button>
                  </div>
                )}

                {listSubtype === "bold" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-dbu-text/50">Items</label>
                    {miniItems.map((item, i) => (
                      <div key={i} className="flex flex-col gap-1 border border-dbu-line/50 rounded p-2 relative">
                        {miniItems.length > 1 && (
                          <button
                            onClick={() => setMiniItems(miniItems.filter((_, j) => j !== i))}
                            className="absolute top-1 right-1 text-red-400 hover:text-red-300 text-lg leading-none"
                            title="Remove item"
                          >×</button>
                        )}
                        <input
                          value={item.title}
                          onChange={(e) => updateMiniItem(i, "title", e.target.value)}
                          placeholder="Name [Keywords]..."
                          className={inputClass}
                        />
                        <input
                          value={item.desc}
                          onChange={(e) => updateMiniItem(i, "desc", e.target.value)}
                          placeholder="Description…"
                          className={inputClass}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => setMiniItems([...miniItems, { title: "", desc: "" }])}
                      className="text-xs text-dbu-text/50 hover:text-dbu-header text-left"
                    >+ Add item</button>
                  </div>
                )}
              </>
            )}

            {type === "addendumbox" && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-dbu-text/50">Box Title <span className="text-red-400">*</span></label>
                  <input
                    value={boxTitle}
                    onChange={(e) => setBoxTitle(e.target.value)}
                    placeholder="e.g. Evolved Enhancement"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-dbu-text/50">Trait Title (optional)</label>
                  <input
                    value={boxTraitTitle}
                    onChange={(e) => setBoxTraitTitle(e.target.value)}
                    placeholder="e.g. Evolved Enhancement"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-dbu-text/50">Trait Description (optional)</label>
                  <textarea
                    value={boxTraitDesc}
                    onChange={(e) => setBoxTraitDesc(e.target.value)}
                    placeholder="Description…"
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </>
            )}

            {type !== "addendumbox" && type !== "list" && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-dbu-text/50">Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Ability description…"
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="w-1/2 p-6 flex flex-col">
            <p className="text-xs text-dbu-text/50 mb-3">Preview</p>
            <div className="bg-dbu-bg3 rounded-md p-4 flex-1">
              <AbilityPreview
                type={type}
                conditionText={conditionText}
                labelText={labelText}
                desc={desc}
                boxTitle={boxTitle}
                listSubtype={listSubtype}
                listItems={listItems}
                miniItems={miniItems}
                listDepth={listDepth}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dbu-line flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm border border-dbu-line text-dbu-text hover:border-dbu-header transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="px-4 py-2 rounded-md text-sm bg-dbu-link text-white hover:bg-dbu-link/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";

function AbilityPreview({ type, conditionText, labelText, desc, refName }) {
  const empty = <span className="italic text-dbu-text/30">…</span>;

  if (type === "label") {
    const display = labelText.trim() || empty;
    return (
      <p className="text-dbu-text text-md text-left my-1">
        {"–"}
        <span className="font-bold text-dbu-header">{display}</span>
        {": "}
        {desc.trim() || empty}
      </p>
    );
  }

  if (type === "seeref") {
    return (
      <p className="text-dbu-text text-md text-left my-1">
        {"(See —"}
        <span className="text-dbu-link">{refName.trim() || empty}</span>
        {")"}
      </p>
    );
  }

  return (
    <p className="text-dbu-text text-md text-left my-1">
      {"(1)-["}
      <span className="font-bold text-dbu-header">
        {conditionText.trim() || empty}
      </span>
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
  const [refName, setRefName] = useState("");
  const [refUrl, setRefUrl] = useState("");

  const isValid =
    type === "label"
      ? labelText.trim() !== ""
      : type === "seeref"
      ? refName.trim() !== "" && refUrl.trim() !== ""
      : conditionText.trim() !== "";

  function handleSave() {
    if (!isValid) return;
    if (type === "label") {
      onSave({ condition: `– ${labelText.trim()}`, desc: desc.trim() });
    } else if (type === "seeref") {
      onSave({ seeRef: { name: refName.trim(), url: refUrl.trim() } });
    } else {
      onSave({ condition: conditionText.trim(), desc: desc.trim() });
    }
  }

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
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]"
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
            Fill in the fields on the left and preview the result on the right.
          </p>
        </div>

        {/* Body */}
        <div className="flex divide-x divide-dbu-line min-h-[260px]">
          {/* Form */}
          <div className="w-1/2 p-6 flex flex-col gap-4">
            <div className="flex gap-2">
              {typeBtn("condition", "Condition")}
              {typeBtn("label", "Label")}
              {typeBtn("seeref", "See Ref")}
            </div>

            {type === "condition" && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-dbu-text/50">Condition</label>
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

            {type === "seeref" && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-dbu-text/50">Display Name</label>
                  <input
                    value={refName}
                    onChange={(e) => setRefName(e.target.value)}
                    placeholder="e.g. Super Saiyan"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-dbu-text/50">URL</label>
                  <input
                    type="url"
                    value={refUrl}
                    onChange={(e) => setRefUrl(e.target.value)}
                    placeholder="https://…"
                    className={inputClass}
                  />
                </div>
              </>
            )}

            {type !== "seeref" && (
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
                refName={refName}
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

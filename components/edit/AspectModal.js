"use client";
import {
    aspects,
    getAspectTooltip,
} from "../../components/dbu/General/util/headUtil.js";
import { Tooltip } from "../../lib/reactTooltip.js";
import { useState, useEffect } from "react";
import { RxArrowUp, RxInfoCircled} from "react-icons/rx";
import { prettifyAspects } from "../../components/dbu/General/util/headUtil.js";

export default function AspectsModal({ currentAspects, onSave, onClose }) {
    const [editedAspects, setEditedAspects] = useState(currentAspects); // A copy of the current aspects, to be edited by the user.

    const [positiveAspectOptions, setPositiveAspectOptions] = useState([]);
    const [negativeAspectOptions, setNegativeAspectOptions] = useState([]);

    const [selectedPos, setSelectedPos] = useState([]);
    const [selectedNeg, setSelectedNeg] = useState([]);

    // Make an Aspect List for the select boxes, filtering out aspects that are already in currentAspects
    // Can reuse the code for the Toggle Select in SettingsClient, but this is simpler since we don't need to worry about the "selected" state of the aspects, just the options available to select from

    useEffect(() => {
        const currentNames = new Set(editedAspects.map((a) => a.name));
        setPositiveAspectOptions(
            aspects.filter((a) => a.isPositive && !currentNames.has(a.name)),
        );
        setNegativeAspectOptions(
            aspects.filter((a) => !a.isPositive && !currentNames.has(a.name)),
        );
    }, [editedAspects]);

    const removeAspect = (aspectName) => {
        const newEditedAspects = editedAspects.filter(aspect => aspect.name !== aspectName);
        console.log(newEditedAspects);
        setEditedAspects(newEditedAspects);
    }

    const addAspect = (aspect) => {
        const newEditedAspects = [...editedAspects, aspect];
        setEditedAspects(prettifyAspects(newEditedAspects));
    }

    const handleSelectChange = (aspect, setter) => {
        const vals = Array.from(e.target.options)
            .filter((o) => o.selected)
            .map((o) => o.value);
        setter(vals);
    };

    const handleSave = () => {
        const chosenNames = [...selectedPos, ...selectedNeg];
        const chosenAspects = chosenNames
            .map((name) => aspects.find((a) => a.name === name))
            .filter(Boolean);
        onSave(chosenAspects);
    };

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
                    <h1 className="text-dbu-header font-semibold flex flex-wrap justify-center">
                        Aspects Editor
                    </h1>
                </div>

                {/* Body [Aspects display] */}
                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto bg-white/5">
                    <div className="flex flex-wrap justify-center gap-3 max-w-full">
                        {editedAspects.map((a, id) => (
                                <div
                                    key={id}
                                    className="inline-flex justify-between rounded-full border border-dbu-line bg-dbu-bg3 px-3 py-1 text-dbu-text text-sm text-center min-w-[10rem] max-w-[16rem] break-words"
                                >
                                    <a
                                        data-tooltip-id="my-tooltip-2"
                                        data-tooltip-html={getAspectTooltip(
                                            a.name,
                                        )}
                                        className="flex w-full cursor-help justify-center"
                                    >
                                        {a.name}
                                    </a>
                                    <button
                                        onClick={() => removeAspect(a.name)}
                                        className="ml-2 text-red-400/40 hover:text-red-400 text-sm leading-none cursor-pointer"
                                        title="Remove Aspect"
                                    >
                                        ×
                                    </button>
                            </div>

                        ))}
                    </div>
                </div>

                {/* Body [Aspects picker] */}
                <div className="flex gap-6">
                    <div className="flex-1">
                        <label className="text-dbu-header font-semibold mb-2 flex justify-center">
                            Positive Aspects
                        </label>
                        <div className="w-full h-[60vh] border space-y-1 border-dbu-line rounded overflow-y-auto p-2 bg-dbu-bg3 text-dbu-text">
                            {positiveAspectOptions.map((a) => (
                                <button
                                    key={a.name}
                                    value={a.name}
                                    onClick={() => addAspect(a)}
                                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-dbu-text hover:bg-dbu-line rounded transition-colors cursor-pointer gap-2"
                                >
                                    <span className="truncate min-w-0">
                                        {a.name}
                                    </span>
                                    <RxArrowUp className="flex justify-between shrink-0" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="text-dbu-header font-semibold mb-2 flex justify-center">
                            Negative Aspects
                        </label>
                        <select
                            multiple
                            size={8}
                            value={selectedNeg}
                            onChange={(e) =>
                                handleSelectChange(e, setSelectedNeg)
                            }
                            className="w-full h-60vh border border-dbu-line rounded p-2 bg-dbu-bg3 text-dbu-text"
                        >
                            {negativeAspectOptions.map((a) => (
                                <option key={a.name} value={a.name}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-dbu-line flex justify-end gap-2">
                    <button
                        className="px-4 py-2 rounded border border-dbu-line text-dbu-text hover:border-dbu-header transition-colors"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-dbu-link  text-white hover:bg-dbu-link/90"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
            <Tooltip
                id="my-tooltip-2"
                className="tooltip z-30"
                style={{ maxWidth: "400px" }}
            />
        </div>
    );
}

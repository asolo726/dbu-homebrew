"use client";
import Trait from "./trait";
import EditableText from "../../edit/EditableText";
import { useEditMode } from "../../edit/EditModeContext";
import { useState } from "react";
import { RxChevronRight } from "react-icons/rx";

export default function AddendumBox({
  boxTitle,
  title = "",
  desc = "",
  abilities,
  traits,
  path,
}) {
  const { isEditing } = useEditMode() || {};
  const [menuState, setMenuState] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const chevron = (
    <RxChevronRight
      className={"stroke-1 shrink-0 transition-transform ".concat(
        menuState
          ? isHovering ? "rotate-45" : "rotate-90"
          : isHovering ? "rotate-45" : "rotate-0",
      )}
    />
  );

  return (
    <div className="border border-dbu-header">
      {isEditing ? (
        // In edit mode: separate chevron button + inline-editable title
        <div
          className="flex items-center gap-2 w-full px-3 py-3"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <button onClick={() => setMenuState(!menuState)} className="cursor-pointer shrink-0">
            {chevron}
          </button>
          <p className="text-md md:text-lg flex-1">
            <EditableText path={path ? `${path}.boxTitle` : undefined} value={boxTitle} />
          </p>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 w-full text-left px-3 py-3 cursor-pointer font-sans"
          onClick={() => setMenuState(!menuState)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {chevron}
          <p className="text-md md:text-lg">{boxTitle}</p>
        </button>
      )}
      <div className={menuState ? "block px-3 pb-3" : "hidden"}>
        {traits ? (
          traits.map((trait, i) => (
            <Trait
              key={i}
              title={trait.title}
              desc={trait.desc}
              abilities={trait.abilities}
              path={path ? `${path}.traits.${i}` : undefined}
            />
          ))
        ) : (
          <Trait title={title} desc={desc} abilities={abilities} path={path} />
        )}
      </div>
    </div>
  );
}

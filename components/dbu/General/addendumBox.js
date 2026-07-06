"use client";
import Trait from "./trait";
import { useState } from "react";
import { RxChevronRight } from "react-icons/rx";

export default function AddendumBox({
  boxTitle,
  title = "",
  desc = "",
  abilities,
  traits, // optional array of { title, desc, abilities } for multi-trait boxes
}) {
  const [menuState, setMenuState] = useState(false); //True = Show, False = Hide
  const [isHovering, setIsHovering] = useState(false); // True = hovering, False = not hovering

  return (
    <div className="border-1 border-dbu-header">
      <button
        className="flex items-center gap-2 w-full text-left px-3 py-3 cursor-pointer font-sans"
        onClick={() => setMenuState(!menuState)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <RxChevronRight
          className={"stroke-1 shrink-0 transition-transform ".concat(
            // If menu is closed: 0 degrees
            // If menu is closed but user is hovering: 45 degrees
            // If menu is open: 90 degrees
            // If menu is open and user is hovering: 45 degrees
            menuState ? 
              isHovering ? "rotate-45" : "rotate-90" 
              : isHovering ? "rotate-45" : "rotate-0",
          )}
        />
        <p className="text-md md:text-lg">{boxTitle}</p>
      </button>
      <div className={menuState ? "block px-3 pb-3" : "hidden"}>
        {traits ? (
          traits.map((trait, i) => (
            <Trait
              key={i}
              title={trait.title}
              desc={trait.desc}
              abilities={trait.abilities}
            />
          ))
        ) : (
          <Trait title={title} desc={desc} abilities={abilities} />
        )}
      </div>
    </div>
  );
}

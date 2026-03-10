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
  const [menuState, setMenuState] = useState(true); //True = Show, False = Hide

  return (
    <div className="border-1 border-dbu-header">
      <button
        className="flex items-center gap-2 w-full text-left px-3 py-3 cursor-pointer font-sans"
        onClick={() => setMenuState(!menuState)}
      >
        <RxChevronRight
          className={"stroke-1 shrink-0 transition-transform".concat(
            menuState ? " rotate-90" : "",
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

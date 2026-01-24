"use client";
import Trait from "./trait";
import { useState } from "react";
import { RxChevronUp } from "react-icons/rx";

export default function AddendumBox({
  boxTitle,
  title = "",
  desc = "",
  abilities,
}) {
  const [menuState, setMenuState] = useState(false); //True = Show, False = Hide

  return (
    <div className="border-1 border-dbu-header">
      <div className="flex justify-between w-full">
        <p className="text-dbu-header text-center text-md md:text-2xl my-3 font-bold tracking-widest">
          {boxTitle}
        </p>
        <button className="pr-4" onClick={() => setMenuState(!menuState)}>
          <RxChevronUp
            className={"stroke-1".concat(menuState ? " rotate-180" : "")}
          />
        </button>
      </div>
      <div className={menuState ? "block" : "hidden"}>
        <Trait title={title} desc={desc} abilities={abilities} />
      </div>
    </div>
  );
}

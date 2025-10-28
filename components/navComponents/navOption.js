import NavDropdown from "./navDropdown";
import { useState } from "react";
import { RxChevronUp } from "react-icons/rx";
// Navigation option for Mobile
export default function NavOption({ text, link, list = [] }) {
    const content = () => {
        if (list.length > 0) {
            const [menuState, setMenuState] = useState(false);

            return (
                <div className="pt-3 border-b-1 border-dbu-line">
                    <div className="pb-3 flex justify-between w-full">
                        <p className="text-dbu-text decoration-0 hover:text-dbu-link text-sm">
                            {text}
                        </p>

                        <button
                            className="pr-4"
                            onClick={() => setMenuState(!menuState)}
                        >
                            <RxChevronUp
                                className={"stroke-1".concat(
                                    menuState ? " rotate-180" : ""
                                )}
                            />
                        </button>
                    </div>
                    <NavDropdown list={list} menuState={menuState} />
                </div>
            );
        } else {
            return (
                <div className="py-3 border-b-1 border-dbu-line">
                    <a
                        className="text-dbu-text decoration-0 text-sm hover:text-dbu-link"
                        href={link}
                    >
                        {text}
                    </a>
                </div>
            );
        }
    };
    return <>{content()}</>;
}

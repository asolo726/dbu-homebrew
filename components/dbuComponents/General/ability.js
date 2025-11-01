export default function Ability({ abilityList = [{}] }) {
    return (
        <div className="mt-2">
            {abilityList.map((item, key) => {
                if ("condition" in item) {
                    return (
                        <p
                            className="text-dbu-text text-md md:text-lg text-left my-1"
                            key={key}
                        >
                            {"-["}
                            <span className="font-bold text-dbu-header">
                                {`${item.condition}`}
                            </span>
                            {"]: "}
                            {item.desc}
                        </p>
                    );
                } else if ("list" in item) {
                    return (
                        <ul key={key} className="list-disc ml-10">
                            {item.list.map((listItem, key) => {
                                return (
                                    <li
                                        className="my-2 text-dbu-text text-md md:text-lg text-left"
                                        key={key}
                                    >
                                        {listItem}
                                    </li>
                                );
                            })}
                        </ul>
                    );
                }
            })}
        </div>
    );
}

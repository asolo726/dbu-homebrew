export default function Ability({ ability }) {
    const abilityDisplay = () => {
        ability.map((item, key) => {
            if (item.condition && item.desc) {
                return (
                    <p
                        className="text-dbu-text text-md md:text-lg text-left"
                        key={key}
                    >
                        <span className="font-bold text-dbu-header">
                            {item.condition}:
                        </span>{" "}
                        {item.desc}
                    </p>
                );
            }
        });
    };
    return <div className="mt-4">{abilityDisplay()}</div>;
}

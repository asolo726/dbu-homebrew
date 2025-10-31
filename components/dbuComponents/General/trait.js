import Ability from "./ability";
export default function Trait({trait = {title : "", desc : ""}, ability = [{}] }) {
    return (
        <div className="flex-grow-1">
            <p className="text-dbu-text text-md md:text-lg text-left">
                <span className="font-bold text-dbu-header">{trait.title}:</span>{" "}
                {trait.desc}
            </p>
            <Ability ability={ability} />
        </div>
    );
}

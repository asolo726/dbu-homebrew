import Ability from "./ability";
import EditableText from "../../edit/EditableText";

export default function Trait({ title = "", desc = "", abilities, path }) {
  return (
    <div className="flex-grow-1 mt-4">
      {title != "" && desc != "" ? (
        <p className="text-dbu-text text-md md:text-lg text-left">
          <span className="font-bold text-dbu-header">{title}:</span>{" "}
          {path ? <EditableText path={`${path}.desc`} value={desc} /> : desc}
        </p>
      ) : (
        ""
      )}
      <Ability abilityList={abilities} path={path} />
    </div>
  );
}

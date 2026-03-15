export default function RaceFeatures({
  racialLifeModifier,
  savingThrows = [""],
  skillRanks,
  attributeScores = "",
  minionSize = "",
  availableFactors,
}) {
  const savingThrowsDisplay =
    savingThrows.length === 1
      ? savingThrows[0]
      : savingThrows.forEach(savingThrows, (key) => {
          savingThrow + !(key === savingThrows.length - 1) // Check if not last saving throw
            ? key === savingThrows.length - 2 // Check if second to last saving throw
              ? " and "
              : ", "
            : "";
        });
  const hasMinionSize = minionSize != null && minionSize != undefined && minionSize != "";
  const hasAvailableFactors = availableFactors != null && availableFactors != undefined && availableFactors != "";
  const requirementNameStyle = "font-bold text-dbu-header";
  return (
    <div className="border-1 border-dbu-header space-y-6 p-2"> 
      <p>
        <span className={requirementNameStyle}>Attribute Score Increase:</span>{" "}
        {attributeScores}
      </p>
      <p>
        <span className={requirementNameStyle}>Racial Life Modifier:</span>{" "}
        +{racialLifeModifier}
      </p>
      <p>
        <span className={requirementNameStyle}>Saving Throws:</span>{" "}
        <span className="italic">{savingThrowsDisplay}</span>
      </p>
      <p>
        <span className={requirementNameStyle}>Skill Ranks:</span>{" "}
        {skillRanks}
      </p>
      {hasMinionSize ? (
        <p>
          <span className={requirementNameStyle}>Minion Size:</span>{" "}
          {minionSize}
      </p>
      ) : (
        <></>
      )}
      {hasAvailableFactors ? (
        <p>
          <span className={requirementNameStyle}>Available Factors:</span>{" "}
          {availableFactors}
      </p>
      ) : (
        <></>
      )}
    </div>
  );
}

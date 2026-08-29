import EditableText from "@/components/edit/EditableText";
interface AttributeItem {
  attribute: string;
  bonus?: string | number;
  multiplier?: string;
  Bonus?: string | number;
  Multiplier?: string;
}
interface AttributeModsTableProps {
  attrTable: Readonly<AttributeItem>[];
  isEditing: boolean;
  pendingChanges: any;
}
export default function AttributeModsTable({
  attrTable,
  isEditing,
  pendingChanges,
}: Readonly<AttributeModsTableProps>) {
  const multiplierDisplay = (
    currentBonus: string,
    currentMultiplier: string,
  ) => {
    // For some reason, when the multiplier is empty, it's a \n value ???
    if (currentBonus && currentBonus !== "") {
      // So, you may wonder why this is here. Well, currently, when a user puts in nothing for an
      // attribute bonus, a "0" is put into the currentBonus field.
      if (Number(currentBonus) === 0) {
        return "-";
      }
      if (currentMultiplier === "\n" || currentMultiplier === "") {
        return `+${currentBonus}`;
      } else {
        return `+${currentBonus}(${currentMultiplier})`;
      }
    } else {
      return "-";
    }
  };
  /**
 * currentMultiplier === "" ? (
                    `+${currentBonus}`
                ) : (
                    `+${currentBonus}(${currentMultiplier})`
                )

 */
  if (attrTable === undefined) return;
  else if (attrTable.length > 0) {
    return (
      <div className="flex justify-center py-5">
        <table className="table-fixed w-full border-collapse text-center text-md md:text-xl font-light ">
          <thead>
            <tr>
              {attrTable.map((modifier, id) => (
                <th
                  key={id}
                  className="border border-dbu-header min-w-[3em] max-w-[10em] py-2 break-all"
                >
                  {modifier.attribute}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {attrTable.map((modifier, id) => {
                const bonusValue = modifier.bonus ?? modifier.Bonus ?? 0;
                const multiplierValue = modifier.multiplier ?? modifier.Multiplier ?? "";
                const currentBonus =
                  pendingChanges?.[`head.details.attributeModifiers.${id}.Bonus`] ??
                  pendingChanges?.[`head.details.attributeModifiers.${id}.bonus`] ??
                  bonusValue;
                const currentMultiplier =
                  pendingChanges?.[
                    `head.details.attributeModifiers.${id}.Multiplier`
                  ] ??
                  pendingChanges?.[
                    `head.details.attributeModifiers.${id}.multiplier`
                  ] ??
                  multiplierValue;
                return (
                  <td
                    className="border border-dbu-header min-w-[3em] max-w-[10em] py-2 break-all"
                    key={id}
                  >
                    {isEditing ? (
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-0.5">
                          +
                          <EditableText
                            path={`head.details.attributeModifiers.${id}.Bonus`}
                            value={String(bonusValue)}
                            className="w-10 text-center"
                          />
                        </div>
                        <EditableText
                          path={`head.details.attributeModifiers.${id}.Multiplier`}
                          value={multiplierValue}
                          className="w-full text-center text-md"
                        />
                      </div>
                    ) : (
                      multiplierDisplay(String(currentBonus), String(currentMultiplier))
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

/**
 *  {Form.head.attributeModifiers &&
      Form.head.attributeModifiers.length > 0 ? (
        <div className="flex justify-center py-5">
          <table className="table-fixed w-full border-collapse text-center text-md md:text-xl font-light ">
            <thead>
              <tr>
                {Form.head.attributeModifiers.map((modifier, id) => (
                  <th
                    key={id}
                    className="border border-dbu-header min-w-[3em] max-w-[10em] py-2 break-all"
                  >
                    {modifier.attribute}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Form.head.attributeModifiers.map((modifier, id) => {
                  const currentBonus = pendingChanges?.[`head.attributeModifiers.${id}.Bonus`] ?? modifier.Bonus;
                  const currentMultiplier = pendingChanges?.[`head.attributeModifiers.${id}.Multiplier`] ?? modifier.Multiplier;
                  return (
                    <td
                      className="border border-dbu-header min-w-[3em] max-w-[10em] py-2 break-all"
                      key={id}
                    >
                      {isEditing ? (
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-0.5">
                            +<EditableText
                              path={`head.attributeModifiers.${id}.Bonus`}
                              value={String(modifier.Bonus)}
                              className="w-10 text-center"
                            />
                          </div>
                          <EditableText
                            path={`head.attributeModifiers.${id}.Multiplier`}
                            value={modifier.Multiplier}
                            className="w-full text-center text-sm"
                          />
                        </div>
                      ) : currentBonus > 0 ? (
                        currentMultiplier.length === 0
                          ? `+${currentBonus}`
                          : `+${currentBonus}(${currentMultiplier})`
                      ) : (
                        "-"
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <></>
      )}
 */

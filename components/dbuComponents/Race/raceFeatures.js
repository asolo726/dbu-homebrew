export default function RaceFeatures(
    {
        racialLifeModifier, 
        savingThrows = [""], 
        skillRanks, 
        attributeMod = "", 
        minionSize = "", 
        availableFactors
    }
) {
    const savingThrowsDisplay = savingThrows.length === 1 
        ? savingThrows[0]
        : savingThrows.forEach(savingThrows, key => {
            savingThrow 
            + !(key === savingThrows.length-1) ? // Check if not last saving throw
                (key === savingThrows.length-2) ? // Check if second to last saving throw
                    " and "
                    :", "
                : ""
        });
    
    

}
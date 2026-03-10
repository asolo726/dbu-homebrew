export const aspectData = {
  Armored: {
    type: "Positive",
    effects:
      "Reduce the Damage Category of all Attacking Maneuvers that hit you by 1 Category for the sake of your Damage Calculation.",
    maxLevel: 0,
  },
  "Battle Uniform": {
    type: "Positive",
    effects:
      "When you enter this Transformation, you lose access to your current Apparel until you leave the Transformation. While within the Transformation, you are equipped with the Apparel described at the bottom of the Transformation's description. Apparel given through Battle Uniform has the Stretching Quality, and any Special Qualities possessed by the Apparel you were previously wearing. All Qualities unique to Battle Uniforms are Special Qualities. If you're benefiting from the Battle Uniform Aspect from a Form (or Transcendent Enhancement) and an Enhancement concurrently, apply the Grade and Category from the non-Transcendent Enhancement's Battle Uniform.",
    maxLevel: 0,
  },
  Bulky: {
    type: "Positive",
    effects: "Gain 1 Super Stack while in this Transformation.",
    maxLevel: 0,
  },
  "Enhanced Save": {
    type: "Positive",
    effects:
      "Increase the Saving Throw(s) listed in brackets after this Aspect's name by 1(T).",
    maxLevel: 0,
  },
  Glowing: {
    type: "Positive",
    effects:
      "You are a Light Source that increases the Light Level by 1 in a Minor Sphere AoE (centered on you). This increase to Light Level cannot cause the Light Level to exceed Normal.",
    maxLevel: 0,
  },
  "God Ki": {
    type: "Positive",
    effects:
      "While you are in this Transformation, you are in the God Ki State.",
    maxLevel: 0,
  },
  Graded: {
    type: "Positive",
    effects:
      "This Transformation has Grades. While in a Transformation with the Graded Aspect, you may use the Transformation Maneuver to attempt to enter that same Transformation (but at a different Grade). If you do, you must still make the Stress Test for that Transformation at that Grade and if you fail, you will suffer the typical consequences.",
    maxLevel: 0,
  },
  Growth: {
    type: "Positive",
    effects:
      "The first level of this Aspect sets your Size Category to Large while in this Transformation. For every level after the first, increase the Size Category you are set to by 1. This Aspect cannot cause your Size Category to be lower than it would be prior to applying its effects.",
    maxLevel: 3,
  },
  Heartbeat: {
    type: "Positive",
    effects:
      "Surging Strength becomes [3/Round] if used solely on Transformations with the Heartbeat Aspect in that Combat Round. If you use Surging Strength to enter a Transformation with the Heartbeat Aspect, it ignores the 3/Encounter limit of Surging Strength.",
    maxLevel: 0,
  },
  "High Speed": {
    type: "Positive",
    effects:
      "Increase your Speeds by the Attribute Modifier Bonus (AG) of this Transformation. If you are using multiple Transformations in conjunction with another that possesses this Aspect, only increase your Speeds by the highest Attribute Modifier Bonus (AG).",
    maxLevel: 0,
  },
  "Innate State": {
    type: "Positive",
    effects:
      "Upon entering this Form, you enter the State listed in brackets after this Aspect until you leave this Transformation. If you would leave this State for any reason, leave this Transformation and gain Stress Exhaustion until the end of your next turn.",
    maxLevel: 0,
  },
  Linked: {
    type: "Positive",
    effects:
      "Upon entering this Form, you also enter the listed Enhancement in brackets after this Aspect. If you were already using an Enhancement, you leave that Enhancement to enter the listed Enhancement.",
    maxLevel: 0,
  },
  Mindful: {
    type: "Positive",
    effects:
      "While in the Mindful State, increase your Dodge Rolls and your Strike Rolls for the Parry effect of the Defend Maneuver by 1(T).",
    maxLevel: 0,
  },
  Natural: {
    type: "Positive",
    effects:
      "Level 1+: You are not required to roll Stress Tests while only in this Transformation. You do not leave this form if suffering from Stress Exhaustion." +
      "<br><br>" +
      "Level 2: If you would leave a Transformation, you may enter this Transformation instead of your Normal State. You still suffer the effects of Stress Exhaustion.",
    maxLevel: 2,
  },
  "Perfect Ki Control": {
    type: "Positive",
    effects:
      "Reduce the Ki Point Cost of all Attacking Maneuvers by 1(T). Your Minimum Ki Point Cost for Attacking Maneuvers is 2(T), this cannot increase the Minimum Ki Point Cost for an Attacking Maneuver.",
    maxLevel: 0,
  },
  Pinnacle: {
    type: "Positive",
    effects:
      "This Evolved Stage can be stacked atop another Evolved Stage with the same Original Transformation.",
    maxLevel: 0,
  },
  Prelude: {
    type: "Positive",
    effects:
      "If you would select this Transformation for the Transformation Maneuver, you may reduce this Transformation's Tier of Power Requirement by 1 and its Stress Test Requirement by 5 until you leave this Transformation. If you do, you also reduce the Attribute Modifier Bonuses by 1(T) (this cannot reduce those Attribute Modifier Bonuses below 1(T)) and you do not benefit from the last Transformation Trait of this Transformation while in this Transformation (any Permanent effects are still in effect). If a rule or effect would increase your Tier of Power while a Transformation is benefiting from the effects of the Prelude Aspect, you may choose to remove the effects of the Prelude Aspect for the duration of that effect (this also includes losing any Holding Back stacks, in which case it lasts until you leave the Transformation or gain another Holding Back stack).",
    maxLevel: 0,
  },
  Raging: {
    type: "Positive",
    effects: "While in the Raging State, increase your Wound Rolls by 2(T).",
    maxLevel: 0,
  },
  Realization: {
    type: "Positive",
    effects:
      "You may apply the effects of Legend Realized as an Instant Maneuver (in addition to the use gained through entering the Transformation) x number of times per Combat Encounter, where x is equal to the amount your base Tier of Power exceeds the original Tier of Power Requirement for this Transformation (before any modification, such as through the Scaling Aspect). x cannot exceed 2.",
    maxLevel: 0,
  },
  Scaling: {
    type: "Positive",
    effects:
      "Increase your Attribute Modifier Bonuses for this Transformation (except IN) by x(T), and the Stress Test Requirement of this Transformation by 2x, where x is equal to the amount your Tier of Power exceeds the original (before any modifications) Tier of Power Requirement for this Transformation. x cannot exceed the level of this Aspect." +
      "<br><br>" +
      "Increase the Tier of Power Requirement of this Transformation by x for the sake of any effects (this includes the effects of other Aspects like Draining).",
    maxLevel: 4,
  },
  "Super Saiyan Form": {
    type: "Positive",
    effects:
      "Apply your Tier of Power Extra Dice an additional time and increase your Maximum Ki Points and Max Capacity by 1/4 of their maximums." +
      "<br><br>" +
      "A Transformation with this Aspect is considered to be in the Super Saiyan Transformation Line for the effects of your Traits.",
    maxLevel: 0,
  },
  Transcendent: {
    type: "Positive",
    effects:
      "This is a Transcendent Enhancement, allowing it to take the place of transforming your body.",
    maxLevel: 0,
  },
  Variant: {
    type: "Positive",
    effects:
      "This Transformation is a Variant Transformation for the Transformation listed in brackets.",
    maxLevel: 0,
  },
  "Blutz Wave": {
    type: "Negative",
    effects:
      "A Character can only enter this Transformation if they have the Tailed Option effect for the Saiyan Heritage Racial Trait. If they would lose their Tail (or this Option effect) through any means, they immediately leave this Transformation and suffer from Stress Exhaustion until the end of their next turn." +
      "<br><br>" +
      "A Called Shot made against the Tail of a Character with this Aspect has its Damage Category reduced by 1 Category." +
      "<br><br>" +
      "A Transformation with this Aspect is considered to be in the Great Ape Transformation Line for the effects of your Traits.",
    maxLevel: 0,
  },
  Bursting: {
    type: "Negative",
    effects:
      "Upon entering this Transformation, destroy your Top Layer of Apparel.",
    maxLevel: 0,
  },
  Dedicated: {
    type: "Negative",
    effects:
      "You can only enter this Transformation through the Transformation Maneuver. This Aspect cannot be removed through any means aside from the effects of a Mastery Trait that specifically refers to it by name.",
    maxLevel: 0,
  },
  Difficult: {
    type: "Negative",
    effects:
      "For each level of this Aspect, you must master this Transformation an additional time. The Mastery Trait is separated into multiple Traits, ordered by a number in brackets after the name of the Trait showing how many times that Transformation needed to be mastered to gain that Trait." +
      "<br><br>" +
      "A denotation of ‘M’ refers to the number of times a Transformation has been Mastered.",
    maxLevel: 2,
  },
  Draining: {
    type: "Negative",
    effects:
      "At the start of each of your turns, reduce your Ki Points by 3(T) for each level of this Aspect. When calculating the Tier of Power for Draining, use the highest Tier of Power Requirement for any Transformation(s) you are currently in, instead of your current Tier of Power.",
    maxLevel: 999,
  },
  Exhausting: {
    type: "Negative",
    effects:
      "If you would leave this Transformation through any means, except to use the Transformation Maneuver to enter a Transformation with a higher Tier of Power Requirement, immediately begin suffering from the Stress Exhaustion and Impediment Combat Conditions until the end of your next turn.",
    maxLevel: 0,
  },
  Fading: {
    type: "Negative",
    effects:
      "Lvl 1: Upon leaving this Transformation, you cannot enter this Transformation again for the remainder of the Combat Encounter." +
      " <br><br>" +
      "Lvl 2: Upon leaving this Transformation, you lose access to this Transformation.",
    maxLevel: 2,
  },
  "Light Dependent": {
    type: "Negative",
    effects: "N/A. This Aspect exists entirely for classification.",
    maxLevel: 0,
  },
  Limited: {
    type: "Negative",
    effects:
      "After using the Transformation Maneuver to enter this Transformation, you will be forced to leave this Transformation in a number of Combat Rounds equal to the level of this Aspect. When you do, you do not suffer from Stress Exhaustion but you cannot enter the Transformation you left through Limited again until the end of your next turn. You still suffer Stress Exhaustion if this Transformation has the Exhausting Aspect.",
    maxLevel: 5,
  },
  "Long Transformation": {
    type: "Negative",
    effects:
      "Increase the amount of Actions required to enter this Transformation through the Transformation Maneuver by 1 for each level of this Aspect. You cannot use Surging Strength to enter this Transformation, and the Transformation Maneuver when used to try and enter this Transformation triggers the Exploit Maneuver from any Opponents who are not at Long Range." +
      "<br><br>" +
      "If you are knocked through a Health Threshold when attempting to transform into a Transformation with this Aspect from an Attacking Maneuver of the Exploit Maneuver, you automatically fail the Stress Test to enter this Transformation.",
    maxLevel: 2,
  },
  Peaked: {
    type: "Negative",
    effects:
      "This Transformation cannot be Mastered, but is always considered Mastered for effects.",
    maxLevel: 0,
  },
  "Power High": {
    type: "Negative",
    effects:
      "Increase the Ki Point Cost for the Guard option of the Defend Maneuver by 1(T) for each level of this Aspect.",
    maxLevel: 3,
  },
  Rampaging: {
    type: "Negative",
    effects:
      "Upon entering this Transformation, and at the start of each of your turns while in this Transformation, gain the Compelled Combat Condition against the nearest Opponent until the start of your next turn. If you have 2 levels of Rampaging, instead gain the Compelled Combat Condition against the nearest Character." +
      "<br><br>" +
      "While you are suffering from the Compelled Combat Condition, you cannot leave this Transformation through the Transformation Maneuver, Surging Strength, or Revert Maneuver. Additionally, your Stress Tests become Urgent." +
      "<br><br>" +
      "Upon entering this Transformation, or at the start of your turn, you can spend 1 Karma Point to ignore the effects of the Rampaging Aspect until the start of your next turn.",
    maxLevel: 2,
  },
  Straining: {
    type: "Negative",
    effects:
      "While in this Transformation, you must make a Stress Test at the start of each of your turns.",
    maxLevel: 0,
  },
  Weakening: {
    type: "Negative",
    effects:
      "If your current Ki Point Pool is below 1/4 of your Maximum Ki Point Pool while in this Transformation, reduce this Transformation’s Attribute Modifier Bonuses (after all calculations) by 1/2. You do not suffer this effect if you have entered this Transformation through the effects of Surging Strength.",
    maxLevel: 0,
  },
};

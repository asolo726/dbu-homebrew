"use client";

import { useState } from "react";
import SegmentedProgressBar from "../../components/SegmentedProgressBar";
import {
  coreRulesPageProgress,
  signatureTechniquesPageProgress,
  uniqueAbilitiesPageProgress,
  lesserAwakeningsPageProgress,
  greaterAwakeningsPageProgress,
  superAwakeningsPageProgress,
  enhancementsPageProgress,
  alternateFormsPageProgress,
  legendaryFormsPageProgress,
  evolvedStagesPageProgress,
} from "../../lib/pageProgressData";

export default function Dashboard() {
  // Helper function to calculate progress from pageProgress object (handles nested structures)
  const calculateProgress = (pageProgress) => {
    const countItems = (obj) => {
      let completed = 0;
      let total = 0;

      Object.values(obj).forEach((value) => {
        if (typeof value === "boolean") {
          total++;
          if (value) completed++;
        } else if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          // Check if it's a completion object with completed property
          if ("completed" in value) {
            total++;
            if (value.completed) completed++;
          } else {
            const { completed: nestedCompleted, total: nestedTotal } =
              countItems(value);
            completed += nestedCompleted;
            total += nestedTotal;
          }
        }
      });

      return { completed, total };
    };

    const { completed, total } = countItems(pageProgress);
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  // Calculate Core Rules progress from actual data
  const coreRulesProgress = calculateProgress(coreRulesPageProgress);
  const signatureTechniquesProgress = calculateProgress(
    signatureTechniquesPageProgress,
  );
  const uniqueAbilitiesProgress = calculateProgress(
    uniqueAbilitiesPageProgress,
  );
  const lesserAwakeningsProgress = calculateProgress(
    lesserAwakeningsPageProgress,
  );
  const greaterAwakeningsProgress = calculateProgress(
    greaterAwakeningsPageProgress,
  );
  const superAwakeningsProgress = calculateProgress(
    superAwakeningsPageProgress,
  );
  const enhancementsProgress = calculateProgress(enhancementsPageProgress);
  const alternateFormsProgress = calculateProgress(alternateFormsPageProgress);
  const legendaryFormsProgress = calculateProgress(legendaryFormsPageProgress);
  const evolvedStagesProgress = calculateProgress(evolvedStagesPageProgress);

  // State for dropdown toggles - track which bars have open dropdowns
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (label) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Helper function to check if an item is completed (handles nested items)
  const isItemCompleted = (item) => {
    if (typeof item === "boolean") {
      return item;
    }
    if (typeof item === "object" && item !== null) {
      // Check if it's a completion object with completed property
      if ("completed" in item) {
        return item.completed;
      }
      // For nested objects, check if all items are completed
      return Object.values(item).every((subItem) => isItemCompleted(subItem));
    }
    return false;
  };

  // Helper function to check if an item is new
  const isItemNew = (item) => {
    if (typeof item === "object" && item !== null && "isNew" in item) {
      return item.isNew;
    }
    return false;
  };

  // Helper function to render page progress items recursively
  const renderPageProgressItems = (items, depth = 0) => {
    return Object.entries(items).map(([key, value]) => (
      <div key={key} style={{ marginLeft: `${depth * 1.5}rem` }}>
        <div className="flex items-center gap-3 mb-2 text-gray-200">
          <span
            className={
              isItemCompleted(value) ? "text-green-500" : "text-red-500"
            }
          >
            {isItemCompleted(value) ? "✓" : "✕"}
          </span>
          <span className={depth > 0 ? "text-gray-400 text-sm" : ""}>
            {key}
          </span>
          {isItemNew(value) && (
            <span className="text-yellow-400 text-sm">⭐ New! ⭐</span>
          )}
        </div>
        {typeof value === "object" &&
          !Array.isArray(value) &&
          !("completed" in value) &&
          renderPageProgressItems(value, depth + 1)}
      </div>
    ));
  };

  // Progress data for all bars with colors and pageProgress data
  const progressBars = [
    {
      label: "Core Rules",
      currentProgress: coreRulesProgress,
      color: "amber",
      pageProgress: coreRulesPageProgress,
    },
    {
      label: "Signature Techniques",
      currentProgress: signatureTechniquesProgress,
      color: "orange",
      pageProgress: signatureTechniquesPageProgress,
    },
    {
      label: "Unique Abilities",
      currentProgress: uniqueAbilitiesProgress,
      color: "pink",
      pageProgress: uniqueAbilitiesPageProgress,
    },
    {
      label: "Lesser Awakenings",
      currentProgress: lesserAwakeningsProgress,
      color: "purple",
      pageProgress: lesserAwakeningsPageProgress,
    },
    {
      label: "Greater Awakenings",
      currentProgress: greaterAwakeningsProgress,
      color: "purple",
      pageProgress: greaterAwakeningsPageProgress,
    },
    {
      label: "Super Awakenings",
      currentProgress: superAwakeningsProgress,
      color: "purple",
      pageProgress: superAwakeningsPageProgress,
    },
    {
      label: "Enhancements",
      currentProgress: enhancementsProgress,
      color: "cyan",
      pageProgress: enhancementsPageProgress,
    },
    {
      label: "Alternate Forms",
      currentProgress: alternateFormsProgress,
      color: "yellow",
      pageProgress: alternateFormsPageProgress,
    },
    {
      label: "Legendary Forms",
      currentProgress: legendaryFormsProgress,
      color: "red",
      pageProgress: legendaryFormsPageProgress,
    },
    {
      label: "Evolved Stages",
      currentProgress: evolvedStagesProgress,
      color: "slate",
      pageProgress: evolvedStagesPageProgress,
    },
  ];

  // Sort bars by progress (lowest first, so highest appears at bottom)
  const sortedBars = [...progressBars].sort(
    (a, b) => a.currentProgress - b.currentProgress,
  );

  // Calculate overall progress
  const totalProgress = progressBars.reduce(
    (sum, bar) => sum + bar.currentProgress,
    0,
  );
  const maxTotalProgress = progressBars.length * 100;
  const overallProgress = Math.round((totalProgress / maxTotalProgress) * 100);

  return (
    <div className="p-6 w-400">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Overall Progress Bar */}
      <div className="mb-20">
        <SegmentedProgressBar
          label="0.9.3 Update Progress"
          currentProgress={overallProgress}
          totalSegments={20}
          color="green"
        />
      </div>

      {/* Individual Progress Bars - sorted */}
      {sortedBars.map((bar, index) => (
        <div key={index} className="mb-4">
          <SegmentedProgressBar
            label={bar.label}
            currentProgress={bar.currentProgress}
            totalSegments={20}
            color={bar.color}
            onToggleDropdown={() => toggleDropdown(bar.label)}
            isOpen={openDropdowns[bar.label]}
          />
          {openDropdowns[bar.label] && (
            <div className="ml-6 mb-4 bg-gray-900 rounded-lg p-4">
              {renderPageProgressItems(bar.pageProgress)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

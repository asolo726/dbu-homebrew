"use client";
import { useState, useEffect } from "react";
import SegmentedProgressBar from "./SegmentedProgressBar";
import ProgressBarClass from "../../classes/progress-tracker/progressBar.Class";
import {
  calculateProgress,
  countAllItems,
  renderPageProgressItems,
} from "../../app/home/progress-tracker/progressTrackerUtil";

export default function ProgressBoard({ progressData }) {
  // Progress data for all bars with colors and pageProgress data
  const [data, setData] = useState([]);
  const [progressBars, setProgressBars] = useState([]);

  // State for dropdown toggles - track which bars have open dropdowns
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (label) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Import data from MongoDB and calculate progress for each bar
  useEffect(() => {
    setProgressBars([]);
    if (progressData.Response === "No Data Found"){
      throw Error("No Data Found for Progress Board");
      return;
    }
    else setData(progressData.Response);
    
    data.forEach((bar) => {
      const label = bar.progressBar;
      const segmentColor = bar.segmentColor;
      const textColor = bar.textColor;
      const pageCountOverride = bar.pageCountOverride || null;
      const pageProgress = bar.data;
      const currentProgress = calculateProgress(pageProgress);
      setProgressBars((prev) => [
        ...prev,
        new ProgressBarClass(
          label,
          currentProgress,
          textColor,
          segmentColor,
          pageProgress,
          pageCountOverride,
        ),
      ]);
    });
  }, [data]);

  let totalPages = 0;
  let completedPages = 0;
  let newContentCount = 0;
  progressBars.forEach((bar) => {
      const { completed, total, newItems } = countAllItems(bar.pageProgress);
      let override = null;
      try { bar.pageCountOverride >= 0 ? override = bar.pageCountOverride : null}
      catch {console.log("Error in Progress Bar: ", bar.progressBar)}
      totalPages += override ? override : total;
      completedPages += override ? override : completed;
      newContentCount += newItems;
    }
  );

  const pagesLeftToUpdate = totalPages - completedPages;

  // Calculate days since update began (October 13, 2025)
  const updateStartDate = new Date(2025, 9, 13); // October 13, 2025
  const today = new Date();
  const daysSinceUpdate = Math.floor(
    (today - updateStartDate) / (1000 * 60 * 60 * 24),
  );

  // Calculate estimated time to completion
  const pagesPerDay = completedPages / Math.max(daysSinceUpdate, 1); // Avoid division by zero
  const estimatedDaysRemaining = Math.ceil(pagesLeftToUpdate / pagesPerDay);
  const estimatedCompletionDate = new Date(today);
  estimatedCompletionDate.setDate(
    estimatedCompletionDate.getDate() + estimatedDaysRemaining,
  );
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formattedCompletionDate = `${monthNames[estimatedCompletionDate.getMonth()]} ${estimatedCompletionDate.getDate()}, ${estimatedCompletionDate.getFullYear()}`;

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
      <h1 className="text-3xl font-bold mb-8">DBU Update Progress Tracker</h1>

      {/* Overall Progress Bar */}
      <div className="mb-12">
        <SegmentedProgressBar
          label="0.9.3 Update Progress"
          currentProgress={overallProgress}
          totalSegments={20}
          color="green"
        />

        {/* Statistics */}
        <div className="mt-6 bg-gray-900 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-6">
            <div>
              <p className="text-gray-400 text-base">
                Days Since Update Began (Oct 13, 2025)
              </p>
              <p className="text-purple-400 font-bold text-4xl">
                {daysSinceUpdate}
              </p>
              <p className="text-gray-400 text-base">days</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400">Total Pages</p>
              <p className="text-green-400 font-bold text-2xl">{totalPages}</p>
            </div>
            <div>
              <p className="text-gray-400">Pages Updated</p>
              <p className="text-green-400 font-bold text-2xl">
                {completedPages}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Pages Left to Update</p>
              <p className="text-yellow-400 font-bold text-2xl">
                {pagesLeftToUpdate}
              </p>
            </div>
            <div>
              <p className="text-gray-400">New Content</p>
              <p className="text-cyan-400 font-bold text-2xl">
                {newContentCount}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-base mb-2">
              Estimated Time until Update is Complete
            </p>
            <p className="text-blue-400 font-bold text-2xl">
              {estimatedDaysRemaining} days
            </p>
            <p className="text-gray-500 text-sm">({formattedCompletionDate})</p>
          </div>
        </div>
      </div>

      {/* Individual Progress Bars - sorted */}
      {sortedBars.map((bar, index) => (
        <div key={index} className="mb-4">
          <SegmentedProgressBar
            label={bar.label}
            currentProgress={bar.currentProgress}
            totalSegments={20}
            segmentColor={bar.segmentColor}
            textColor={bar.textColor}
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

"use client";

/**
 * SegmentedProgressBar Component
 * Displays a progress bar divided into segments
 *
 * @param {string} label - Label for the progress bar
 * @param {number} currentProgress - Current progress value (0-100)
 * @param {number} totalSegments - Total number of segments to divide the bar into (default: 100)
 * @param {string} color - Tailwind color class (e.g., 'green', 'cyan', 'purple')
 * @param {function} onToggleDropdown - Optional callback when dropdown is toggled
 * @param {boolean} isOpen - Whether the dropdown is currently open
 */
export default function SegmentedProgressBar({
  label,
  currentProgress = 0,
  totalSegments = 20,
  color = "green",
  onToggleDropdown,
  isOpen = false,
}) {
  const filledSegments = Math.ceil((currentProgress / 100) * totalSegments);
  const percentage = Math.round(currentProgress);
  const segmentsArray = Array.from({ length: totalSegments });

  // Map color names to Tailwind classes for filled segments
  const colorMap = {
    green: "bg-green-500",
    darkgreen: "bg-green-800",
    amber: "bg-amber-600",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
    purple: "bg-purple-500",
    cyan: "bg-cyan-500",
    yellow: "bg-yellow-400",
    red: "bg-red-600",
    slate: "bg-slate-600",
    rainbow: null, // Special case handled separately
  };

  // Map color names to text colors
  const textColorMap = {
    green: "text-green-500",
    darkgreen: "text-green-800",
    amber: "text-amber-600",
    orange: "text-orange-500",
    pink: "text-pink-500",
    purple: "text-purple-500",
    cyan: "text-cyan-500",
    yellow: "text-yellow-400",
    red: "text-red-600",
    slate: "text-slate-600",
    rainbow: "text-purple-500",
  };

  const getSegmentColor = () => {
    return colorMap[color] || colorMap.green;
  };

  const textColor = textColorMap[color] || textColorMap.green;

  return (
    <div className="flex items-center gap-6 mb-8 w-full">
      {/* Label with optional dropdown chevron */}
      <div className="flex items-center gap-2 whitespace-nowrap">
        {onToggleDropdown && (
          <button
            onClick={onToggleDropdown}
            className={`${textColor} cursor-pointer hover:opacity-80`}
          >
            {isOpen ? "▼" : "▶"}
          </button>
        )}
        <span className={`${textColor} font-mono text-lg`}>{label}</span>
      </div>

      {/* Progress Bar Container - Darker Box Background */}
      <div className="flex-1 bg-gray-950 rounded-lg p-3">
        <div className="flex gap-1">
          {/* Segments */}
          {segmentsArray.map((_, index) => (
            <div
              key={index}
              style={{ flex: `1 1 0%` }}
              className={`h-8 transition-all rounded-sm ${
                index < filledSegments ? getSegmentColor(index) : "bg-gray-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Percentage */}
      <span className={`${textColor} font-mono text-lg whitespace-nowrap`}>
        {percentage}%
      </span>
    </div>
  );
}

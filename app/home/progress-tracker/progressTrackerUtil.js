// Helper function to calculate progress from pageProgress object (handles nested structures)
export const calculateProgress = (pageProgress) => {
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

// Helper function to check if an item is new
export const isItemNew = (item) => {
  if (typeof item === "object" && item !== null && "isNew" in item) {
    return item.isNew;
  }
  return false;
};

// Helper function to count all items and their completion status
export const countAllItems = (pageProgress) => {
  const countItems = (obj) => {
    let completed = 0;
    let total = 0;
    let newItems = 0;

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
          if (value.isNew) newItems++;
        } else {
          const {
            completed: nestedCompleted,
            total: nestedTotal,
            newItems: nestedNewItems,
          } = countItems(value);
          completed += nestedCompleted;
          total += nestedTotal;
          newItems += nestedNewItems;
        }
      }
    });

    return { completed, total, newItems };
  };

  return countItems(pageProgress);
};

// Helper function to render page progress items recursively
export const renderPageProgressItems = (items, depth = 0) => {
  return Object.entries(items).map(([key, value]) => (
    <div key={key} style={{ marginLeft: `${depth * 1.5}rem` }}>
      <div className="flex items-center gap-3 mb-2 text-gray-200">
        <span
          className={isItemCompleted(value) ? "text-green-500" : "text-red-500"}
        >
          {isItemCompleted(value) ? "✓" : "✕"}
        </span>
        <span className={depth > 0 ? "text-gray-400 text-sm" : ""}>{key}</span>
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

// Helper function to check if an item is completed (handles nested items)
export const isItemCompleted = (item) => {
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

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function groupByProp(items, keys) {
  const groups = items.reduce((result, item) => {
    const groupKey = keys
      .map((key) => item[key])
      .join("-")
      .replace(/\s/g, "-");
    if (!result[groupKey]) {
      result[groupKey] = keys.reduce(
        (group, key) => ({ ...group, [key]: item[key] }),
        {},
      );
      result[groupKey].data = [];
    }
    result[groupKey].data.push(item);
    return result;
  }, {});

  return Object.values(groups);
}

export const ORDER_TYPE = Object.freeze({
  SOFT_COPY: "soft-copy",
  HARD_COPY: "hard-copy",
  TEST_SERIES: "test-series",
});

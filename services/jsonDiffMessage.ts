import { updatedDiff } from "deep-object-diff";
import flatten from "flat";
import { is } from "ramda";

export function buildMessage(original, updated) {
  const flattenKeys = flatten(updatedDiff(original, updated));
  const entries = Object.entries(flattenKeys);

  return entries.map(([key, value]) => propChange(key, value)).join(" & ");
}

function propChange(key: string, value: unknown) {
  if (is(Boolean, value)) {
    const verb = value ? "enable" : "disable";
    return `${verb} ${key}`;
  }

  return `set ${key} to ${value}`;
}

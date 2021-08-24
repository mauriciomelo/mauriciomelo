import { updatedDiff } from "deep-object-diff";
import flatten from "flat";

export function buildMessage(original, updated) {
  const flattenKeys = flatten(updatedDiff(original, updated));
  const entries = Object.entries(flattenKeys);
  return entries.map(([key, value]) => `set ${key} to ${value}`).join(" & ");
}

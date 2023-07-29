// @ts-nocheck

import { head, last } from "ramda";

export interface Spec {
  subject: string;
  object: string;
}

export function parseSpec(spec: string): Spec[] {
  const rows = spec.trim().split("\n");
  return rows.map((row) => {
    const words = row.trim().split(" ");
    const subject = head(words);
    const object = last(words);
    return {
      subject,
      object,
    };
  });
}

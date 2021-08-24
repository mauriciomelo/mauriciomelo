import { buildMessage } from "./jsonDiffMessage";

it("build message based on the diff", () => {
  const original = {
    toggle: true,
  };

  const updated = {
    toggle: false,
  };

  expect(buildMessage(original, updated)).toEqual("set toggle to false");
});

it("handles deep keys", () => {
  const original = {
    toggle: {
      value: true,
    },
  };

  const updated = {
    toggle: {
      value: false,
    },
  };

  expect(buildMessage(original, updated)).toEqual("set toggle.value to false");
});

it("handles multiple keys", () => {
  const original = {
    variants: [{ ratio: 0.5 }, { ratio: 0.5 }],
  };

  const updated = {
    variants: [{ ratio: 0.4 }, { ratio: 0.6 }],
  };

  expect(buildMessage(original, updated)).toEqual(
    "set variants.0.ratio to 0.4 & set variants.1.ratio to 0.6"
  );
});

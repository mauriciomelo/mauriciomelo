import { buildMessage } from "./jsonDiffMessage";

describe("booleans", () => {
  it("writes disable if false", () => {
    const original = {
      someFlag: true,
    };

    const updated = {
      someFlag: false,
    };

    expect(buildMessage(original, updated)).toEqual("disable someFlag");
  });

  it("writes enable if true", () => {
    const original = {
      someFlag: false,
    };

    const updated = {
      someFlag: true,
    };

    expect(buildMessage(original, updated)).toEqual("enable someFlag");
  });
});

it("build message based on the diff", () => {
  const original = {
    toggle: "old",
  };

  const updated = {
    toggle: "new",
  };

  expect(buildMessage(original, updated)).toEqual("set toggle to new");
});

it("handles deep keys", () => {
  const original = {
    toggle: {
      value: true,
    },
  };

  const updated = {
    toggle: {
      value: "anna",
    },
  };

  expect(buildMessage(original, updated)).toEqual("set toggle.value to anna");
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

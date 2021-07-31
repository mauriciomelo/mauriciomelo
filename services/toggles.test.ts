import { Octokit } from "@octokit/core";
import { createToggleService, toBase64 } from "./toggles";

jest.mock("@octokit/core");

const toggles = {
  toggleName: true,
};

const requestMock = jest.fn().mockResolvedValue({
  data: { content: Buffer.from(JSON.stringify(toggles)).toString("base64") },
});

// @ts-ignore
Octokit.mockImplementation(() => ({ request: requestMock }));

const service = createToggleService("dummy-token");

describe("toggles service", () => {
  beforeEach(() => {
    requestMock.mockClear();
  });
  describe("getToggles", () => {
    it("calls github with corrent path", async () => {
      await service.getToggles("mauriciomelo/deva/config/toggles.json");
      expect(requestMock).toHaveBeenCalledWith(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner: "mauriciomelo",
          repo: "deva",
          path: "config/toggles.json",
        }
      );
    });

    it("parses the file", async () => {
      const toggles = {
        enableSomething: true,
      };

      requestMock.mockResolvedValue({
        data: {
          content: Buffer.from(JSON.stringify(toggles)).toString("base64"),
        },
      });

      const file = await service.getToggles(
        "mauriciomelo/deva/config/toggles.json"
      );
      expect(file).toEqual({
        toggles,
      });
    });
  });

  describe("updateToggles", () => {
    it("calls github with corrent path", async () => {
      const toggles = {
        enableSomething: false,
      };
      await service.updateToggles(
        "org/repo/config/toggles.json",
        "sha",
        toggles
      );
      expect(requestMock).toHaveBeenCalledWith(
        "PUT /repos/{owner}/{repo}/contents/{path}",
        {
          owner: "org",
          sha: "sha",
          repo: "repo",
          path: "config/toggles.json",
          message: "chore: update toggle",
          content: toBase64(toggles),
        }
      );
    });

    it("returns new file sha", async () => {
      const toggles = {
        enableSomething: false,
      };
      const sha = "new-file-sha";
      requestMock.mockResolvedValue({
        data: {
          content: { sha },
        },
      });

      const result = await service.updateToggles(
        "org/repo/config/toggles.json",
        "sha",
        toggles
      );
      expect(result.sha).toEqual(sha);
    });
  });
});

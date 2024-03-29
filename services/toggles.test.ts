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
      await service.getToggles({
        path: "mauriciomelo/deva/config/toggles.json",
      });
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

      const file = await service.getToggles({
        path: "mauriciomelo/deva/config/toggles.json",
      });
      expect(file).toEqual({
        toggles,
      });
    });

    it("does not parse the file if parseJson is false", async () => {
      const data = `
      # Doc
      
      some plain text markdown
      `;

      requestMock.mockResolvedValue({
        data: {
          content: Buffer.from(data).toString("base64"),
        },
      });

      const file = await service.getToggles({
        path: "mauriciomelo/deva/config/toggles.json",
        parseJson: false,
      });
      expect(file).toEqual({
        toggles: data,
      });
    });
  });

  describe("updateToggles", () => {
    it("calls github with corrent path", async () => {
      const toggles = {
        enableSomething: false,
      };
      const message = "update toggle";
      const path = "org/repo/config/toggles.json";
      const sha = "sha";
      await service.updateToggles({ path, sha, toggles, message });
      expect(requestMock).toHaveBeenCalledWith(
        "PUT /repos/{owner}/{repo}/contents/{path}",
        {
          owner: "org",
          sha: "sha",
          repo: "repo",
          path: "config/toggles.json",
          message,
          content: toBase64(toggles),
        }
      );
    });

    it("formats JSON", async () => {
      const toggles = {
        toggle: false,
      };
      const expectedString = '{\n  "toggle": false\n}';

      const message = "update toggle";
      const path = "org/repo/config/toggles.json";
      const sha = "sha";
      await service.updateToggles({ path, sha, toggles, message });
      expect(requestMock).toHaveBeenCalledWith(
        "PUT /repos/{owner}/{repo}/contents/{path}",
        expect.objectContaining({
          content: Buffer.from(expectedString).toString("base64"),
        })
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

      const path = "org/repo/config/toggles.json";
      const result = await service.updateToggles({
        path,
        sha,
        toggles,
        message: "message",
      });
      expect(result.sha).toEqual(sha);
    });
  });
});

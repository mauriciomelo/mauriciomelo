import { Octokit } from "@octokit/core";

export function createToggleService(token: string) {
  const octokit = new Octokit({
    auth: token,
  });

  return {
    async getToggles({ path, parseJson = true }) {
      const { data } = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        parseFileUri(path)
      );

      if (!("content" in data)) {
        return;
      }

      const buff = fromBase64(data.content);
      const content = buff.toString("ascii");
      const toggles = parseJson ? JSON.parse(content) : content;

      return { toggles, sha: data.sha };
    },

    async updateToggles({ path, sha, toggles, message }) {
      const octokit = new Octokit({
        auth: token,
      });

      const content = toBase64(toggles);
      const { data } = await octokit.request(
        "PUT /repos/{owner}/{repo}/contents/{path}",
        {
          ...parseFileUri(path),
          message,
          sha,
          content,
        }
      );
      const response = {
        sha: data.content?.sha,
      };

      return response;
    },
  };
}

function fromBase64(data) {
  return Buffer.from(data, "base64");
}

export function toBase64(toggles: any) {
  return Buffer.from(JSON.stringify(toggles, null, 2)).toString("base64");
}

function parseFileUri(uri: string) {
  const [owner, repo, ...rest] = uri.split("/");
  const path = rest.join("/");

  return {
    owner,
    repo,
    path,
  };
}

import { Octokit } from "@octokit/core";

export function createToggleService(token: string) {
  const octokit = new Octokit({
    auth: token,
  });

  return {
    async getToggles(path) {
      const { data } = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        parseFileUri(path)
      );

      if (!("content" in data)) {
        return;
      }

      const buff = fromBase64(data.content);
      const packageJSON = buff.toString("ascii");
      const toggles = JSON.parse(packageJSON);

      return { toggles, sha: data.sha };
    },

    async updateToggles(path, sha, toggles) {
      const octokit = new Octokit({
        auth: token,
      });

      const content = toBase64(toggles);
      const { data } = await octokit.request(
        "PUT /repos/{owner}/{repo}/contents/{path}",
        {
          ...parseFileUri(path),
          message: "chore: update toggle",
          sha,
          content,
        }
      );
      const response = {
        sha: data.content.sha,
      };

      return response;
    },
  };
}

function fromBase64(data) {
  return Buffer.from(data, "base64");
}

export function toBase64(toggles: any) {
  return Buffer.from(JSON.stringify(toggles)).toString("base64");
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

import Fastify from "fastify";
import { NodeHtmlMarkdown } from "node-html-markdown";
import fs, { readFile } from "fs/promises";
import { Octokit } from "octokit";
import path from "path";
import { globby } from "globby";
import { fileURLToPath } from "url";
import { dirname } from "path";

const octokit = new Octokit({
  auth: `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`,
});

// Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async function handler(request, reply) {
  return { hello: "world" };
});

type PublishRequestBody = {
  content: string;
};

const getCurrentCommit = async (
  octo: any,
  org: any,
  repo: any,
  branch: any
) => {
  const { data: refData } = await octo.rest.git.getRef({
    owner: org,
    repo,
    ref: `heads/${branch}`,
  });
  const commitSha = refData.object.sha;
  const { data: commitData } = await octo.rest.git.getCommit({
    owner: org,
    repo,
    commit_sha: commitSha,
  });
  return {
    commitSha,
    treeSha: commitData.tree.sha,
  };
};

const getFileAsUTF8 = (filePath: any) => readFile(filePath, "utf8");

const createBlobForFile =
  (octo: any, org: any, repo: any) => async (filePath: any) => {
    const content = await getFileAsUTF8(filePath);
    const blobData = await octo.rest.git.createBlob({
      owner: org,
      repo,
      content,
      encoding: "utf-8",
    });
    return blobData.data;
  };

const createNewTree = async (
  octo: any,
  owner: any,
  repo: any,
  blobs: any,
  paths: any,
  parentTreeSha: any
) => {
  // My custom config. Could be taken as parameters
  const tree = blobs.map(({ sha }: any, index: any) => ({
    path: paths[index],
    mode: `100644`,
    type: `blob`,
    sha,
  }));
  const { data } = await octo.rest.git.createTree({
    owner,
    repo,
    tree,
    base_tree: parentTreeSha,
  });
  return data;
};

const createNewCommit = async (
  octo: any,
  org: any,
  repo: any,
  message: any,
  currentTreeSha: any,
  currentCommitSha: any
) =>
  (
    await octo.rest.git.createCommit({
      owner: org,
      repo,
      message,
      tree: currentTreeSha,
      parents: [currentCommitSha],
    })
  ).data;

const setBranchToCommit = (
  octo: any,
  org: any,
  repo: any,
  branch: any,
  commitSha: any
) =>
  octo.rest.git.updateRef({
    owner: org,
    repo,
    ref: `heads/${branch}`,
    sha: commitSha,
  });

const uploadToRepo = async (
  octo: any,
  coursePath: any,
  repo: any,
  branch: any
) => {
  const currentCommit = await getCurrentCommit(octo, "delawere", repo, branch);
  const filesPaths = await globby(coursePath);
  const filesBlobs = await Promise.all(
    filesPaths.map(createBlobForFile(octo, "delawere", repo))
  );
  const pathsForBlobs = filesPaths.map((fullPath: any) =>
    path.relative(coursePath, fullPath)
  );
  const newTree = await createNewTree(
    octo,
    "delawere",
    repo,
    filesBlobs,
    pathsForBlobs,
    currentCommit.treeSha
  );
  const newCommit = await createNewCommit(
    octo,
    "delawere",
    repo,
    "test",
    newTree.sha,
    currentCommit.commitSha
  );
  await setBranchToCommit(octo, "delawere", repo, branch, newCommit.sha);
};

fastify.post<{ Body: PublishRequestBody; Reply: any }>(
  "/publish",
  async function handler(request, reply) {
    const content = request.body?.content || "";

    if (content) {
      const md = NodeHtmlMarkdown.translate(content);

      const repo = await octokit.rest.repos.get({
        owner: "delawere",
        repo: "photography_blog",
      });

      const REPO = "photography_blog";
      const BRANCH = "main";
      const COMMIT_MESSAGE = "Auto generated";

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);

      console.log("dirname: " + __dirname);

      const workspacePath = path.join(__dirname);
      await uploadToRepo(octokit, workspacePath, REPO, BRANCH);

      try {
        await fs.writeFile("./test.md", md);
      } catch (err) {
        console.log(err);
      }
    }
  }
);

const run = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

run();

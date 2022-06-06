export const githubApi = {
  getReadMe: (repoName: string) =>
    `https://raw.githubusercontent.com/${repoName}/master/README.md`,
};

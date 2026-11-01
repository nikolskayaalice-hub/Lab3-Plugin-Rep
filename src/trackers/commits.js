const vscode = require('vscode');

async function registerCommitTracker(context, achievements) {
  const gitExtension = vscode.extensions.getExtension('vscode.git');
  if (!gitExtension) return;

  const git = (await gitExtension.activate()).getAPI(1);
  const tracked = new Set();

  const track = (repository) => {
    if (tracked.has(repository)) return;
    tracked.add(repository);
    context.subscriptions.push(repository.onDidCommit(() => achievements.increment('commits')));
  };

  git.repositories.forEach(track);
  context.subscriptions.push(git.onDidOpenRepository(track));
}

module.exports = { registerCommitTracker };
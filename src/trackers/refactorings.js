const vscode = require('vscode');

function registerRefactoringTracker(context, achievements) {
  context.subscriptions.push(
    vscode.workspace.onDidRenameFiles(() => achievements.increment('refactorings')),

    vscode.commands.registerCommand('codevibe.renameSymbol', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const versionBefore = editor.document.version;
      await vscode.commands.executeCommand('editor.action.rename');

      if (editor.document.version !== versionBefore) {
        achievements.increment('refactorings');
      }
    })
  );
}

module.exports = { registerRefactoringTracker };
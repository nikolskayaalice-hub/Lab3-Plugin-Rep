const vscode = require('vscode');

function registerContextAction(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('codevibe.contextAction', () => {
      vscode.commands.executeCommand('codevibe.showAchievements');
    })
  );
}

module.exports = { registerContextAction };
const vscode = require('vscode');

const AUTHOR_NAME = 'Егор';

function registerHello(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('codevibe.helloWorld', () => {
      vscode.window.showInformationMessage(`Hello, World! ${AUTHOR_NAME}`);
    })
  );

  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  item.text = '$(smiley) Hello World';
  item.command = 'codevibe.helloWorld';
  item.show();
  context.subscriptions.push(item);
}

module.exports = { registerHello };

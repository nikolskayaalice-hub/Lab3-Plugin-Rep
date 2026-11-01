const vscode = require('vscode');

const STORAGE_KEY = 'codevibe.codeTimer';

function today() {
  return new Date().toDateString();
}

function formatTime(totalSeconds) {
  const pad = (n) => String(n).padStart(2, '0');
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function registerCodeTimer(context) {
  const saved = context.globalState.get(STORAGE_KEY);
  let currentDate = today();
  let seconds = saved && saved.date === currentDate ? saved.seconds : 0;

  const save = () =>
    context.globalState.update(STORAGE_KEY, { date: currentDate, seconds });

  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  item.command = 'codevibe.resetTimer';
  item.tooltip = 'Время работы за сегодня. Клик — сбросить';

  const render = () => {
    item.text = `$(clock) ${formatTime(seconds)}`;
  };
  render();
  item.show();

  const interval = setInterval(() => {
    if (today() !== currentDate) {
      currentDate = today();
      seconds = 0;
    }
    seconds++;
    render();
    if (seconds % 5 === 0) save();
  }, 1000);

  const resetCommand = vscode.commands.registerCommand(
    'codevibe.resetTimer',
    () => {
      seconds = 0;
      render();
      save();
      vscode.window.showInformationMessage('Таймер сброшен');
    }
  );

  context.subscriptions.push(item, resetCommand, {
    dispose: () => {
      clearInterval(interval);
      save();
    },
  });
}

module.exports = { registerCodeTimer };
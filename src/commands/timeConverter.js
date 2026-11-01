const vscode = require('vscode');

const UNITS = [
  { seconds: 3600, forms: ['час', 'часа', 'часов'], pattern: /(\d+)\s*час[а-я]*/i },
  { seconds: 60, forms: ['минута', 'минуты', 'минут'], pattern: /(\d+)\s*мин[а-я]*/i },
  { seconds: 1, forms: ['секунда', 'секунды', 'секунд'], pattern: /(\d+)\s*сек[а-я]*/i },
];

function plural(n, [one, few, many]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** 3600 -> "1 час", 3725 -> "1 час 2 минуты 5 секунд" */
function secondsToText(total) {
  if (total === 0) return '0 секунд';
  const parts = [];
  let rest = Math.floor(total);
  for (const unit of UNITS) {
    const count = Math.floor(rest / unit.seconds);
    rest %= unit.seconds;
    if (count > 0) parts.push(`${count} ${plural(count, unit.forms)}`);
  }
  return parts.join(' ');
}

/** "1 час 2 минуты" -> 3720, если фраза не распознана — null */
function textToSeconds(text) {
  let total = 0;
  let found = false;
  for (const unit of UNITS) {
    const match = text.match(unit.pattern);
    if (match) {
      total += Number(match[1]) * unit.seconds;
      found = true;
    }
  }
  return found ? total : null;
}

function convert(text) {
  const trimmed = text.trim();
  if (/^\d+$/.test(trimmed)) return secondsToText(Number(trimmed));
  const seconds = textToSeconds(trimmed);
  return seconds === null ? null : String(seconds);
}

function registerTimeConverter(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('codevibe.convertTime', async () => {
      const editor = vscode.window.activeTextEditor;
      const hasSelection = editor && !editor.selection.isEmpty;
      const input = hasSelection
        ? editor.document.getText(editor.selection)
        : await vscode.window.showInputBox({ prompt: 'Секунды (3600) или фраза (1 час 5 минут)' });

      if (input === undefined) return;

      const result = convert(input);
      if (result === null) {
        vscode.window.showErrorMessage(`Не получилось распознать "${input}"`);
        return;
      }

      if (hasSelection) {
        await editor.edit((b) => b.replace(editor.selection, result));
      } else {
        vscode.window.showInformationMessage(`${input} = ${result}`);
      }
    })
  );
}

module.exports = { registerTimeConverter, secondsToText, textToSeconds };

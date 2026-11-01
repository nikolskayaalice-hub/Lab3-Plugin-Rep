const vscode = require('vscode');

const JOKE_URL = 'https://v2.jokeapi.dev/joke/Programming?safe-mode';


async function fetchJoke() {
  const response = await fetch(JOKE_URL, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
   const data = await response.json();
  if (data.error) throw new Error(data.message || 'API вернул ошибку');

  return data.type === 'twopart' ? `${data.setup}\n\n${data.delivery}` : data.joke;
}

function registerJoke(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('codevibe.joke', async () => {
      let again;
      do {
        try {
          const joke = await fetchJoke();
          again = await vscode.window.showInformationMessage(`😄 ${joke}`, { modal: true }, 'Ещё одну');
        } catch (err) {
          vscode.window.showErrorMessage(`Не удалось получить шутку: ${err.message}`);
          return;
        }
      } while (again);
    })
  );
}

module.exports = { registerJoke };
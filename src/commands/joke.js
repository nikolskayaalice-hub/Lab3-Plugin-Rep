const vscode = require('vscode');

const JOKE_URL = 'https://v2.jokeapi.dev/joke/Programming?safe-mode';


async function fetchJoke() {
  const response = await fetch(JOKE_URL, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const data = await response.json();
  return data.joke;
}
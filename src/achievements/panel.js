const vscode = require('vscode');

function renderCards(achievements, emptyText) {
  if (achievements.length === 0) return `<p class="empty">${emptyText}</p>`;
  return achievements
    .map((a) => {
      const percent = Math.round((a.progress / a.goal) * 100);
      return `
        <div class="card ${a.unlocked ? 'done' : ''}">
          <div class="badge">${a.unlocked ? '🏆' : '🔒'}</div>
          <div class="info">
            <h3>${a.title}</h3>
            <progress value="${a.progress}" max="${a.goal}"></progress>
            <small>${a.progress} / ${a.goal} (${percent}%)</small>
          </div>
        </div>`;
    })
    .join('');
}

function render(achievements) {
  const done = achievements.filter((a) => a.unlocked);
  const pending = achievements.filter((a) => !a.unlocked);

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
  body { font-family: var(--vscode-font-family); padding: 16px; }
  .card { display: flex; gap: 16px; align-items: center; padding: 12px; margin-bottom: 12px;
          border: 1px solid var(--vscode-panel-border); border-radius: 8px; opacity: .6; }
  .card.done { opacity: 1; }
  .badge { font-size: 32px; }
  progress { width: 220px; display: block; margin: 6px 0; }
  .empty { opacity: .6; }
</style></head><body>
  <h2>Достижения</h2>
  <h3>Выполненные (${done.length})</h3>
  ${renderCards(done, 'Пока ничего не получено — всё впереди!')}
  <h3>В процессе (${pending.length})</h3>
  ${renderCards(pending, 'Все достижения получены 🎉')}
</body></html>`;
}

function registerAchievementsPanel(context, achievements) {
  let panel;

  const update = () => {
    if (panel) panel.webview.html = render(achievements.getAll());
  };

  context.subscriptions.push(
    achievements.onUnlocked(update),
    vscode.commands.registerCommand('codevibe.showAchievements', () => {
      if (panel) {
        panel.reveal();
      } else {
        panel = vscode.window.createWebviewPanel('codevibeAchievements', 'CodeVibe: Достижения', vscode.ViewColumn.Beside, {});
        panel.onDidDispose(() => (panel = undefined));
      }
      update();
    })
  );
}

module.exports = { registerAchievementsPanel };

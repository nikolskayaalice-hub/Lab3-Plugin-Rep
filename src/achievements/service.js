const vscode = require('vscode');

const DEFINITIONS = [
  { id: 'commits-1', type: 'commits', title: 'Первый коммит', goal: 1 },
  { id: 'commits-10', type: 'commits', title: '10 коммитов', goal: 10 },
  { id: 'commits-100', type: 'commits', title: '100 коммитов', goal: 100 },
  { id: 'refactorings-1', type: 'refactorings', title: 'Первый рефакторинг', goal: 1 },
  { id: 'refactorings-3', type: 'refactorings', title: '3 рефакторинга', goal: 3 },
  { id: 'refactorings-10', type: 'refactorings', title: '10 рефакторингов', goal: 10 },
];

const STORAGE_KEY = 'codevibe.progress';

class AchievementService {
  constructor(context) {
    this.context = context;
    this._emitter = new vscode.EventEmitter();
    this.onUnlocked = this._emitter.event;
    context.subscriptions.push(this._emitter);
  }

  _progress() {
    return this.context.globalState.get(STORAGE_KEY, {});
  }

  /** type: 'commits' | 'refactorings' */
  async increment(type, by = 1) {
    const progress = this._progress();
    const before = progress[type] || 0;
    const after = before + by;
    progress[type] = after;
    await this.context.globalState.update(STORAGE_KEY, progress);

    for (const a of DEFINITIONS) {
      if (a.type === type && before < a.goal && after >= a.goal) {
        this._emitter.fire(a);
        vscode.window.showInformationMessage(`🏆 Новая ачивка: ${a.title}!`);
      }
    }
  }

  /** [{id, title, goal, progress, unlocked}] */
  getAll() {
    const progress = this._progress();
    return DEFINITIONS.map((a) => {
      const value = progress[a.type] || 0;
      return { ...a, progress: Math.min(value, a.goal), unlocked: value >= a.goal };
    });
  }
}

module.exports = { AchievementService };

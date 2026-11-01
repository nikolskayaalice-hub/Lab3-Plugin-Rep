const vscode = require('vscode');
const { AchievementService } = require('./src/achievements/service');
const { registerAchievementsPanel } = require('./src/achievements/panel');
const { registerHello } = require('./src/commands/hello');
const { registerTimeConverter } = require('./src/commands/timeConverter');
const { registerJoke } = require('./src/commands/joke');
const { registerCommitTracker } = require('./src/trackers/commits');

function activate(context) {
  const achievements = new AchievementService(context);

  // Егор
  registerHello(context);
  registerTimeConverter(context);
  registerAchievementsPanel(context, achievements);

  // Артём
  registerJoke(context);
  registerCommitTracker(context, achievements);
}

function deactivate() {}

module.exports = { activate, deactivate };
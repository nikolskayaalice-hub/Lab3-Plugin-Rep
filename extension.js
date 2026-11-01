const vscode = require('vscode');
const { registerContextAction } = require('./src/commands/contextAction');
const { registerCodeTimer } = require('./src/commands/codeTimer');
const { AchievementService } = require('./src/achievements/service');
const { registerAchievementsPanel } = require('./src/achievements/panel');
const { registerHello } = require('./src/commands/hello');
const { registerTimeConverter } = require('./src/commands/timeConverter');
const { registerJoke } = require('./src/commands/joke');
const { registerCommitTracker } = require('./src/trackers/commits');

function activate(context) {
  const achievements = new AchievementService(context);

  // Егор
  registerCodeTimer(context);
  registerHello(context);
  registerTimeConverter(context);
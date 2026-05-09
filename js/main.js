/* 三国消除战记 v2.0 - 启动入口 */
window.Game = window.Game || {};

Game.init = function() {
    // 初始化数据
    Game.state.level = 1;
    Game.state.playerHp = Game.config.PLAYER_MAX_HP;
    Game.state.maxPlayerHp = Game.config.PLAYER_MAX_HP;
    Game.state.maxEnemyHp = Game.config.ENEMY_BASE_HP;
    Game.state.enemyHp = Game.config.ENEMY_BASE_HP;
    Game.state.enemyAttack = Game.config.ENEMY_BASE_ATTACK;
    Game.state.enemyName = Game.ENEMIES[0].name;
    Game.state.phase = Game.PHASE.IDLE;

    Game.resetTurn();
    Game.match.initGrid();
    Game.ui.updateUI();
    Game.ui.showBattleLog('第 1 关 - ' + Game.state.enemyName);
};

window.addEventListener('DOMContentLoaded', () => {
    try {
        Game.init();
    } catch (e) {
        console.error('[Game.init] 初始化失败：', e);
        alert('游戏初始化失败：' + e.message);
    }
});

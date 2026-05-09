/* 涓夊浗娑堥櫎鎴樿 v2.0 - 鍚姩鍏ュ彛 */
window.Game = window.Game || {};

Game.init = function() {
    // 鍒濆鍖栨暟鎹?    Game.state.level = 1;
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
    Game.ui.showBattleLog('绗?1 鍏?- ' + Game.state.enemyName);
};

window.addEventListener('DOMContentLoaded', () => {
    try {
        Game.init();
    } catch (e) {
        console.error('[Game.init] 鍒濆鍖栧け璐ワ細', e);
        alert('娓告垙鍒濆鍖栧け璐ワ細' + e.message);
    }
});

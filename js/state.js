/* 三国消除战记 v2.0 - 状态管理 */
window.Game = window.Game || {};

/* 游戏阶段枚举 */
Game.PHASE = {
    IDLE: 'IDLE',             // 等待玩家输入
    RESOLVING: 'RESOLVING',   // 消除 / 下落 / 连锁进行中
    SKILL: 'SKILL',           // 三武将技能连发中
    BATTLE: 'BATTLE',         // 战斗结算中（攻击 / 敌人反击）
    OVER: 'OVER'              // 游戏结束
};

Game.state = {
    /* 战斗 */
    level: 1,
    playerHp: 100,
    maxPlayerHp: 100,
    enemyHp: 100,
    maxEnemyHp: 100,
    enemyAttack: 5,
    enemyName: '黄巾杂兵',

    /* 网格 */
    grid: [],                 // 长度 96，每格存颜色索引（-1 表示空）
    selectedCell: null,

    /* 回合数据 */
    phase: 'IDLE',
    combo: 0,                 // 连锁次数（第1次=1，第2次=2...）
    perMatchGreens: [],       // 每轮匹配的绿色宝石数
    perMatchReds: [],         // 每轮匹配的红色宝石数
    totalGreenThisTurn: 0,    // 本回合累计绿色数（用于触发技能）
    totalRedThisTurn: 0,      // 本回合累计红色数（用于显示治疗）
    skillTriggered: false     // 本回合是否已触发过技能
};

/* 重置回合数据（敌人反击后调用） */
Game.resetTurn = function() {
    Game.state.combo = 0;
    Game.state.perMatchGreens = [];
    Game.state.perMatchReds = [];
    Game.state.totalGreenThisTurn = 0;
    Game.state.totalRedThisTurn = 0;
    Game.state.skillTriggered = false;
};

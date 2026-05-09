/* 涓夊浗娑堥櫎鎴樿 v2.0 - 鐘舵€佺鐞?*/
window.Game = window.Game || {};

/* 娓告垙闃舵鏋氫妇 */
Game.PHASE = {
    IDLE: 'IDLE',             // 绛夊緟鐜╁杈撳叆
    RESOLVING: 'RESOLVING',   // 娑堥櫎 / 涓嬭惤 / 杩為攣杩涜涓?    SKILL: 'SKILL',           // 涓夋灏嗘妧鑳借繛鍙戜腑
    BATTLE: 'BATTLE',         // 鎴樻枟缁撶畻涓紙鏀诲嚮 / 鏁屼汉鍙嶅嚮锛?    OVER: 'OVER'              // 娓告垙缁撴潫
};

Game.state = {
    /* 鎴樻枟 */
    level: 1,
    playerHp: 100,
    maxPlayerHp: 100,
    enemyHp: 100,
    maxEnemyHp: 100,
    enemyAttack: 5,
    enemyName: '榛勫肪鏉傚叺',

    /* 缃戞牸 */
    grid: [],                 // 闀垮害 96锛屾瘡鏍煎瓨棰滆壊绱㈠紩锛?1 琛ㄧず绌猴級
    selectedCell: null,

    /* 鍥炲悎鏁版嵁 */
    phase: 'IDLE',
    combo: 0,                 // 杩為攣娆℃暟锛堢1娆?1锛岀2娆?2...锛?    perMatchGreens: [],       // 姣忚疆鍖归厤鐨勭豢鑹插疂鐭虫暟
    perMatchReds: [],         // 姣忚疆鍖归厤鐨勭孩鑹插疂鐭虫暟
    totalGreenThisTurn: 0,    // 鏈洖鍚堢疮璁＄豢鑹叉暟锛堢敤浜庤Е鍙戞妧鑳斤級
    totalRedThisTurn: 0,      // 鏈洖鍚堢疮璁＄孩鑹叉暟锛堢敤浜庢樉绀烘不鐤楋級
    skillTriggered: false     // 鏈洖鍚堟槸鍚﹀凡瑙﹀彂杩囨妧鑳?};

/* 閲嶇疆鍥炲悎鏁版嵁锛堟晫浜哄弽鍑诲悗璋冪敤锛?*/
Game.resetTurn = function() {
    Game.state.combo = 0;
    Game.state.perMatchGreens = [];
    Game.state.perMatchReds = [];
    Game.state.totalGreenThisTurn = 0;
    Game.state.totalRedThisTurn = 0;
    Game.state.skillTriggered = false;
};

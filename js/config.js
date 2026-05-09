/* 三国消除战记 v2.0 - 配置 */
window.Game = window.Game || {};

Game.config = {
    /* 网格配置 */
    GRID_ROWS: 12,
    GRID_COLS: 8,
    TOTAL_CELLS: 96,

    /* 颜色（索引 0-3）
     * 0 = red    红色 → 治疗
     * 1 = yellow 黄色 → 无作用
     * 2 = green  绿色 → 攻击
     * 3 = blue   蓝色 → 无作用
     */
    COLORS: ['red', 'yellow', 'green', 'blue'],
    COLOR_COUNT: 4,
    COLOR_RED: 0,
    COLOR_YELLOW: 1,
    COLOR_GREEN: 2,
    COLOR_BLUE: 3,

    /* 玩法参数 */
    GREEN_SKILL_THRESHOLD: 5,        // 累计 5 个绿色 → 触发三武将连发
    LIUBEI_GREEN_SPAWN: 10,          // 刘备仁德天下：变 10 个绿色方块
    PLAYER_MAX_HP: 100,
    ENEMY_BASE_HP: 100,
    ENEMY_HP_GROWTH: 50,             // 每关敌人最大血量增长
    ENEMY_BASE_ATTACK: 5,
    ENEMY_ATTACK_GROWTH: 3,          // 每关敌人攻击力增长

    /* 动画时间（ms） */
    ANIM: {
        SWAP: 250,
        REMOVE: 350,
        FALL: 280,
        SKILL_CAST: 1500,            // 单个武将技能释放时长
        LOG: 1400,
        DAMAGE_TEXT: 1200
    }
};

/* 10关敌人配置（10位女性三国人物） */
Game.ENEMIES = [
    { name: '黄月英' },
    { name: '张星彩' },
    { name: '关银屏' },
    { name: '甄姬' },
    { name: '张春华' },
    { name: '小乔' },
    { name: '大乔' },
    { name: '孙尚香' },
    { name: '祝融夫人' },
    { name: '貂蝉' }
];

/* 三武将配置 */
Game.HEROES = {
    LIUBEI:  { name: '刘备', skill: '仁德天下', desc: '随机将 10 个方块变为绿色' },
    GUANYU:  { name: '关羽', skill: '水淹七军', desc: '随机消除一行' },
    ZHANGFEI:{ name: '张飞', skill: '大喝断桥', desc: '随机消除一列' }
};

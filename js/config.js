/* 三国消除战记 v2.1 - 配置 */
window.Game = window.Game || {};

Game.config = {
    /* 网格配置 */
    GRID_ROWS: 12,
    GRID_COLS: 9,
    TOTAL_CELLS: 108,

    /* 颜色（索引 0-3）*/
    COLORS: ["red", "yellow", "green", "blue"],
    COLOR_COUNT: 4,
    COLOR_RED: 0,
    COLOR_YELLOW: 1,
    COLOR_GREEN: 2,
    COLOR_BLUE: 3,

    /* 玩法参数 */
    GREEN_SKILL_THRESHOLD: 5,        // 累计 5 个绿色 → 触发三武将连发
    LIUBEI_GREEN_SPAWN: 10,          // 刘备仁德天下：变 10 个绿色方块
    ZHAOYUN_RANDOM_REMOVE: 7,        // 赵云七进七出：随机消除 7 个非绿色方块
    ZHUGELIANG_AREA_SIZE: 3,        // 诸葛亮卧龙出山：3x3 区域
    PLAYER_MAX_HP: 100,
    ENEMY_BASE_HP: 100,
    ENEMY_HP_GROWTH: 50,           // 每关敌人最大血量增长
    ENEMY_BASE_ATTACK: 5,
    ENEMY_ATTACK_GROWTH: 3,        // 每关敌人攻击力增长

    /* 动画时间（ms）*/
    ANIM: {
        SWAP: 250,
        REMOVE: 350,
        FALL: 280,
        SKILL_CAST: 1500,           // 单个武将技能释放时长
        LOG: 1400,
        DAMAGE_TEXT: 1200
    }
};

/* 10关敌人配置（10位女性三国人物） */
Game.ENEMIES = [
    { name: "黄月英" },
    { name: "张星彩" },
    { name: "关银屏" },
    { name: "甄姬" },
    { name: "张春华" },
    { name: "小乔" },
    { name: "大乔" },
    { name: "孙尚香" },
    { name: "祝融夫人" },
    { name: "貂蝉" }
];

/* 三武将配置 */
Game.HEROES = {
    LIUBEI:   { name: "刘备",   skill: "仁德天下", desc: "随机将 10 个方块变为绿色" },
    ZHAOYUN:  { name: "赵云",   skill: "七进七出", desc: "随机消除 7 个非绿色方块" },
    ZHUGELIANG: { name: "诸葛亮", skill: "卧龙出山", desc: "随机消除 3×3 区域" }
};

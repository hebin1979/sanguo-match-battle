/* 涓夊浗娑堥櫎鎴樿 v2.0 - 閰嶇疆 */
window.Game = window.Game || {};

Game.config = {
    /* 缃戞牸閰嶇疆 */
    GRID_ROWS: 12,
    GRID_COLS: 9,
    TOTAL_CELLS: 108,

    /* 棰滆壊锛堢储寮?0-3锛?     * 0 = red    绾㈣壊 鈫?娌荤枟
     * 1 = yellow 榛勮壊 鈫?鏃犱綔鐢?     * 2 = green  缁胯壊 鈫?鏀诲嚮
     * 3 = blue   钃濊壊 鈫?鏃犱綔鐢?     */
    COLORS: ['red', 'yellow', 'green', 'blue'],
    COLOR_COUNT: 4,
    COLOR_RED: 0,
    COLOR_YELLOW: 1,
    COLOR_GREEN: 2,
    COLOR_BLUE: 3,

    /* 鐜╂硶鍙傛暟 */
    GREEN_SKILL_THRESHOLD: 5,        // 绱 5 涓豢鑹?鈫?瑙﹀彂涓夋灏嗚繛鍙?    LIUBEI_GREEN_SPAWN: 10,          // 鍒樺浠佸痉澶╀笅锛氬彉 10 涓豢鑹叉柟鍧?    ZHAOYUN_RANDOM_REMOVE: 7,        // 璧典簯涓冭繘涓冨嚭锛氶殢鏈烘秷闄?7 涓潪缁胯壊鏂瑰潡
    ZHUGELIANG_AREA_SIZE: 3,          // 璇歌憶浜崸榫欏嚭灞憋細3x3 鍖哄煙
    PLAYER_MAX_HP: 100,
    ENEMY_BASE_HP: 100,
    ENEMY_HP_GROWTH: 50,             // 姣忓叧鏁屼汉鏈€澶ц閲忓闀?    ENEMY_BASE_ATTACK: 5,
    ENEMY_ATTACK_GROWTH: 3,          // 姣忓叧鏁屼汉鏀诲嚮鍔涘闀?
    /* 鍔ㄧ敾鏃堕棿锛坢s锛?*/
    ANIM: {
        SWAP: 250,
        REMOVE: 350,
        FALL: 280,
        SKILL_CAST: 1500,            // 鍗曚釜姝﹀皢鎶€鑳介噴鏀炬椂闀?        LOG: 1400,
        DAMAGE_TEXT: 1200
    }
};

/* 10鍏虫晫浜洪厤缃紙10浣嶅コ鎬т笁鍥戒汉鐗╋級 */
Game.ENEMIES = [
    { name: '榛勬湀鑻? },
    { name: '寮犳槦褰? },
    { name: '鍏抽摱灞? },
    { name: '鐢勫К' },
    { name: '寮犳槬鍗? },
    { name: '灏忎箶' },
    { name: '澶т箶' },
    { name: '瀛欏皻棣? },
    { name: '绁濊瀺澶汉' },
    { name: '璨傝潐' }
];

/* 涓夋灏嗛厤缃?*/
Game.HEROES = {
    LIUBEI:   { name: '鍒樺', skill: '浠佸痉澶╀笅', desc: '闅忔満灏?10 涓柟鍧楀彉涓虹豢鑹? },
    ZHAOYUN:  { name: '璧典簯', skill: '涓冭繘涓冨嚭', desc: '闅忔満娑堥櫎 7 涓潪缁胯壊鏂瑰潡' },
    ZHUGELIANG:{ name: '璇歌憶浜?, skill: '鍗ч緳鍑哄北', desc: '闅忔満娑堥櫎 3脳3 鍖哄煙' }
};

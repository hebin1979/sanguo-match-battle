/* 涓夊浗娑堥櫎鎴樿 v2.0 - 鎴樻枟绯荤粺
 * 鏍稿績娴佺▼锛? *   resolveTurn锛堝洖鍚堢粨绠楋級鈫?鏀诲嚮鏁屼汉 鈫?鏁屼汉鍙嶅嚮 鈫?涓嬩竴鍏虫垨缁х画
 *   triggerSkillSequence锛氬垬澶?鈫?璧典簯 鈫?璇歌憶浜?涓変汉杩炲彂
 * 鎵€鏈夊紓姝ュ姩浣滅敤 async/await 涓茶仈
 */
window.Game = window.Game || {};
Game.battle = {};

/* ========== 鍥炲悎缁撶畻 ========== */
Game.battle.resolveTurn = async function() {
    Game.state.phase = Game.PHASE.BATTLE;

    // 璁＄畻鎬讳激瀹筹細姣忚疆鍖归厤鐨勭豢鑹插疂鐭虫暟 脳 璇ヨ疆 combo 鍊嶇巼
    // perMatchGreens[0] 鏄1杞尮閰?鈫?鍊嶇巼 1x
    // perMatchGreens[1] 鏄2杞尮閰?鈫?鍊嶇巼 2x
    let totalDamage = 0;
    Game.state.perMatchGreens.forEach((greens, i) => {
        totalDamage += greens * (i + 1);
    });

    if (totalDamage > 0) {
        await Game.battle.attackEnemy(totalDamage);
    } else {
        Game.ui.showBattleLog('鏈舰鎴愭敾鍑?..');
        await Game.match.sleep(900);
    }

    // 鏁屼汉鑻ュ凡姝伙紝杩涘叆涓嬩竴鍏?    if (Game.state.enemyHp <= 0) {
        await Game.battle.nextLevel();
        return;
    }

    // 鏁屼汉鍙嶅嚮
    await Game.battle.enemyAttack();

    // 鐜╁鑻ュ凡姝伙紝娓告垙缁撴潫
    if (Game.state.playerHp <= 0) {
        await Game.battle.gameOver();
        return;
    }

    // 閲嶇疆鍥炲悎鏁版嵁锛屽洖鍒扮瓑寰呰緭鍏?    Game.resetTurn();
    Game.ui.updateUI();
    Game.state.phase = Game.PHASE.IDLE;
};

/* ========== 鏀诲嚮鏁屼汉 ========== */
Game.battle.attackEnemy = async function(damage) {
    Game.state.enemyHp = Math.max(0, Game.state.enemyHp - damage);
    Game.ui.showDamage(document.getElementById('enemies'), damage);
    Game.ui.showBattleLog('閫犳垚 ' + damage + ' 鐐逛激瀹筹紒');
    Game.ui.updateUI();
    await Game.match.sleep(900);

    if (Game.state.enemyHp <= 0) {
        Game.ui.showBattleLog(Game.state.enemyName + ' 琚嚮璐ワ紒');
        await Game.match.sleep(1200);
    }
};

/* ========== 鏁屼汉鏀诲嚮 ========== */
Game.battle.enemyAttack = async function() {
    const dmg = Game.state.enemyAttack;
    Game.state.playerHp = Math.max(0, Game.state.playerHp - dmg);
    Game.ui.showDamage(document.querySelector('.side-ally'), dmg);
    Game.ui.showBattleLog('鏁屾柟鏀诲嚮 -' + dmg);
    Game.ui.updateUI();
    await Game.match.sleep(1200);
};

/* ========== 杩涘叆涓嬩竴鍏?========== */
Game.battle.nextLevel = async function() {
    if (Game.state.level >= 10) {
        Game.ui.showBattleLog('馃帀 鎭枩閫氬叧锛?);
        await Game.match.sleep(1500);
        alert('鎭枩閫氬叧鍏ㄩ儴10鍏筹紒');
        location.reload();
        return;
    }

    Game.state.level++;
    Game.state.maxEnemyHp = Game.config.ENEMY_BASE_HP + (Game.state.level - 1) * Game.config.ENEMY_HP_GROWTH;
    Game.state.enemyHp = Game.state.maxEnemyHp;
    Game.state.enemyAttack = Game.config.ENEMY_BASE_ATTACK + (Game.state.level - 1) * Game.config.ENEMY_ATTACK_GROWTH;
    Game.state.enemyName = Game.ENEMIES[Game.state.level - 1].name;

    Game.resetTurn();
    Game.ui.updateUI();
    Game.ui.showBattleLog('绗?' + Game.state.level + ' 鍏?- ' + Game.state.enemyName);
    await Game.match.sleep(1200);
    Game.state.phase = Game.PHASE.IDLE;
};

/* ========== 娓告垙缁撴潫 ========== */
Game.battle.gameOver = async function() {
    Game.state.phase = Game.PHASE.OVER;
    Game.ui.showBattleLog('馃拃 娓告垙缁撴潫锛?);
    await Game.match.sleep(1500);
    alert('娓告垙缁撴潫锛乗n浣犲湪绗?' + Game.state.level + ' 鍏宠 ' + Game.state.enemyName + ' 鍑昏触銆?);
    location.reload();
};

/* ========== 涓夋灏嗘妧鑳借繛鍙?========== */
Game.battle.triggerSkillSequence = async function() {
    Game.state.phase = Game.PHASE.SKILL;

    // 鈥斺€斺€斺€?鍒樺锛氫粊寰峰ぉ涓?鈥斺€斺€斺€?    await Game.battle.skillLiuBei();
    await Game.match.sleep(400);

    // 鈥斺€斺€斺€?璧典簯锛氫竷杩涗竷鍑?鈥斺€斺€斺€?    await Game.battle.skillZhaoYun();
    await Game.match.sleep(400);

    // 鈥斺€斺€斺€?璇歌憶浜細鍗ч緳鍑哄北 鈥斺€斺€斺€?    await Game.battle.skillZhugeLiang();
    await Game.match.sleep(400);

    // 鎶€鑳界粨鏉熷悗鍥炲埌 RESOLVING锛岃 resolveCascade 缁х画澶勭悊鍙兘浜х敓鐨勬柊鍖归厤
    Game.state.phase = Game.PHASE.RESOLVING;
};

/* ========== 鍒樺锛氫粊寰峰ぉ涓?- 闅忔満 10 涓柟鍧楀彉缁?========== */
Game.battle.skillLiuBei = async function() {
    const layer = Game.ui.showSkillOverlay('鈽?, '鍒樺', '浠佸痉澶╀笅');
    Game.ui.showBattleLog('鍒樺 路 浠佸痉澶╀笅锛?);
    const cells = document.querySelectorAll('.cell');

    // 鍊欓€夌储寮曪細闈炵豢鑹蹭笖闈炵┖
    const candidates = [];
    for (let i = 0; i < Game.config.TOTAL_CELLS; i++) {
        if (Game.state.grid[i] !== Game.config.COLOR_GREEN && Game.state.grid[i] >= 0) {
            candidates.push(i);
        }
    }

    // 鎵撲贡鍚庡彇鍓?10 涓?    for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    const picks = candidates.slice(0, Game.config.LIUBEI_GREEN_SPAWN);

    picks.forEach(i => {
        Game.state.grid[i] = Game.config.COLOR_GREEN;
        Game.ui.paintCell(cells[i], Game.config.COLOR_GREEN);
        cells[i].classList.add('falling');
    });

    await Game.match.sleep(Game.config.ANIM.SKILL_CAST);
    picks.forEach(i => cells[i].classList.remove('falling'));
    Game.ui.hideSkillOverlay(layer);

    // 鍒樺鎶€鑳戒骇鐢熺殑鍖归厤鍏堟秷鎺?    await Game.match.finishRemainingCascade();
};

/* ========== 璧典簯锛氫竷杩涗竷鍑?- 闅忔満娑堥櫎 7 涓潪缁胯壊鏂瑰潡 ========== */
Game.battle.skillZhaoYun = async function() {
    const layer = Game.ui.showSkillOverlay('馃悗', '璧典簯', '涓冭繘涓冨嚭');
    Game.ui.showBattleLog('璧典簯 路 涓冭繘涓冨嚭锛?);
    const cells = document.querySelectorAll('.cell');

    // 鍊欓€夌储寮曪細闈炵豢鑹蹭笖闈炵┖
    const candidates = [];
    for (let i = 0; i < Game.config.TOTAL_CELLS; i++) {
        if (Game.state.grid[i] !== Game.config.COLOR_GREEN && Game.state.grid[i] >= 0) {
            candidates.push(i);
        }
    }

    // 鎵撲贡鍚庡彇鍓?7 涓?    for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    const picks = candidates.slice(0, Game.config.ZHAOYUN_RANDOM_REMOVE);

    let greenCount = 0, redCount = 0;
    picks.forEach(i => {
        const c = Game.state.grid[i];
        if (c === Game.config.COLOR_GREEN) greenCount++;
        if (c === Game.config.COLOR_RED) redCount++;
        Game.state.grid[i] = -1;
        cells[i].classList.add('removing');
    });

    // 娑堥櫎锛氳涓轰竴杞尮閰嶏紝combo+1
    Game.state.combo++;
    Game.state.perMatchGreens.push(greenCount);
    Game.state.perMatchReds.push(redCount);
    Game.state.totalGreenThisTurn += greenCount;
    Game.state.totalRedThisTurn += redCount;
    if (redCount > 0) {
        const heal = redCount * Game.state.combo;
        Game.state.playerHp = Math.min(Game.state.maxPlayerHp, Game.state.playerHp + heal);
    }
    Game.ui.updateUI();

    await Game.match.sleep(Game.config.ANIM.SKILL_CAST);
    picks.forEach(i => cells[i].classList.remove('removing'));
    Game.ui.hideSkillOverlay(layer);

    await Game.match.applyGravity();
    await Game.match.finishRemainingCascade();
};

/* ========== 璇歌憶浜細鍗ч緳鍑哄北 - 闅忔満娑堥櫎 3脳3 鍖哄煙 ========== */
Game.battle.skillZhugeLiang = async function() {
    const layer = Game.ui.showSkillOverlay('馃悏', '璇歌憶浜?, '鍗ч緳鍑哄北');
    Game.ui.showBattleLog('璇歌憶浜?路 鍗ч緳鍑哄北锛?);
    const cells = document.querySelectorAll('.cell');

    const CS = Game.config.GRID_COLS;
    const RS = Game.config.GRID_ROWS;

    // 闅忔満璧风偣锛堢‘淇?3脳3 涓嶈秴鍑鸿竟鐣岋級
    const startRow = Math.floor(Math.random() * (RS - 2));
    const startCol = Math.floor(Math.random() * (CS - 2));

    let greenCount = 0, redCount = 0;
    const picks = [];

    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            const idx = r * CS + c;
            picks.push(idx);
            const color = Game.state.grid[idx];
            if (color === Game.config.COLOR_GREEN) greenCount++;
            if (color === Game.config.COLOR_RED) redCount++;
            Game.state.grid[idx] = -1;
            cells[idx].classList.add('removing');
        }
    }

    // 娑堥櫎锛氳涓轰竴杞尮閰嶏紝combo+1
    Game.state.combo++;
    Game.state.perMatchGreens.push(greenCount);
    Game.state.perMatchReds.push(redCount);
    Game.state.totalGreenThisTurn += greenCount;
    Game.state.totalRedThisTurn += redCount;
    if (redCount > 0) {
        const heal = redCount * Game.state.combo;
        Game.state.playerHp = Math.min(Game.state.maxPlayerHp, Game.state.playerHp + heal);
    }
    Game.ui.updateUI();

    await Game.match.sleep(Game.config.ANIM.SKILL_CAST);
    picks.forEach(i => cells[i].classList.remove('removing'));
    Game.ui.hideSkillOverlay(layer);

    await Game.match.applyGravity();
    await Game.match.finishRemainingCascade();
};

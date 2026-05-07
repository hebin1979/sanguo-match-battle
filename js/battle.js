/* 三国消除战记 v2.0 - 战斗系统
 * 核心流程：
 *   resolveTurn（回合结算）→ 攻击敌人 → 敌人反击 → 下一关或继续
 *   triggerSkillSequence：刘备 → 关羽 → 张飞 三人连发
 * 所有异步动作用 async/await 串联
 */
window.Game = window.Game || {};
Game.battle = {};

/* ========== 回合结算 ========== */
Game.battle.resolveTurn = async function() {
    Game.state.phase = Game.PHASE.BATTLE;

    // 计算总伤害：每轮匹配的绿色宝石数 × 该轮 combo 倍率
    // perMatchGreens[0] 是第1轮匹配 → 倍率 1x
    // perMatchGreens[1] 是第2轮匹配 → 倍率 2x
    let totalDamage = 0;
    Game.state.perMatchGreens.forEach((greens, i) => {
        totalDamage += greens * (i + 1);
    });

    if (totalDamage > 0) {
        await Game.battle.attackEnemy(totalDamage);
    } else {
        Game.ui.showBattleLog('未形成攻击...');
        await Game.match.sleep(900);
    }

    // 敌人若已死，进入下一关
    if (Game.state.enemyHp <= 0) {
        await Game.battle.nextLevel();
        return;
    }

    // 敌人反击
    await Game.battle.enemyAttack();

    // 玩家若已死，游戏结束
    if (Game.state.playerHp <= 0) {
        await Game.battle.gameOver();
        return;
    }

    // 重置回合数据，回到等待输入
    Game.resetTurn();
    Game.ui.updateUI();
    Game.state.phase = Game.PHASE.IDLE;
};

/* ========== 攻击敌人 ========== */
Game.battle.attackEnemy = async function(damage) {
    Game.state.enemyHp = Math.max(0, Game.state.enemyHp - damage);
    Game.ui.showDamage(document.getElementById('enemies'), damage);
    Game.ui.showBattleLog('造成 ' + damage + ' 点伤害！');
    Game.ui.updateUI();
    await Game.match.sleep(900);

    if (Game.state.enemyHp <= 0) {
        Game.ui.showBattleLog(Game.state.enemyName + ' 被击败！');
        await Game.match.sleep(1200);
    }
};

/* ========== 敌人攻击 ========== */
Game.battle.enemyAttack = async function() {
    const dmg = Game.state.enemyAttack;
    Game.state.playerHp = Math.max(0, Game.state.playerHp - dmg);
    Game.ui.showDamage(document.querySelector('.side-ally'), dmg);
    Game.ui.showBattleLog('敌方攻击 -' + dmg);
    Game.ui.updateUI();
    await Game.match.sleep(1200);
};

/* ========== 进入下一关 ========== */
Game.battle.nextLevel = async function() {
    if (Game.state.level >= 10) {
        Game.ui.showBattleLog('🎉 恭喜通关！');
        await Game.match.sleep(1500);
        alert('恭喜通关全部10关！');
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
    Game.ui.showBattleLog('第 ' + Game.state.level + ' 关 - ' + Game.state.enemyName);
    await Game.match.sleep(1200);
    Game.state.phase = Game.PHASE.IDLE;
};

/* ========== 游戏结束 ========== */
Game.battle.gameOver = async function() {
    Game.state.phase = Game.PHASE.OVER;
    Game.ui.showBattleLog('💀 游戏结束！');
    await Game.match.sleep(1500);
    alert('游戏结束！\n你在第 ' + Game.state.level + ' 关被 ' + Game.state.enemyName + ' 击败。');
    location.reload();
};

/* ========== 三武将技能连发 ========== */
Game.battle.triggerSkillSequence = async function() {
    Game.state.phase = Game.PHASE.SKILL;

    // ———— 刘备：仁德天下 ————
    await Game.battle.skillLiuBei();
    await Game.match.sleep(400);

    // ———— 关羽：水淹七军 ————
    await Game.battle.skillGuanYu();
    await Game.match.sleep(400);

    // ———— 张飞：大喝断桥 ————
    await Game.battle.skillZhangFei();
    await Game.match.sleep(400);

    // 技能结束后回到 RESOLVING，让 resolveCascade 继续处理可能产生的新匹配
    Game.state.phase = Game.PHASE.RESOLVING;
};

/* ========== 刘备：仁德天下 - 随机 10 个方块变绿 ========== */
Game.battle.skillLiuBei = async function() {
    const layer = Game.ui.showSkillOverlay('☯', '刘备', '仁德天下');
    Game.ui.showBattleLog('刘备 · 仁德天下！');
    const cells = document.querySelectorAll('.cell');

    // 候选索引：非绿色且非空
    const candidates = [];
    for (let i = 0; i < Game.config.TOTAL_CELLS; i++) {
        if (Game.state.grid[i] !== Game.config.COLOR_GREEN && Game.state.grid[i] >= 0) {
            candidates.push(i);
        }
    }

    // 打乱后取前 10 个
    for (let i = candidates.length - 1; i > 0; i--) {
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

    // 刘备技能产生的匹配先消掉
    await Game.match.finishRemainingCascade();
};

/* ========== 关羽：水淹七军 - 随机消一行 ========== */
Game.battle.skillGuanYu = async function() {
    const layer = Game.ui.showSkillOverlay('🌊', '关羽', '水淹七军');
    Game.ui.showBattleLog('关羽 · 水淹七军！');
    const cells = document.querySelectorAll('.cell');

    const row = Math.floor(Math.random() * Game.config.GRID_ROWS);
    const CS = Game.config.GRID_COLS;
    let greenCount = 0, redCount = 0;

    for (let col = 0; col < CS; col++) {
        const idx = row * CS + col;
        const c = Game.state.grid[idx];
        if (c === Game.config.COLOR_GREEN) greenCount++;
        if (c === Game.config.COLOR_RED) redCount++;
        Game.state.grid[idx] = -1;
        cells[idx].classList.add('removing');
    }

    // 消除行：计为一轮匹配，combo+1，计入伤害
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
    for (let col = 0; col < CS; col++) {
        cells[row * CS + col].classList.remove('removing');
    }
    Game.ui.hideSkillOverlay(layer);

    await Game.match.applyGravity();
    await Game.match.finishRemainingCascade();
};

/* ========== 张飞：大喝断桥 - 随机消一列 ========== */
Game.battle.skillZhangFei = async function() {
    const layer = Game.ui.showSkillOverlay('⚡', '张飞', '大喝断桥');
    Game.ui.showBattleLog('张飞 · 大喝断桥！');
    const cells = document.querySelectorAll('.cell');

    const col = Math.floor(Math.random() * Game.config.GRID_COLS);
    const CS = Game.config.GRID_COLS, RS = Game.config.GRID_ROWS;
    let greenCount = 0, redCount = 0;

    for (let row = 0; row < RS; row++) {
        const idx = row * CS + col;
        const c = Game.state.grid[idx];
        if (c === Game.config.COLOR_GREEN) greenCount++;
        if (c === Game.config.COLOR_RED) redCount++;
        Game.state.grid[idx] = -1;
        cells[idx].classList.add('removing');
    }

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
    for (let row = 0; row < RS; row++) {
        cells[row * CS + col].classList.remove('removing');
    }
    Game.ui.hideSkillOverlay(layer);

    await Game.match.applyGravity();
    await Game.match.finishRemainingCascade();
};

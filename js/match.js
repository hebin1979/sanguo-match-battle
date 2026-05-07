/* 三国消除战记 v2.0 - 消除逻辑
 * 核心流程：
 *   交换 → 检查匹配 → 消除 → 下落填充 → 再次检查匹配（连锁）
 *   所有步骤用 Promise 串联，不再有 setTimeout 嵌套
 * 消除规则：
 *   1. 横向 ≥3 个同色连续方块
 *   2. 纵向 ≥3 个同色连续方块
 *   3. 任意 2×2 同色方块
 */
window.Game = window.Game || {};
Game.match = {};

/* ========== 工具：Promise 延迟 ========== */
Game.match.sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/* ========== 初始化网格 ========== */
Game.match.initGrid = function() {
    const gridEl = document.getElementById('grid');
    gridEl.innerHTML = '';
    Game.state.grid = [];

    const CS = Game.config.GRID_COLS;

    for (let i = 0; i < Game.config.TOTAL_CELLS; i++) {
        // 挑选一个颜色，确保不会和已有格子构成 2×2
        let color;
        let tries = 0;
        do {
            color = Math.floor(Math.random() * Game.config.COLOR_COUNT);
            tries++;
        } while (tries < 100 && Game.match.wouldCauseMatch(i, color));

        Game.state.grid[i] = color;

        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        Game.ui.paintCell(cell, color);
        cell.addEventListener('click', () => Game.match.onCellClick(i));
        gridEl.appendChild(cell);
    }

    // 二次保险：初始盘面若意外有匹配，重新生成
    if (Game.match.findMatches().length > 0) {
        console.warn('[initGrid] 初始盘面有匹配，重新生成');
        return Game.match.initGrid();
    }
};

/* ========== 防止初始匹配（三连 或 2×2） ========== */
Game.match.wouldCauseMatch = function(index, color) {
    const CS = Game.config.GRID_COLS;
    const row = Math.floor(index / CS);
    const col = index % CS;
    const g = Game.state.grid;

    // 横向三连（左边两格同色）
    if (col >= 2) {
        if (g[row*CS + col-1] === color && g[row*CS + col-2] === color) return true;
    }
    // 纵向三连（上面两格同色）
    if (row >= 2) {
        if (g[(row-1)*CS + col] === color && g[(row-2)*CS + col] === color) return true;
    }
    // 2×2（当前格是 2×2 的右下角）
    if (row >= 1 && col >= 1) {
        if (g[(row-1)*CS + (col-1)] === color &&
            g[(row-1)*CS + col]       === color &&
            g[row*CS + (col-1)]       === color) {
            return true;
        }
    }
    return false;
};

/* ========== 查找所有匹配（横≥3、纵≥3、2×2） ========== */
Game.match.findMatches = function() {
    const matches = new Set();
    const CS = Game.config.GRID_COLS, RS = Game.config.GRID_ROWS;
    const g = Game.state.grid;

    // 1. 横向扫描（连续 ≥3）
    for (let r = 0; r < RS; r++) {
        let runColor = -1, runStart = 0, runLen = 0;
        for (let c = 0; c <= CS; c++) {
            const idx = r * CS + c;
            const color = (c < CS) ? g[idx] : -2;
            if (c < CS && color === runColor && color >= 0) {
                runLen++;
            } else {
                if (runColor >= 0 && runLen >= 3) {
                    for (let k = 0; k < runLen; k++) matches.add(r * CS + runStart + k);
                }
                runColor = color;
                runStart = c;
                runLen = 1;
            }
        }
    }

    // 2. 纵向扫描（连续 ≥3）
    for (let c = 0; c < CS; c++) {
        let runColor = -1, runStart = 0, runLen = 0;
        for (let r = 0; r <= RS; r++) {
            const idx = r * CS + c;
            const color = (r < RS) ? g[idx] : -2;
            if (r < RS && color === runColor && color >= 0) {
                runLen++;
            } else {
                if (runColor >= 0 && runLen >= 3) {
                    for (let k = 0; k < runLen; k++) matches.add((runStart + k) * CS + c);
                }
                runColor = color;
                runStart = r;
                runLen = 1;
            }
        }
    }

    // 3. 2×2 同色方块
    for (let r = 0; r < RS - 1; r++) {
        for (let c = 0; c < CS - 1; c++) {
            const tl = r * CS + c;
            const color = g[tl];
            if (color < 0) continue;
            if (g[tl + 1] === color && g[tl + CS] === color && g[tl + CS + 1] === color) {
                matches.add(tl); matches.add(tl + 1);
                matches.add(tl + CS); matches.add(tl + CS + 1);
            }
        }
    }

    return Array.from(matches);
};

/* ========== 点击格子 ========== */
Game.match.onCellClick = function(index) {
    if (Game.state.phase !== Game.PHASE.IDLE) return;
    const cells = document.querySelectorAll('.cell');

    if (Game.state.selectedCell === null) {
        Game.state.selectedCell = index;
        cells[index].classList.add('selected');
        return;
    }

    const sel = Game.state.selectedCell;
    cells[sel].classList.remove('selected');
    Game.state.selectedCell = null;

    if (sel === index) return;

    // 判断相邻
    const CS = Game.config.GRID_COLS;
    const diff = Math.abs(sel - index);
    const r1 = Math.floor(sel / CS), r2 = Math.floor(index / CS);
    const isAdj = (diff === 1 && r1 === r2) || (diff === CS);
    if (!isAdj) {
        // 直接改选新格
        Game.state.selectedCell = index;
        cells[index].classList.add('selected');
        return;
    }

    // 执行交换
    Game.match.trySwap(sel, index);
};

/* ========== 尝试交换（Promise 流程） ========== */
Game.match.trySwap = async function(i1, i2) {
    Game.state.phase = Game.PHASE.RESOLVING;
    const cells = document.querySelectorAll('.cell');

    // 数据交换
    const t = Game.state.grid[i1];
    Game.state.grid[i1] = Game.state.grid[i2];
    Game.state.grid[i2] = t;
    Game.ui.paintCell(cells[i1], Game.state.grid[i1]);
    Game.ui.paintCell(cells[i2], Game.state.grid[i2]);

    await Game.match.sleep(Game.config.ANIM.SWAP);

    if (Game.match.findMatches().length === 0) {
        // 无效交换，换回
        const back = Game.state.grid[i1];
        Game.state.grid[i1] = Game.state.grid[i2];
        Game.state.grid[i2] = back;
        Game.ui.paintCell(cells[i1], Game.state.grid[i1]);
        Game.ui.paintCell(cells[i2], Game.state.grid[i2]);
        Game.state.phase = Game.PHASE.IDLE;
        return;
    }

    // 有效交换 → 进入消除连锁
    await Game.match.resolveCascade();
    // 连锁结束 → 交给战斗阶段
    await Game.battle.resolveTurn();
};

/* ========== 消除 + 下落 + 连锁（循环直到无匹配） ========== */
Game.match.resolveCascade = async function() {
    while (true) {
        const matches = Game.match.findMatches();
        if (matches.length === 0) break;

        Game.state.combo++;
        await Game.match.eliminate(matches);
        await Game.match.applyGravity();

        // 检查是否累计触发技能
        if (!Game.state.skillTriggered &&
            Game.state.totalGreenThisTurn >= Game.config.GREEN_SKILL_THRESHOLD) {
            Game.state.skillTriggered = true;
            // 先完成当前连锁，再执行技能
            await Game.match.finishRemainingCascade();
            await Game.battle.triggerSkillSequence();
            // 技能可能触发新的匹配，继续循环
        }
    }
};

/* 技能触发前，把当前已经产生的匹配先完整消完 */
Game.match.finishRemainingCascade = async function() {
    while (true) {
        const m = Game.match.findMatches();
        if (m.length === 0) break;
        Game.state.combo++;
        await Game.match.eliminate(m);
        await Game.match.applyGravity();
    }
};

/* ========== 消除匹配格子 ========== */
Game.match.eliminate = async function(matches) {
    const cells = document.querySelectorAll('.cell');
    let redCount = 0, greenCount = 0;

    matches.forEach(i => {
        const c = Game.state.grid[i];
        if (c === Game.config.COLOR_RED) redCount++;
        if (c === Game.config.COLOR_GREEN) greenCount++;
        Game.state.grid[i] = -1;
        cells[i].classList.add('removing');
    });

    // 记录本轮匹配数据
    Game.state.perMatchReds.push(redCount);
    Game.state.perMatchGreens.push(greenCount);
    Game.state.totalRedThisTurn += redCount;
    Game.state.totalGreenThisTurn += greenCount;

    // 红色即刻治疗（回血量 = 红色数 × 当前 combo）
    if (redCount > 0) {
        const heal = redCount * Game.state.combo;
        Game.state.playerHp = Math.min(Game.state.maxPlayerHp, Game.state.playerHp + heal);
        Game.ui.showHeal(document.querySelector('.side-ally'), heal);
        Game.ui.showBattleLog('回血 +' + heal);
    }

    Game.ui.updateUI();
    await Game.match.sleep(Game.config.ANIM.REMOVE);
    matches.forEach(i => cells[i].classList.remove('removing'));
};

/* ========== 重力下落 + 填充顶部 ========== */
Game.match.applyGravity = async function() {
    const cells = document.querySelectorAll('.cell');
    const CS = Game.config.GRID_COLS, RS = Game.config.GRID_ROWS;

    for (let col = 0; col < CS; col++) {
        // 收集当前列非空格子（自下而上）
        const stack = [];
        for (let row = RS - 1; row >= 0; row--) {
            const idx = row * CS + col;
            if (Game.state.grid[idx] >= 0) stack.push(Game.state.grid[idx]);
        }
        // 从下往上重新填回
        for (let row = RS - 1; row >= 0; row--) {
            const idx = row * CS + col;
            if (stack.length > 0) {
                const color = stack.shift();
                if (Game.state.grid[idx] !== color) {
                    Game.state.grid[idx] = color;
                    Game.ui.paintCell(cells[idx], color);
                    cells[idx].classList.add('falling');
                }
            } else {
                // 顶部补新格
                const color = Math.floor(Math.random() * Game.config.COLOR_COUNT);
                Game.state.grid[idx] = color;
                Game.ui.paintCell(cells[idx], color);
                cells[idx].classList.add('falling');
            }
        }
    }

    await Game.match.sleep(Game.config.ANIM.FALL);
    cells.forEach(c => c.classList.remove('falling'));
};

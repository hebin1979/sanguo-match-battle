/* 涓夊浗娑堥櫎鎴樿 v2.0 - 娑堥櫎閫昏緫
 * 鏍稿績娴佺▼锛? *   浜ゆ崲 鈫?妫€鏌ュ尮閰?鈫?娑堥櫎 鈫?涓嬭惤濉厖 鈫?鍐嶆妫€鏌ュ尮閰嶏紙杩為攣锛? *   鎵€鏈夋楠ょ敤 Promise 涓茶仈锛屼笉鍐嶆湁 setTimeout 宓屽
 * 娑堥櫎瑙勫垯锛? *   1. 妯悜 鈮? 涓悓鑹茶繛缁柟鍧? *   2. 绾靛悜 鈮? 涓悓鑹茶繛缁柟鍧? *   3. 浠绘剰 2脳2 鍚岃壊鏂瑰潡
 */
window.Game = window.Game || {};
Game.match = {};

/* ========== 宸ュ叿锛歅romise 寤惰繜 ========== */
Game.match.sleep = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/* ========== 鍒濆鍖栫綉鏍?========== */
Game.match.initGrid = function() {
    const gridEl = document.getElementById('grid');
    gridEl.innerHTML = '';
    Game.state.grid = [];

    const CS = Game.config.GRID_COLS;

    for (let i = 0; i < Game.config.TOTAL_CELLS; i++) {
        // 鎸戦€変竴涓鑹诧紝纭繚涓嶄細鍜屽凡鏈夋牸瀛愭瀯鎴?2脳2
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

    // 浜屾淇濋櫓锛氬垵濮嬬洏闈㈣嫢鎰忓鏈夊尮閰嶏紝閲嶆柊鐢熸垚
    if (Game.match.findMatches().length > 0) {
        console.warn('[initGrid] 鍒濆鐩橀潰鏈夊尮閰嶏紝閲嶆柊鐢熸垚');
        return Game.match.initGrid();
    }
};

/* ========== 闃叉鍒濆鍖归厤锛堜笁杩?鎴?2脳2锛?========== */
Game.match.wouldCauseMatch = function(index, color) {
    const CS = Game.config.GRID_COLS;
    const row = Math.floor(index / CS);
    const col = index % CS;
    const g = Game.state.grid;

    // 妯悜涓夎繛锛堝乏杈逛袱鏍煎悓鑹诧級
    if (col >= 2) {
        if (g[row*CS + col-1] === color && g[row*CS + col-2] === color) return true;
    }
    // 绾靛悜涓夎繛锛堜笂闈袱鏍煎悓鑹诧級
    if (row >= 2) {
        if (g[(row-1)*CS + col] === color && g[(row-2)*CS + col] === color) return true;
    }
    // 2脳2锛堝綋鍓嶆牸鏄?2脳2 鐨勫彸涓嬭锛?    if (row >= 1 && col >= 1) {
        if (g[(row-1)*CS + (col-1)] === color &&
            g[(row-1)*CS + col]       === color &&
            g[row*CS + (col-1)]       === color) {
            return true;
        }
    }
    return false;
};

/* ========== 鏌ユ壘鎵€鏈夊尮閰嶏紙妯墺3銆佺旱鈮?銆?脳2锛?========== */
Game.match.findMatches = function() {
    const matches = new Set();
    const CS = Game.config.GRID_COLS, RS = Game.config.GRID_ROWS;
    const g = Game.state.grid;

    // 1. 妯悜鎵弿锛堣繛缁?鈮?锛?    for (let r = 0; r < RS; r++) {
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

    // 2. 绾靛悜鎵弿锛堣繛缁?鈮?锛?    for (let c = 0; c < CS; c++) {
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

    // 3. 2脳2 鍚岃壊鏂瑰潡
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

/* ========== 鐐瑰嚮鏍煎瓙 ========== */
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

    // 鍒ゆ柇鐩搁偦
    const CS = Game.config.GRID_COLS;
    const diff = Math.abs(sel - index);
    const r1 = Math.floor(sel / CS), r2 = Math.floor(index / CS);
    const isAdj = (diff === 1 && r1 === r2) || (diff === CS);
    if (!isAdj) {
        // 鐩存帴鏀归€夋柊鏍?        Game.state.selectedCell = index;
        cells[index].classList.add('selected');
        return;
    }

    // 鎵ц浜ゆ崲
    Game.match.trySwap(sel, index);
};

/* ========== 灏濊瘯浜ゆ崲锛圥romise 娴佺▼锛?========== */
Game.match.trySwap = async function(i1, i2) {
    Game.state.phase = Game.PHASE.RESOLVING;
    const cells = document.querySelectorAll('.cell');

    // 鏁版嵁浜ゆ崲
    const t = Game.state.grid[i1];
    Game.state.grid[i1] = Game.state.grid[i2];
    Game.state.grid[i2] = t;
    Game.ui.paintCell(cells[i1], Game.state.grid[i1]);
    Game.ui.paintCell(cells[i2], Game.state.grid[i2]);

    await Game.match.sleep(Game.config.ANIM.SWAP);

    if (Game.match.findMatches().length === 0) {
        // 鏃犳晥浜ゆ崲锛屾崲鍥?        const back = Game.state.grid[i1];
        Game.state.grid[i1] = Game.state.grid[i2];
        Game.state.grid[i2] = back;
        Game.ui.paintCell(cells[i1], Game.state.grid[i1]);
        Game.ui.paintCell(cells[i2], Game.state.grid[i2]);
        Game.state.phase = Game.PHASE.IDLE;
        return;
    }

    // 鏈夋晥浜ゆ崲 鈫?杩涘叆娑堥櫎杩為攣
    await Game.match.resolveCascade();
    // 杩為攣缁撴潫 鈫?浜ょ粰鎴樻枟闃舵
    await Game.battle.resolveTurn();
};

/* ========== 娑堥櫎 + 涓嬭惤 + 杩為攣锛堝惊鐜洿鍒版棤鍖归厤锛?========== */
Game.match.resolveCascade = async function() {
    while (true) {
        const matches = Game.match.findMatches();
        if (matches.length === 0) break;

        Game.state.combo++;
        await Game.match.eliminate(matches);
        await Game.match.applyGravity();

        // 妫€鏌ユ槸鍚︾疮璁¤Е鍙戞妧鑳?        if (!Game.state.skillTriggered &&
            Game.state.totalGreenThisTurn >= Game.config.GREEN_SKILL_THRESHOLD) {
            Game.state.skillTriggered = true;
            // 鍏堝畬鎴愬綋鍓嶈繛閿侊紝鍐嶆墽琛屾妧鑳?            await Game.match.finishRemainingCascade();
            await Game.battle.triggerSkillSequence();
            // 鎶€鑳藉彲鑳借Е鍙戞柊鐨勫尮閰嶏紝缁х画寰幆
        }
    }
};

/* 鎶€鑳借Е鍙戝墠锛屾妸褰撳墠宸茬粡浜х敓鐨勫尮閰嶅厛瀹屾暣娑堝畬 */
Game.match.finishRemainingCascade = async function() {
    while (true) {
        const m = Game.match.findMatches();
        if (m.length === 0) break;
        Game.state.combo++;
        await Game.match.eliminate(m);
        await Game.match.applyGravity();
    }
};

/* ========== 娑堥櫎鍖归厤鏍煎瓙 ========== */
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

    // 璁板綍鏈疆鍖归厤鏁版嵁
    Game.state.perMatchReds.push(redCount);
    Game.state.perMatchGreens.push(greenCount);
    Game.state.totalRedThisTurn += redCount;
    Game.state.totalGreenThisTurn += greenCount;

    // 绾㈣壊鍗冲埢娌荤枟锛堝洖琛€閲?= 绾㈣壊鏁?脳 褰撳墠 combo锛?    if (redCount > 0) {
        const heal = redCount * Game.state.combo;
        Game.state.playerHp = Math.min(Game.state.maxPlayerHp, Game.state.playerHp + heal);
        Game.ui.showHeal(document.querySelector('.side-ally'), heal);
        Game.ui.showBattleLog('鍥炶 +' + heal);
    }

    Game.ui.updateUI();
    await Game.match.sleep(Game.config.ANIM.REMOVE);
    matches.forEach(i => cells[i].classList.remove('removing'));
};

/* ========== 閲嶅姏涓嬭惤 + 濉厖椤堕儴 ========== */
Game.match.applyGravity = async function() {
    const cells = document.querySelectorAll('.cell');
    const CS = Game.config.GRID_COLS, RS = Game.config.GRID_ROWS;

    for (let col = 0; col < CS; col++) {
        // 鏀堕泦褰撳墠鍒楅潪绌烘牸瀛愶紙鑷笅鑰屼笂锛?        const stack = [];
        for (let row = RS - 1; row >= 0; row--) {
            const idx = row * CS + col;
            if (Game.state.grid[idx] >= 0) stack.push(Game.state.grid[idx]);
        }
        // 浠庝笅寰€涓婇噸鏂板～鍥?        for (let row = RS - 1; row >= 0; row--) {
            const idx = row * CS + col;
            if (stack.length > 0) {
                const color = stack.shift();
                if (Game.state.grid[idx] !== color) {
                    Game.state.grid[idx] = color;
                    Game.ui.paintCell(cells[idx], color);
                    cells[idx].classList.add('falling');
                }
            } else {
                // 椤堕儴琛ユ柊鏍?                const color = Math.floor(Math.random() * Game.config.COLOR_COUNT);
                Game.state.grid[idx] = color;
                Game.ui.paintCell(cells[idx], color);
                cells[idx].classList.add('falling');
            }
        }
    }

    await Game.match.sleep(Game.config.ANIM.FALL);
    cells.forEach(c => c.classList.remove('falling'));
};

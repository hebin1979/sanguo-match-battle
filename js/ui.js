/* 三国消除战记 v2.0 - UI 渲染 */
window.Game = window.Game || {};

Game.ui = {};

/* ---------- 刷新所有 UI ---------- */
Game.ui.updateUI = function() {
    const s = Game.state;

    // 关卡
    document.getElementById('level').textContent = s.level;

    // 回血（本回合累计）
    document.getElementById('healAmount').textContent = s.totalRedThisTurn;

    // 连击（显示绿色累计数）
    document.getElementById('combo').textContent = s.totalGreenThisTurn;

    // 攻击力预览（绿色累计 × combo 倍率），方便玩家看到当前威力
    const preview = s.combo > 0 ? s.totalGreenThisTurn * s.combo : 0;
    document.getElementById('attackPower').textContent = preview > 0 ? `x${preview}` : '0';

    // 血条
    const pPct = Math.max(0, (s.playerHp / s.maxPlayerHp) * 100);
    const ePct = Math.max(0, (s.enemyHp / s.maxEnemyHp) * 100);
    document.getElementById('playerHpBar').style.width = pPct + '%';
    document.getElementById('enemyHpBar').style.width = ePct + '%';
    document.getElementById('playerHpText').textContent = s.playerHp + '/' + s.maxPlayerHp;
    document.getElementById('enemyHpText').textContent = s.enemyHp + '/' + s.maxEnemyHp;

    // 敌人名称
    document.getElementById('enemyName').textContent = s.enemyName;
    const enemyTop = document.getElementById('enemyNameTop');
    if (enemyTop) enemyTop.textContent = '敌·' + s.enemyName;
};

/* ---------- 战斗日志 ---------- */
Game.ui.showBattleLog = function(message) {
    const log = document.getElementById('battleLog');
    log.textContent = message;
    log.classList.add('show');
    clearTimeout(Game.ui._logTimer);
    Game.ui._logTimer = setTimeout(() => log.classList.remove('show'), Game.config.ANIM.LOG);
};

/* ---------- 伤害飘字 ---------- */
Game.ui.showDamage = function(element, damage) {
    const t = document.createElement('div');
    t.className = 'damage-text';
    t.textContent = '-' + damage;
    t.style.left = '50%';
    t.style.top = '25%';
    element.appendChild(t);
    setTimeout(() => t.remove(), Game.config.ANIM.DAMAGE_TEXT);
};

/* ---------- 治疗飘字 ---------- */
Game.ui.showHeal = function(element, heal) {
    const t = document.createElement('div');
    t.className = 'heal-text';
    t.textContent = '+' + heal;
    t.style.left = '50%';
    t.style.top = '25%';
    element.appendChild(t);
    setTimeout(() => t.remove(), Game.config.ANIM.DAMAGE_TEXT);
};

/* ---------- 技能特效覆盖层 ---------- */
Game.ui.showSkillOverlay = function(icon, heroName, skillName) {
    const scene = document.getElementById('scene');
    const layer = document.createElement('div');
    layer.className = 'skill-overlay';
    layer.innerHTML =
        '<div class="skill-effect">' +
            '<div class="skill-icon">' + icon + '</div>' +
            '<div class="skill-text">' + heroName + ' · ' + skillName + '</div>' +
            '<div class="skill-subtext">' + Game.HEROES[heroName === '刘备' ? 'LIUBEI' : (heroName === '关羽' ? 'GUANYU' : 'ZHANGFEI')].desc + '</div>' +
        '</div>';
    scene.appendChild(layer);
    return layer;
};

Game.ui.hideSkillOverlay = function(layer) {
    if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
};

/* ---------- 格子渲染辅助 ---------- */
Game.ui.paintCell = function(cell, color) {
    cell.className = 'cell';
    if (color >= 0) cell.classList.add(Game.config.COLORS[color]);
    cell.dataset.color = color;
};

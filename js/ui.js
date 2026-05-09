/* 涓夊浗娑堥櫎鎴樿 v2.0 - UI 娓叉煋 */
window.Game = window.Game || {};

Game.ui = {};

/* ---------- 鍒锋柊鎵€鏈?UI ---------- */
Game.ui.updateUI = function() {
    const s = Game.state;

    // 鍏冲崱
    document.getElementById('level').textContent = s.level;

    // 鍥炶锛堟湰鍥炲悎绱锛?    document.getElementById('healAmount').textContent = s.totalRedThisTurn;

    // 杩炲嚮锛堟樉绀虹豢鑹茬疮璁℃暟锛?    document.getElementById('combo').textContent = s.totalGreenThisTurn;

    // 鏀诲嚮鍔涢瑙堬紙缁胯壊绱 脳 combo 鍊嶇巼锛夛紝鏂逛究鐜╁鐪嬪埌褰撳墠濞佸姏
    const preview = s.combo > 0 ? s.totalGreenThisTurn * s.combo : 0;
    document.getElementById('attackPower').textContent = preview > 0 ? `x${preview}` : '0';

    // 琛€鏉?    const pPct = Math.max(0, (s.playerHp / s.maxPlayerHp) * 100);
    const ePct = Math.max(0, (s.enemyHp / s.maxEnemyHp) * 100);
    document.getElementById('playerHpBar').style.width = pPct + '%';
    document.getElementById('enemyHpBar').style.width = ePct + '%';
    document.getElementById('playerHpText').textContent = s.playerHp + '/' + s.maxPlayerHp;
    document.getElementById('enemyHpText').textContent = s.enemyHp + '/' + s.maxEnemyHp;

    // 鏁屼汉鍚嶇О
    document.getElementById('enemyName').textContent = s.enemyName;
    const enemyTop = document.getElementById('enemyNameTop');
    if (enemyTop) enemyTop.textContent = s.enemyName;

    // 鍒囨崲鏁屾柟鍥剧墖
    const enemyImg = document.getElementById('enemyImg');
    if (enemyImg) {
        enemyImg.src = 'role/' + s.enemyName + '.png';
    }

    // 鍒囨崲椤堕儴鏁屾柟澶村儚
    const enemyPortrait = document.getElementById('enemyPortrait');
    if (enemyPortrait) {
        enemyPortrait.style.backgroundImage = "url('role/" + s.enemyName + ".png')";
    }

    // 鍒囨崲椤堕儴鎴戞柟澶村儚锛堝浐瀹氬垬澶囷級
    const allyPortrait = document.getElementById('allyPortrait');
    if (allyPortrait) {
        allyPortrait.style.backgroundImage = "url('role/鍒樺.png')";
    }
};

/* ---------- 鎴樻枟鏃ュ織 ---------- */
Game.ui.showBattleLog = function(message) {
    const log = document.getElementById('battleLog');
    log.textContent = message;
    log.classList.add('show');
    clearTimeout(Game.ui._logTimer);
    Game.ui._logTimer = setTimeout(() => log.classList.remove('show'), Game.config.ANIM.LOG);
};

/* ---------- 浼ゅ椋樺瓧 ---------- */
Game.ui.showDamage = function(element, damage) {
    const t = document.createElement('div');
    t.className = 'damage-text';
    t.textContent = '-' + damage;
    t.style.left = '50%';
    t.style.top = '25%';
    element.appendChild(t);
    setTimeout(() => t.remove(), Game.config.ANIM.DAMAGE_TEXT);
};

/* ---------- 娌荤枟椋樺瓧 ---------- */
Game.ui.showHeal = function(element, heal) {
    const t = document.createElement('div');
    t.className = 'heal-text';
    t.textContent = '+' + heal;
    t.style.left = '50%';
    t.style.top = '25%';
    element.appendChild(t);
    setTimeout(() => t.remove(), Game.config.ANIM.DAMAGE_TEXT);
};

/* ---------- 鎶€鑳界壒鏁堣鐩栧眰 ---------- */
Game.ui.showSkillOverlay = function(icon, heroName, skillName) {
    const scene = document.getElementById('scene');
    const layer = document.createElement('div');
    layer.className = 'skill-overlay';
    let heroKey = 'LIUBEI';
    if (heroName === '璧典簯') heroKey = 'ZHAOYUN';
    else if (heroName === '璇歌憶浜?) heroKey = 'ZHUGELIANG';
    layer.innerHTML =
        '<div class="skill-effect">' +
            '<div class="skill-icon">' + icon + '</div>' +
            '<div class="skill-text">' + heroName + ' 路 ' + skillName + '</div>' +
            '<div class="skill-subtext">' + Game.HEROES[heroKey].desc + '</div>' +
        '</div>';
    scene.appendChild(layer);
    return layer;
};

Game.ui.hideSkillOverlay = function(layer) {
    if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
};

/* ---------- 鏍煎瓙娓叉煋杈呭姪 ---------- */
Game.ui.paintCell = function(cell, color) {
    cell.className = 'cell';
    if (color >= 0) cell.classList.add(Game.config.COLORS[color]);
    cell.dataset.color = color;
};

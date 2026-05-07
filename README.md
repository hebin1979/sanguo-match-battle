# 三国消除战记 (Sanguo Match & Battle)

一款融合**三消**与**回合战斗**的三国主题 H5 小游戏。

🎮 **在线试玩**：https://hebin1979.github.io/sanguo-match-battle/

## 玩法规则

- **消除条件**（任一即可触发）
  - 横向 ≥3 个同色连续方块
  - 纵向 ≥3 个同色连续方块
  - 2×2 同色方块
- **颜色效果**
  - 🔴 红色 → 回血（heal = redCount × combo）
  - 🟢 绿色 → 攻击（总伤害 = Σ 每轮绿数 × 该轮 combo 倍率）
  - 🟡 黄色 / 🔵 蓝色 → 无特殊效果
- **技能机制**：单回合累计消除 ≥5 个绿色，触发 **三武将连发**
  - 刘备·仁德天下：随机 10 格变绿
  - 关羽·水淹七军：随机消一行
  - 张飞·大喝断桥：随机消一列
- **关卡**：黄巾杂兵 → 黄巾精英 → 黄巾将领 → 张梁 → 张宝 → 张角 → 董卓 → 袁绍 → 孙权 → 曹操（共 10 关）

## 技术栈

- 原生 HTML / CSS / JavaScript，零依赖
- 状态机 + Promise 串联，告别 `setTimeout` 嵌套
- 数据 / UI / 逻辑分离：`state` 存数据、`ui` 只渲染、`match` + `battle` 改数据

## 目录结构

```
sanguo-match-battle/
├── index.html           # 主页面
├── css/style.css        # 样式（立体宝石 + Q版武将）
└── js/
    ├── config.js        # 配置（颜色、关卡、武将）
    ├── state.js         # 状态机 + 数据对象
    ├── match.js         # 消除逻辑（匹配、下落、连锁）
    ├── battle.js        # 战斗逻辑（结算、技能、AI）
    ├── ui.js            # UI 渲染（血条、飘字、特效）
    └── main.js          # 入口
```

## 本地运行

直接用浏览器打开 `index.html` 即可。

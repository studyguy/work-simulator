/**
 * 属性分配 UI
 */
const AttributeAssignUI = {
    points: 20,
    values: { COD: 3, COM: 3, STA: 3, FAM: 3 },

    render() {
        // 应用加成
        const bonuses = App.gameConfig.educationBonuses || {};
        this.values = { COD: 3, COM: 3, STA: 3, FAM: 3 };
        this.points = 20;

        // 应用学历加成
        if (bonuses.COD) this.values.COD += bonuses.COD;
        if (bonuses.COM) this.values.COM += bonuses.COM;
        if (bonuses.STA) this.values.STA += bonuses.STA;
        if (bonuses.FAM) this.values.FAM += bonuses.FAM;
        if (bonuses.HAP) { /* 快乐值在游戏中处理 */ }

        // 天赋额外点数
        const talents = App.gameConfig.talents || [];
        const bonusPoints = talents.reduce((sum, t) => sum + (t.status || 0), 0);
        this.points += bonusPoints;

        const attrLabels = {
            COD: { name: '编程能力', desc: '写代码的水平，影响技术类事件' },
            COM: { name: '沟通能力', desc: '表达能力，影响面试、升职' },
            STA: { name: '体力精力', desc: '抗压能力，影响加班和健康' },
            FAM: { name: '家境背景', desc: '经济条件和人脉资源' },
        };

        return `
            <div id="attribute-page" class="page active">
                <div class="attr-header">
                    <h2>分配你的初始属性</h2>
                    <p>剩余点数</p>
                    <div class="attr-points-remaining" id="points-remaining">${this.points}</div>
                </div>
                <div class="attr-list">
                    ${Object.keys(attrLabels).map(key => `
                        <div class="attr-item">
                            <div class="attr-label">${attrLabels[key].name}</div>
                            <div class="attr-slider-container">
                                <input type="range" class="attr-slider"
                                       min="0" max="10" value="${this.values[key]}"
                                       data-action="attribute:change" data-attr="${key}">
                                <div class="attr-value" id="val-${key}">${this.values[key]}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="attr-desc" style="padding: 4px 10px;">
                    ${Object.keys(attrLabels).map(key =>
                        `${attrLabels[key].name}：${attrLabels[key].desc}`
                    ).join('<br>')}
                </div>
                <div class="attr-bottom">
                    <button class="btn btn-primary" data-action="attribute:confirm">开始打工</button>
                </div>
            </div>
        `;
    },

    change(target) {
        const key = target.dataset.attr;
        const newVal = parseInt(target.value, 10);
        const oldVal = this.values[key];
        const diff = newVal - oldVal;
        const newPoints = this.points - diff;

        if (newPoints < 0) {
            // 点数不够，回滚
            target.value = oldVal;
            return;
        }

        this.values[key] = newVal;
        this.points = newPoints;
        document.getElementById(`val-${key}`).textContent = newVal;
        document.getElementById('points-remaining').textContent = newPoints;
    },

    confirm() {
        App.gameConfig.attributes = { ...this.values };
        App.startGame();
    }
};

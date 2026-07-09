/**
 * 天赋抽取 UI - 10选3
 */
const TalentPickUI = {
    drawnTalents: [],
    selectedTalents: [],

    render() {
        // 初始化：加载天赋数据 + 抽取10个天赋
        life.talentSystem.loadTalents(TALENTS_DATA);
        this.drawnTalents = life.talentSystem.drawTalents(10, 3);
        this.selectedTalents = [];

        const gradeLabel = { 1: '普通', 2: '稀有', 3: '传说' };

        return `
            <div id="talent-page" class="page active">
                <div class="talent-header">
                    <h2>抽选你的天赋</h2>
                    <p>从 10 张卡中选择 3 张带入游戏</p>
                </div>
                <div class="talent-grid">
                    ${this.drawnTalents.map(t => `
                        <div class="talent-card grade-${t.grade}"
                             data-action="talent:toggle" data-talent-id="${t.id}">
                            <div class="talent-name">${t.name}</div>
                            <span class="talent-grade">${gradeLabel[t.grade] || '普通'}</span>
                            <div class="talent-desc">${t.description}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="talent-bottom">
                    <div class="talent-count" id="talent-count">已选择 0/3</div>
                    <button class="btn btn-primary btn-disabled" id="talent-confirm-btn" data-action="talent:confirm">确认选择</button>
                </div>
            </div>
        `;
    },

    toggle(target) {
        const id = parseInt(target.dataset.talentId, 10);
        const idx = this.selectedTalents.indexOf(id);
        const card = target.closest('.talent-card');

        if (idx >= 0) {
            // 取消选择
            this.selectedTalents.splice(idx, 1);
            if (card) card.classList.remove('selected');
        } else if (this.selectedTalents.length < 3) {
            // 选择
            this.selectedTalents.push(id);
            if (card) card.classList.add('selected');
        }

        // 更新UI
        document.getElementById('talent-count').textContent = `已选择 ${this.selectedTalents.length}/3`;
        const confirmBtn = document.getElementById('talent-confirm-btn');
        if (this.selectedTalents.length >= 1) {
            confirmBtn.classList.remove('btn-disabled');
        } else {
            confirmBtn.classList.add('btn-disabled');
        }
    },

    confirm() {
        if (this.selectedTalents.length === 0) return;

        // 保存选中的天赋对象
        const selected = this.drawnTalents.filter(t => this.selectedTalents.includes(t.id));
        App.gameConfig.talents = selected;
        App.goTo('attribute');
    }
};

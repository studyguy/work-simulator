/**
 * 学历选择 UI
 * 精简版，默认为"普通本科计算机"
 */
const EducationUI = {
    selected: 'normal_cs',

    render() {
        return `
            <div id="education-page" class="page active">
                <div class="attr-header">
                    <h2>选择你的学历背景</h2>
                    <p>学历会影响你的初始属性和职场起点</p>
                </div>
                <div class="attr-list" style="padding: 0 10px;">
                    ${this.getOptions().map(opt => `
                        <div class="talent-card ${this.selected === opt.id ? 'selected' : ''}"
                             data-action="education:select" data-edu-id="${opt.id}"
                             style="margin-bottom: 8px; cursor: pointer;">
                            <div class="talent-name">${opt.name}</div>
                            <div class="talent-desc">${opt.desc}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="attr-bottom">
                    <button class="btn btn-primary" data-action="education:confirm">下一步</button>
                </div>
            </div>
        `;
    },

    getOptions() {
        return [
            { id: 'top_cs', name: '🎓 985/211 计算机', desc: 'COD+2，家境-1。科班王牌，起点高但学费贵' },
            { id: 'normal_cs', name: '📚 普通本科计算机', desc: 'COD+1。还行吧，够用了' },
            { id: 'top_other', name: '🎭 985/211 非计算机', desc: 'COM+1。转行选手，全靠自学' },
            { id: 'normal_other', name: '📖 普通本科非计算机', desc: '无加成。包装一下也能干' },
            { id: 'college', name: '🔧 专科', desc: 'COM-1，但有概率触发逆袭事件。英雄不问出处' },
            { id: 'dropout', name: '💪 辍学', desc: 'HAP+2，初始求职难度+30%。比尔盖茨也是辍学的！' },
        ];
    },

    select(target) {
        const id = target.dataset.eduId;
        this.selected = id;
        // 切换选中状态
        document.querySelectorAll('#education-page .talent-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.eduId === id);
        });
    },

    confirm() {
        const bonuses = {
            top_cs: { COD: 2, FAM: -1 },
            normal_cs: { COD: 1 },
            top_other: { COM: 1 },
            normal_other: {},
            college: { COM: -1 },
            dropout: { HAP: 2 }
        };
        App.gameConfig.education = this.selected;
        App.gameConfig.educationBonuses = bonuses[this.selected] || {};
        App.goTo('talent');
    }
};

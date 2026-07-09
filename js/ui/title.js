/**
 * 标题页 UI
 */
const TitleUI = {
    render() {
        const stats = Util.loadData('work_sim_global', { plays: 0, achievements: [] });
        const savedData = Util.loadData('work_sim_save');
        const continueBtn = savedData ? `
            <button class="btn btn-continue" data-action="app:continueGame" style="margin-bottom: 12px;">
                📂 继续打工（${savedData.prop.AGE}岁 Lv.${savedData.prop.LVL}）
            </button>
        ` : '';
        const achCount = stats.achievements ? stats.achievements.length : 0;
        return `
            <div id="title-page" class="page active">
                <div class="title-logo">打工模拟器</div>
                <div class="title-subtitle" id="title-quote">${Util.randomQuote()}</div>
                ${continueBtn}
                <button class="btn btn-primary" data-action="app:goTo" data-page="education">开始打工</button>
                <div class="title-stats">
                    已打工 ${stats.plays} 次
                    ${achCount > 0 ? ` | 🏆 成就 ${achCount}/${ACHIEVEMENTS.length}` : ''}
                </div>
            </div>
        `;
    },

    onEnter() {
        document.getElementById('title-quote').textContent = Util.randomQuote();
    }
};

/**
 * 结局总结 UI
 */
const SummaryUI = {
    render() {
        const result = App.gameResult || { type: 'unknown', title: '💀 未知结局', desc: '你的打工生涯结束了。' };
        const p = life.prop;

        // 结局评语
        const quotes = [
            `你一共打了 ${life.prop.totalWorkYears} 年工，换了 ${life.prop.jobChanges} 家公司，被裁员 ${life.prop.laidOff} 次。你的人生座右铭是："能活着就行。"`,
            `你的最高月薪达到了 ${Util.formatMoney(p.maxSalary)}，但你的快乐值从来没超过 3。值得吗？值得，因为穷更不快乐。`,
            `你的发际线在 ${p.AGE - Math.floor((10 - p.HRL) * 3)} 岁时就放弃了抵抗。但它给你换来了技术总监的职位。这交易划算吗？你照了照镜子。`,
            `你一共加了不知道多少小时的班。如果把加班费换成时薪，你的工资其实和肯德基小时工差不多。`,
            `你最后的存款是 ${Util.formatMoney(p.MNY)}。但你花了 ${Util.formatMoney(Math.floor(p.maxMoney * 0.3))} 治病。剩下的钱，你打算买个舒服的轮椅。`,
        ];

        return `
            <div id="summary-page" class="page active">
                <div class="summary-title">👋 你的打工生涯结束了</div>
                <div class="summary-end-title">${result.title || '结局'}</div>
                <div class="summary-end-desc">${result.desc || ''}</div>

                <div class="summary-card">
                    <div class="summary-stats">
                        <div class="summary-stat-item">最终年龄：<span>${p.AGE}岁</span></div>
                        <div class="summary-stat-item">最高月薪：<span>${Util.formatMoney(p.maxSalary)}</span></div>
                        <div class="summary-stat-item">最终等级：<span>Lv.${p.LVL}</span></div>
                        <div class="summary-stat-item">总存款：<span>${Util.formatMoney(p.MNY)}</span></div>
                        <div class="summary-stat-item">编程能力：<span>${p.COD}</span></div>
                        <div class="summary-stat-item">沟通能力：<span>${p.COM}</span></div>
                        <div class="summary-stat-item">打工年数：<span>${p.totalWorkYears}年</span></div>
                        <div class="summary-stat-item">被裁员：<span>${p.laidOff}次</span></div>
                    </div>
                    <div class="summary-quote">
                        ${quotes[Math.floor(Math.random() * quotes.length)]}
                    </div>
                </div>

                <div class="summary-actions">
                    <button class="btn btn-primary" data-action="app:restart">再来一次 🔄</button>
                    <button class="btn" data-action="summary:share">分享结果 📤</button>
                    <button class="btn" data-action="app:goTo" data-page="title">返回首页 🏠</button>
                </div>
            </div>
        `;
    },

    onEnter() {
        // 保存成就到全局
        const stats = Util.loadData('work_sim_global', { plays: 0, achievements: [] });
        stats.lastResult = {
            age: life.prop.AGE,
            level: life.prop.LVL,
            money: life.prop.MNY,
            maxSalary: life.prop.maxSalary,
            endTitle: (App.gameResult || {}).title
        };
        Util.saveData('work_sim_global', stats);
    },

    share() {
        const text = Util.generateShareText({
            age: life.prop.AGE,
            level: `Lv.${life.prop.LVL}`,
            maxSalary: life.prop.maxSalary,
            money: life.prop.MNY,
            jobChanges: life.prop.jobChanges,
            laidOff: life.prop.laidOff
        });
        // 尝试 Web Share API
        if (navigator.share) {
            navigator.share({ title: '打工模拟器', text }).catch(() => {
                this.fallbackShare(text);
            });
        } else {
            this.fallbackShare(text);
        }
    },

    fallbackShare(text) {
        // 复制到剪贴板
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                alert('结果已复制到剪贴板，快去分享吧！');
            }).catch(() => {
                prompt('复制以下内容分享：', text);
            });
        } else {
            prompt('复制以下内容分享：', text);
        }
    }
};

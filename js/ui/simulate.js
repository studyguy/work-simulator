/**
 * 职场模拟主界面 UI
 */
const SimulateUI = {
    isTyping: false,
    currentYearData: null,
    eventQueue: [],

    render() {
        return `
            <div id="simulate-page" class="page active">
                <div class="sim-header">
                    <div class="sim-stat">
                        <span class="sim-stat-label">年龄 </span>
                        <span class="sim-stat-value" id="sim-age">22</span>
                    </div>
                    <div class="sim-stat">
                        <span class="sim-stat-label">等级 </span>
                        <span class="sim-stat-value level" id="sim-level">Lv.1</span>
                    </div>
                    <div class="sim-stat">
                        <span class="sim-stat-label">💰 </span>
                        <span class="sim-stat-value money" id="sim-money">5,000</span>
                    </div>
                    <div class="sim-stat">
                        <span class="sim-stat-label">月薪 </span>
                        <span class="sim-stat-value" id="sim-salary">3,000</span>
                    </div>
                    <div class="sim-stat">
                        <span class="sim-stat-label">😊 </span>
                        <span class="sim-stat-value happy" id="sim-happy">5</span>
                    </div>
                </div>
                <div class="sim-body" id="sim-body">
                    <div class="sim-year-badge">🎬 职场生涯开始</div>
                    <div class="sim-event-block">
                        <div class="sim-event-text">你 22 岁了，大学毕业，踏入了职场。</div>
                        <div class="sim-event-text" style="margin-top: 8px; color: var(--text-secondary);">
                            你看着写字楼的大门，深吸一口气。\n你知道，从今天开始，你就是一个打工人了。
                        </div>
                    </div>
                </div>
                <div class="sim-bottom">
                    <button class="btn btn-small" data-action="simulate:showStatus">📊 状态</button>
                    <button class="btn btn-small" data-action="simulate:saveGame">💾 保存</button>
                    <button class="btn btn-primary" id="sim-next-btn" data-action="simulate:nextYear">下一年 ▶</button>
                </div>
            </div>

            <!-- 属性详情弹窗 -->
            <div class="modal-overlay" id="status-modal">
                <div class="modal-content">
                    <div class="modal-title">📊 当前状态</div>
                    <div id="status-content"></div>
                    <div class="modal-close">
                        <button class="btn btn-small" data-action="simulate:closeStatus">关闭</button>
                    </div>
                </div>
            </div>
        `;
    },

    onEnter() {
        this.isTyping = false;
        this.currentYearData = null;
        this.eventQueue = [];

        // 设置 Life 回调
        life.onUpdate = (data) => this.onLifeUpdate(data);
        life.onEnd = (result) => this.onLifeEnd(result);

        // 设置成就回调
        life.achievementSystem.onUnlock = (ach) => this.showAchievement(ach);

        // 加载事件数据
        life.eventSystem.loadEvents(EVENTS_DATA);
        life.talentSystem.loadTalents(TALENTS_DATA);

        // 检查是否从存档继续
        if (life.load()) {
            // 读取存档后，重建模拟界面
            const body = document.getElementById('sim-body');
            body.innerHTML = '';
            const yearBadge = document.createElement('div');
            yearBadge.className = 'sim-year-badge';
            yearBadge.textContent = `📂 存档已加载 - 你 ${life.prop.AGE} 岁`;
            body.appendChild(yearBadge);
            const infoBlock = document.createElement('div');
            infoBlock.className = 'sim-event-block';
            infoBlock.innerHTML = `<div class="sim-event-text">欢迎回来！<br>你 ${life.prop.AGE} 岁，存款 ${Util.formatMoney(life.prop.MNY)}，等级 Lv.${life.prop.LVL}</div>`;
            body.appendChild(infoBlock);
            this.updateHeader();
            document.getElementById('sim-next-btn').textContent = '下一年 ▶';
            document.getElementById('sim-next-btn').disabled = false;
            return;
        }

        // 开始游戏
        life.init({
            cod: App.gameConfig.attributes.COD,
            com: App.gameConfig.attributes.COM,
            sta: App.gameConfig.attributes.STA,
            fam: App.gameConfig.attributes.FAM,
            talents: App.gameConfig.talents
        });

        // 更新状态栏
        this.updateHeader();

        // 开始
        life.start();
    },

    updateHeader() {
        const p = life.prop;
        document.getElementById('sim-age').textContent = p.AGE;
        document.getElementById('sim-level').textContent = `Lv.${p.LVL} ${this.getLevelTitle(p.LVL)}`;
        document.getElementById('sim-money').textContent = Util.formatMoney(p.MNY);
        document.getElementById('sim-salary').textContent = Util.formatMoney(p.SAL);
        document.getElementById('sim-happy').textContent = '😊'.repeat(p.HAP) + '😢'.repeat(Math.max(0, 5 - p.HAP));
    },

    getLevelTitle(level) {
        const data = life.getLevelData(level);
        return data ? data.title : '';
    },

    typeText(element, text, speed = 40) {
        return new Promise((resolve) => {
            element.innerHTML = '';
            let currentHTML = '';
            const chars = [...text];
            let i = 0;

            const escapeHtml = (char) => {
                const map = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' };
                return map[char] || char;
            };

            const typeNext = () => {
                if (i >= chars.length) {
                    resolve();
                    return;
                }

                const char = chars[i];
                i++;

                if (char === '\n') {
                    currentHTML += '<br>';
                    element.innerHTML = currentHTML;
                    setTimeout(typeNext, speed);
                } else {
                    currentHTML += escapeHtml(char);
                    element.innerHTML = currentHTML;
                    setTimeout(typeNext, speed);
                }
            };

            typeNext();
        });
    },

    setMoodClass(hap) {
        const body = document.getElementById('sim-body');
        body.classList.remove('mood-happy', 'mood-sad');
        if (hap >= 7) {
            body.classList.add('mood-happy');
        } else if (hap <= 2) {
            body.classList.add('mood-sad');
        }
    },

    async onLifeUpdate(data) {
        const body = document.getElementById('sim-body');
        this.currentYearData = data;
        const nextBtn = document.getElementById('sim-next-btn');
        nextBtn.disabled = true;

        // 设置情绪背景
        this.setMoodClass(life.prop.HAP);

        // 年份徽章
        const yearBadge = document.createElement('div');
        yearBadge.className = 'sim-year-badge';
        yearBadge.textContent = `📅 你 ${data.year} 岁了`;
        body.appendChild(yearBadge);

        // 经济摘要
        if (data.economy) {
            const eco = data.economy;
            let ecoText = `月收入 ${Util.formatMoney(eco.income)} | 月支出 ${Util.formatMoney(eco.expense)}`;
            if (eco.salaryRaise > 0) {
                ecoText += ` | 💰 加薪 +${Util.formatMoney(eco.salaryRaise)}`;
            }
            const ecoBlock = document.createElement('div');
            ecoBlock.className = 'sim-year-summary';
            ecoBlock.textContent = ecoText;
            body.appendChild(ecoBlock);
        }

        // 特殊日志
        if (data.specialLogs && data.specialLogs.length > 0) {
            for (const log of data.specialLogs) {
                const logEl = document.createElement('div');
                logEl.className = 'sim-special-log';
                logEl.textContent = log;
                body.appendChild(logEl);
            }
        }

        // 收集打字任务
        const typeTasks = [];

        // 主事件
        if (data.events && data.events.length > 0) {
            for (const evt of data.events) {
                const block = document.createElement('div');
                block.className = 'sim-event-block';

                const textEl = document.createElement('div');
                textEl.className = 'sim-event-text';
                block.appendChild(textEl);

                const text = evt.event ? evt.event.event || '' : (evt.talent ? `✨ 天赋【${evt.talent.name}】触发` : '');
                if (text) {
                    typeTasks.push({ element: textEl, text });
                }

                // 变化显示
                if (evt.changes && evt.changes.length > 0) {
                    const changeText = evt.changes.map(c => c.desc).join('，');
                    const changeEl = document.createElement('div');
                    changeEl.className = 'sim-event-change';
                    // 判断是否有负面变化
                    const hasNegative = evt.changes.some(c => c.value < 0);
                    if (hasNegative) changeEl.classList.add('negative');
                    block.appendChild(changeEl);
                    if (changeText) {
                        typeTasks.push({ element: changeEl, text: changeText });
                    }
                }

                body.appendChild(block);
            }
        }

        // 更新顶部状态栏
        this.updateHeader();

        // 滚动到底部
        body.scrollTop = body.scrollHeight;

        // 逐字输出打字动画
        for (const task of typeTasks) {
            await this.typeText(task.element, task.text);
            body.scrollTop = body.scrollHeight;
        }

        // 打字完成，启用按钮
        nextBtn.textContent = '下一年 ▶';
        nextBtn.disabled = false;
    },

    onLifeEnd(result) {
        App.gameResult = result;
        // 更新全局统计
        const stats = Util.loadData('work_sim_global', { plays: 0, achievements: [] });
        stats.plays = (stats.plays || 0) + 1;
        // 合并成就
        const currentAch = life.achievementSystem.serialize();
        const existingAch = new Set(stats.achievements || []);
        currentAch.forEach(id => existingAch.add(id));
        stats.achievements = [...existingAch];
        Util.saveData('work_sim_global', stats);

        // 保存结果到存档
        Util.saveData('work_sim_last_result', {
            result,
            prop: life.prop.serialize(),
            talents: life.talentSystem.getTalentNames(),
            timestamp: Date.now()
        });

        // 跳转到结局
        App.goTo('summary');
    },

    nextYear() {
        const btn = document.getElementById('sim-next-btn');
        btn.disabled = true;
        btn.textContent = '加载中...';

        // 添加闪烁效果
        const flash = document.createElement('div');
        flash.className = 'flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 300);

        setTimeout(() => {
            const result = life.nextYear();
            if (result === null && life.isRunning === false) {
                // game ended, already handled by callback
            }
        }, 200);
    },

    showStatus() {
        const modal = document.getElementById('status-modal');
        const content = document.getElementById('status-content');
        const p = life.prop;

        const levelData = life.getLevelData(p.LVL);
        const levelTitle = levelData ? levelData.title : '未知';

        const historyHtml = life.prop.eventHistory && life.prop.eventHistory.length > 0 ? `
    <hr style="border-color: var(--border-color); margin: 8px 0;">
    <p style="color: var(--accent-orange); font-weight: bold; margin-bottom: 4px;">📜 生涯回顾</p>
    <div style="font-size: 0.75rem; line-height: 1.8; max-height: 150px; overflow-y: auto;">
        ${life.prop.eventHistory.slice().reverse().map(h => {
            const icon = h.type === 'promotion' ? '🎉' : '📌';
            return `<div>${icon} ${h.age}岁: ${h.summary}</div>`;
        }).join('')}
    </div>
` : '';

        content.innerHTML = `
            <div style="font-size: 0.85rem; line-height: 2;">
                <p>👤 年龄：${p.AGE} 岁</p>
                <p>💼 职场等级：Lv.${p.LVL} ${levelTitle}</p>
                <p>💻 编程能力：${'█'.repeat(p.COD)}${'░'.repeat(10 - p.COD)} ${p.COD}/10</p>
                <p>🗣️ 沟通能力：${'█'.repeat(p.COM)}${'░'.repeat(10 - p.COM)} ${p.COM}/10</p>
                <p>💪 体力精力：${'█'.repeat(p.STA)}${'░'.repeat(10 - p.STA)} ${p.STA}/10</p>
                <p>🏠 家境背景：${'█'.repeat(p.FAM)}${'░'.repeat(10 - p.FAM)} ${p.FAM}/10</p>
                <p>😊 快乐值：${'█'.repeat(p.HAP)}${'░'.repeat(10 - p.HAP)} ${p.HAP}/10</p>
                <p>💇 发际线：${'█'.repeat(p.HRL)}${'░'.repeat(10 - p.HRL)} ${p.HRL}/10</p>
                <hr style="border-color: var(--border-color); margin: 8px 0;">
                <p>💰 存款：${Util.formatMoney(p.MNY)}</p>
                <p>💵 月薪：${Util.formatMoney(p.SAL)}</p>
                <p>🏆 最高月薪：${Util.formatMoney(p.maxSalary)}</p>
                <p>🏢 换过公司：${p.jobChanges} 次</p>
                <p>📋 被裁员：${p.laidOff} 次</p>
                <hr style="border-color: var(--border-color); margin: 8px 0;">
                <p>🎯 天赋：${life.talentSystem.getTalentNames().join('、') || '无'}</p>
                <p style="font-size: 0.75rem; color: var(--text-dim); margin-top: 8px;">
                    已触发事件：${life.eventSystem.getTriggeredCount()}/${life.eventSystem.getTotalCount()}
                </p>
                ${historyHtml}
            </div>
        `;
        modal.classList.add('active');
    },

    closeStatus() {
        document.getElementById('status-modal').classList.remove('active');
    },

    showAchievement(ach) {
        // 创建成就弹出提示
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.innerHTML = `
            <div class="achievement-toast-icon">${ach.icon}</div>
            <div class="achievement-toast-content">
                <div class="achievement-toast-title">成就解锁!</div>
                <div class="achievement-toast-name">${ach.name}</div>
                <div class="achievement-toast-desc">${ach.desc}</div>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('achievement-toast-show');
        }, 10);
        setTimeout(() => {
            toast.classList.remove('achievement-toast-show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    saveGame() {
        life.save();
        const btn = document.querySelector('[data-action="simulate:saveGame"]');
        const originalText = btn.textContent;
        btn.textContent = '✅ 已保存';
        setTimeout(() => { btn.textContent = originalText; }, 1500);
    },

    loadGame() {
        const success = life.load();
        if (!success) {
            alert('没有找到存档或存档已损坏');
            return;
        }
        // 重新渲染模拟界面
        const body = document.getElementById('sim-body');
        body.innerHTML = '';

        const yearBadge = document.createElement('div');
        yearBadge.className = 'sim-year-badge';
        yearBadge.textContent = `📂 读取存档 - 你 ${life.prop.AGE} 岁`;
        body.appendChild(yearBadge);

        const infoBlock = document.createElement('div');
        infoBlock.className = 'sim-event-block';
        infoBlock.innerHTML = `<div class="sim-event-text">存档已读取！<br>回到 ${life.prop.AGE} 岁，存款 ${Util.formatMoney(life.prop.MNY)}，等级 Lv.${life.prop.LVL}</div>`;
        body.appendChild(infoBlock);

        this.updateHeader();

        document.getElementById('sim-next-btn').textContent = '下一年 ▶';
        document.getElementById('sim-next-btn').disabled = false;
    }
};

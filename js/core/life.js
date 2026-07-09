/**
 * 生命周期控制（核心循环）
 */
class Life {
    constructor() {
        this.prop = new Property();
        this.eventSystem = new EventSystem();
        this.talentSystem = new TalentSystem();
        this.economy = new Economy();
        this.achievementSystem = new AchievementSystem();

        this.isRunning = false;
        this.yearEvents = [];       // 当前年份的事件序列
        this.currentEventIndex = 0;
        this.specialLogs = [];      // 特殊日志

        // 回调
        this.onUpdate = null;       // UI 更新回调
        this.onEnd = null;          // 游戏结束回调
    }

    /**
     * 重置所有系统（用于重新开始）
     */
    reset() {
        this.prop.reset();
        this.eventSystem.reset();
        this.talentSystem.reset();
        this.economy.reset();
        this.achievementSystem = new AchievementSystem();
        this.yearEvents = [];
        this.currentEventIndex = 0;
        this.specialLogs = [];
        this.isRunning = false;
    }

    /**
     * 初始化游戏
     * @param {Object} config - { talents: [天赋列表], cod, com, sta, fam }
     */
    init(config) {
        this.reset();
        this.yearEvents = [];
        this.currentEventIndex = 0;
        this.specialLogs = [];
        this.isRunning = false;

        // 设置属性
        this.prop.COD = config.cod || 3;
        this.prop.COM = config.com || 3;
        this.prop.STA = config.sta || 3;
        this.prop.FAM = config.fam || 3;

        // 设置天赋
        this.talentSystem.selectTalents(config.talents || []);

        // 应用天赋加成
        const talentEffects = this.talentSystem.getTalentEffects();
        this.prop.applyEffects(talentEffects);

        // 应用天赋额外分配点
        const statusBonus = this.talentSystem.getStatusBonus();
        if (statusBonus > 0) {
            // 随机分配额外点数
            const props = ['COD', 'COM', 'STA', 'FAM'];
            for (let i = 0; i < statusBonus; i++) {
                const key = props[Math.floor(Math.random() * props.length)];
                this.prop[key] = Util.clamp(this.prop[key] + 1, 0, 10);
            }
        }

        // 初始化月薪
        this.prop.SAL = this.getLevelData(this.prop.LVL).salaryRange[0] || 3000;
        this.prop.maxSalary = this.prop.SAL;

        // 保存天赋列表到属性
        this.prop.talents = this.talentSystem.getTalentNames();
    }

    /**
     * 开始游戏
     */
    start() {
        this.isRunning = true;
        // 执行第一年
        return this.processYear();
    }

    /**
     * 推进到下一年
     */
    nextYear() {
        if (!this.isRunning) return null;
        this.prop.AGE++;

        // 检查是否结束
        const endCheck = this.checkEnd();
        if (endCheck) {
            this.isRunning = false;
            if (this.onEnd) this.onEnd(endCheck);
            return null;
        }

        return this.processYear();
    }

    /**
     * 处理一年的模拟
     * 每岁触发：1个主事件 + 可能的经济事件 + 天赋触发
     */
    processYear() {
        if (!this.isRunning) return null;

        this.yearEvents = [];
        this.currentEventIndex = 0;
        this.specialLogs = [];

        // 1. 经济模拟
        const economyResult = this.economy.simulateYear(this.prop, this.talentSystem.selectedTalents);
        if (economyResult.special) {
            this.specialLogs.push(economyResult.special);
        }
        if (economyResult.salaryRaise > 0) {
            this.specialLogs.push(`涨薪了！月薪 +${economyResult.salaryRaise}，当前 ${Util.formatMoney(this.prop.SAL)}`);
        }
        if (economyResult.windfall) {
            this.specialLogs.push(economyResult.special);
        }
        if (economyResult.suddenCost) {
            this.specialLogs.push(economyResult.special);
        }

        // 2. 检查升职
        const nextLevel = this.prop.LVL + 1;
        const nextLevelData = this.getLevelData(nextLevel);
        if (nextLevelData && this.prop.canPromote(nextLevelData)) {
            // 随机概率升职
            const promoteChance = 0.3 + (this.prop.COM * 0.05);
            if (Math.random() < promoteChance) {
                this.prop.LVL = nextLevel;
                const newSalary = Util.randomInt(nextLevelData.salaryRange[0], nextLevelData.salaryRange[1]);
                const raise = newSalary - this.prop.SAL;
                this.prop.SAL = newSalary;
                if (this.prop.SAL > this.prop.maxSalary) {
                    this.prop.maxSalary = this.prop.SAL;
                }
                this.specialLogs.push(`🎉 升职了！晋升为 ${nextLevelData.title}，月薪 +${Util.formatMoney(raise)}`);
            }
        }

        // 3. 抽取主事件
        const mainEvent = this.eventSystem.pickEvent(this.prop);
        if (mainEvent) {
            // 应用事件效果
            const changes = this.prop.applyEffects(mainEvent.effect);
            this.yearEvents.push({
                type: 'main',
                event: mainEvent,
                changes
            });

            // 检查分支事件
            const branchEvent = this.eventSystem.checkBranch(mainEvent, this.prop);
            if (branchEvent) {
                const branchChanges = this.prop.applyEffects(branchEvent.effect);
                this.yearEvents.push({
                    type: 'branch',
                    event: branchEvent,
                    changes: branchChanges
                });
            }
        }

        // 4. 检查天赋触发
        const triggeredTalents = this.talentSystem.checkTrigger(this.prop);
        for (const talent of triggeredTalents) {
            const talentChanges = this.prop.applyEffects(talent.effect);
            this.yearEvents.push({
                type: 'talent',
                talent,
                changes: talentChanges
            });
        }

        // 5. 快乐值衰减（打工就是累）
        if (this.prop.HAP > 0 && Math.random() < 0.3) {
            this.prop.HAP = Math.max(0, this.prop.HAP - 1);
        }

        // 6. 发际线变化（年龄越大越秃）
        if (this.prop.HRL > 0 && this.prop.AGE > 30 && Math.random() < 0.1) {
            this.prop.HRL = Math.max(0, this.prop.HRL - 1);
            this.specialLogs.push(`你的发际线后退了...（当前 ${this.prop.HRL}/10）`);
        }

        // 7. 记录工作时间
        this.prop.totalWorkYears++;

        // 8. 检查成就
        this.achievementSystem.check(this.prop);

        // 9. 记录关键事件到历史
        if (this.yearEvents.length > 0) {
            const mainEvent = this.yearEvents.find(e => e.type === 'main');
            if (mainEvent && mainEvent.event) {
                const eventText = mainEvent.event.event || '';
                const summary = eventText.split('\\n')[0].substring(0, 40) + (eventText.length > 40 ? '...' : '');
                this.prop.eventHistory.push({
                    age: this.prop.AGE,
                    type: 'event',
                    summary: summary
                });
            }
        }
        // 记录特殊事件（升职等）
        for (const log of this.specialLogs) {
            if (log.includes('升职')) {
                this.prop.eventHistory.push({
                    age: this.prop.AGE,
                    type: 'promotion',
                    summary: log.substring(0, 40)
                });
            }
        }

        // 调用更新回调
        if (this.onUpdate) {
            this.onUpdate({
                year: this.prop.AGE,
                events: this.yearEvents,
                specialLogs: this.specialLogs,
                prop: this.prop.getSummary(),
                economy: economyResult
            });
        }

        return {
            year: this.prop.AGE,
            events: this.yearEvents,
            specialLogs: this.specialLogs,
            prop: this.prop.getSummary(),
            economy: economyResult
        };
    }

    /**
     * 检查游戏是否应结束
     * @returns {Object|null} 结局对象或 null
     */
    checkEnd() {
        const p = this.prop;

        // 财务自由：存款 > 500w
        if (p.MNY >= 5000000) {
            return { type: 'rich', title: '🏆 财务自由', desc: '你终于实现了财务自由，从此过上不被 KPI 支配的生活！' };
        }

        // 正常退休：年龄 >= 65
        if (p.AGE >= 65) {
            return { type: 'retire', title: '🎂 正常退休', desc: '你光荣退休了，领到了人生第一笔养老金。' };
        }

        // 快乐值归零
        if (p.HAP <= 0) {
            if (Math.random() < 0.3) {
                return { type: 'quit', title: '🏠 躺平人生', desc: '你受够了！你删掉了所有招聘软件，回老家考了公务员。' };
            }
        }

        // 存款为负且连续低快乐
        if (p.MNY <= 0 && p.HAP <= 2 && p.AGE > 30) {
            return { type: 'crisis', title: '😢 中年危机', desc: '你被优化了，发现招聘市场已经不需要 ' + p.AGE + ' 岁的程序员。' };
        }

        // 发际线归零
        if (p.HRL <= 0) {
            return { type: 'monk', title: '🧠 出家修行', desc: '你看着镜子里锃亮的脑门，决定遁入空门。' };
        }

        // 职场成神
        if (p.LVL >= 10) {
            return { type: 'god', title: '🎭 职场成神', desc: '你成为了职场传说中的男人/女人，所有猎头都以联系到你为荣。' };
        }

        return null;
    }

    /**
     * 获取等级数据
     */
    getLevelData(level) {
        return LEVELS[level];
    }

    /**
     * 强制结束游戏（特殊事件触发）
     */
    forceEnd(type) {
        this.isRunning = false;
        const endings = {
            'fire': { type: 'fire', title: '💼 被裁员', desc: '公司裁员，你光荣地拿到了 N+1 补偿。' },
            'startup': { type: 'startup', title: '🚀 创业成功', desc: '你辞去了工作，创办了自己的公司。然后发现当老板比打工还累。' },
        };
        const result = endings[type] || { type: 'unknown', title: '💀 未知结局', desc: '你的打工生涯以一种意想不到的方式结束了。' };
        if (this.onEnd) this.onEnd(result);
        return result;
    }

    /**
     * 保存游戏
     */
    save() {
        const data = {
            prop: this.prop.serialize(),
            economy: {
                rent: this.economy.rent,
                expenseRate: this.economy.expenseRate
            },
            triggeredEvents: this.eventSystem.triggeredEvents,
            talentIds: this.talentSystem.selectedTalents.map(t => t.id),
            unlockedAchievements: this.achievementSystem.serialize(),
            timestamp: Date.now()
        };
        Util.saveData('work_sim_save', data);
        return true;
    }

    /**
     * 读取存档
     */
    load() {
        const data = Util.loadData('work_sim_save');
        if (!data) return false;

        this.prop.load(data.prop);
        this.economy.rent = data.economy.rent;
        this.economy.expenseRate = data.economy.expenseRate;
        this.eventSystem.triggeredEvents = data.triggeredEvents || [];

        // 恢复选中的天赋
        const talents = data.talentIds.map(id => this.talentSystem.getTalentById(id)).filter(Boolean);
        this.talentSystem.selectedTalents = talents;
        this.prop.talents = this.talentSystem.getTalentNames();

        // 恢复成就
        this.achievementSystem.load(data.unlockedAchievements);

        this.isRunning = true;
        return true;
    }
}

// 全局实例
const life = new Life();

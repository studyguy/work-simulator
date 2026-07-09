/**
 * 成就系统模块
 */
const ACHIEVEMENTS = [
    { id: 'first_year', name: '初次打工', desc: '完成职场第一年', icon: '🎯', check: (p) => p.totalWorkYears >= 1 },
    { id: 'fired', name: '被裁达人', desc: '体验被裁员的滋味', icon: '💼', check: (p) => p.laidOff >= 1 },
    { id: 'salary_10k', name: '月薪破万', desc: '月薪达到 10,000', icon: '💰', check: (p) => p.maxSalary >= 10000 },
    { id: 'salary_50k', name: '高薪人士', desc: '月薪达到 50,000', icon: '💎', check: (p) => p.maxSalary >= 50000 },
    { id: 'rich', name: '财务自由', desc: '存款达到 500 万', icon: '🏆', check: (p) => p.MNY >= 5000000 },
    { id: 'hair_loss', name: '发际线危机', desc: '发际线降至 3 以下', icon: '💇', check: (p) => p.HRL <= 3 },
    { id: 'veteran', name: '职场老兵', desc: '累计打工 30 年', icon: '👴', check: (p) => p.totalWorkYears >= 30 },
    { id: 'jumper', name: '跳槽达人', desc: '换过 3 家公司', icon: '🦘', check: (p) => p.jobChanges >= 3 },
    { id: 'loyal', name: '十年老员工', desc: '累计打工 10 年', icon: '⏰', check: (p) => p.totalWorkYears >= 10 },
    { id: 'ceo', name: 'CEO 之路', desc: '职场等级达到 Lv.8', icon: '👑', check: (p) => p.LVL >= 8 },
    { id: 'bald_king', name: '秃头强者', desc: '发际线归零且编程能力 8+', icon: '🦅', check: (p) => p.HRL <= 0 && p.COD >= 8 },
    { id: 'workaholic', name: '卷王之王', desc: '体力 8+ 且编程能力 8+', icon: '⚡', check: (p) => p.STA >= 8 && p.COD >= 8 },
    { id: 'sad_clown', name: '人间不值得', desc: '快乐值归零', icon: '😢', check: (p) => p.HAP <= 0 },
    { id: 'moonlight', name: '月光一族', desc: '存款低于 100', icon: '🌙', check: (p) => p.MNY < 100 && p.totalWorkYears > 1 },
];

class AchievementSystem {
    constructor() {
        this.unlockedIds = [];
        this.pendingUnlocks = [];
        this.onUnlock = null;
    }

    load(unlockedIds) {
        this.unlockedIds = unlockedIds || [];
    }

    check(prop) {
        const newlyUnlocked = [];
        for (const ach of ACHIEVEMENTS) {
            if (this.unlockedIds.includes(ach.id)) continue;
            if (ach.check(prop)) {
                this.unlockedIds.push(ach.id);
                newlyUnlocked.push(ach);
            }
        }
        if (newlyUnlocked.length > 0 && this.onUnlock) {
            for (const ach of newlyUnlocked) {
                this.onUnlock(ach);
            }
        }
        return newlyUnlocked;
    }

    getUnlocked() {
        return ACHIEVEMENTS.filter(a => this.unlockedIds.includes(a.id));
    }

    getProgress() {
        return {
            unlocked: this.unlockedIds.length,
            total: ACHIEVEMENTS.length
        };
    }

    serialize() {
        return [...this.unlockedIds];
    }
}

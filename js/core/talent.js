/**
 * 天赋系统模块
 */
class TalentSystem {
    constructor() {
        this.allTalents = [];
        this.selectedTalents = []; // 当前选中的天赋
    }

    /**
     * 加载天赋数据
     */
    loadTalents(talentData) {
        this.allTalents = talentData || [];
    }

    /**
     * 抽取天赋（10选3）
     * @param {number} totalPicks - 展示数量（默认10）
     * @param {number} selectCount - 可选数量（默认3）
     * @returns {Array} 抽取的天赋列表
     */
    drawTalents(totalPicks = 10, selectCount = 3) {
        if (this.allTalents.length === 0) return [];

        // 过滤掉独占天赋（如果不适用）
        const pool = this.allTalents.filter(t => !t.exclusive);

        // 按权重随机抽取
        const drawn = [];
        const remaining = [...pool];

        // 使用权重随机抽取
        for (let i = 0; i < totalPicks && remaining.length > 0; i++) {
            const idx = Util.weightedRandom(
                remaining.map((_, i) => i),
                i => {
                    const talent = remaining[i];
                    // 等级权重: 普通3, 稀有1, 传说0.3
                    const gradeWeight = talent.grade === 1 ? 3 : talent.grade === 2 ? 1 : 0.3;
                    return gradeWeight;
                }
            );
            if (idx !== null) {
                drawn.push(remaining[idx]);
                remaining.splice(idx, 1);
            }
        }

        // 打乱顺序展示
        return drawn.sort(() => Math.random() - 0.5);
    }

    /**
     * 选中天赋
     */
    selectTalents(talents) {
        this.selectedTalents = talents;
    }

    /**
     * 获取天赋加成效果（所有选中天赋的effect合并）
     */
    getTalentEffects() {
        const combined = {};
        for (const talent of this.selectedTalents) {
            if (talent.effect) {
                for (const [key, value] of Object.entries(talent.effect)) {
                    combined[key] = (combined[key] || 0) + value;
                }
            }
        }
        return combined;
    }

    /**
     * 获取天赋开局加成（status字段，增加属性分配点数）
     */
    getStatusBonus() {
        let bonus = 0;
        for (const talent of this.selectedTalents) {
            bonus += talent.status || 0;
        }
        return bonus;
    }

    /**
     * 检查天赋触发条件
     * @param {Object} prop - 属性集
     * @returns {Array} 触发事件的天赋列表
     */
    checkTrigger(prop) {
        const triggered = [];
        for (const talent of this.selectedTalents) {
            if (!talent.condition) continue;
            if (Condition.checkAll(talent.condition, prop)) {
                triggered.push(talent);
            }
        }
        return triggered;
    }

    /**
     * 重置
     */
    reset() {
        this.selectedTalents = [];
    }

    /**
     * 获取天赋名称列表
     */
    getTalentNames() {
        return this.selectedTalents.map(t => t.name || t.id);
    }

    /**
     * 通过ID查找天赋
     */
    getTalentById(id) {
        return this.allTalents.find(t => t.id === id);
    }
}

/**
 * 属性系统模块
 */
class Property {
    constructor() {
        this.reset();
    }

    /**
     * 重置所有属性
     */
    reset() {
        // 核心属性（开局分配）
        this.COD = 0;   // 编程能力
        this.COM = 0;   // 沟通能力
        this.STA = 0;   // 体力精力
        this.FAM = 0;   // 家境背景

        // 衍生属性（动态变化）
        this.AGE = 22;  // 当前年龄（从毕业开始）
        this.LVL = 1;   // 职场等级
        this.MNY = 5000; // 存款（初始5000块）
        this.SAL = 3000; // 月薪
        this.HAP = 5;   // 快乐值
        this.HRL = 10;  // 发际线（10=茂密，0=全秃）

        // 隐藏属性
        this._connections = 0; // 人脉值
        this._luck = 0;        // 运气（隐藏随机因子）
        this._badHistory = 0;  // 黑历史

        // 统计
        this.maxSalary = 3000;
        this.maxMoney = 5000;
        this.jobChanges = 0;
        this.laidOff = 0;
        this.totalWorkYears = 0;
        this.eventHistory = [];

        // 天赋列表（存天赋ID）
        this.talents = [];
    }

    /**
     * 从存档恢复属性
     */
    load(data) {
        Object.assign(this, data);
    }

    /**
     * 序列化属性供存档
     */
    serialize() {
        return { ...this };
    }

    /**
     * 获取属性值（用于条件检查）
     */
    get(propName) {
        const map = {
            'COD': this.COD,
            'COM': this.COM,
            'STA': this.STA,
            'FAM': this.FAM,
            'AGE': this.AGE,
            'LVL': this.LVL,
            'MNY': this.MNY,
            'SAL': this.SAL,
            'HAP': this.HAP,
            'HRL': this.HRL,
        };
        return map[propName] !== undefined ? map[propName] : 0;
    }

    /**
     * 执行属性变化
     * @param {Object} effects - { COD: 1, HAP: -2, ... }
     * @returns {Array} 变化的描述列表
     */
    applyEffects(effects) {
        if (!effects) return [];
        const changes = [];
        for (const [key, value] of Object.entries(effects)) {
            const oldVal = this[key];
            if (oldVal === undefined) continue;

            let newVal = oldVal + value;

            // 特殊处理特殊属性
            if (key === 'HRL') {
                // 发际线：0-10
                newVal = Util.clamp(newVal, 0, 10);
                // 发际线越低，编程能力越高（秃头加成）
                const hrlChange = Math.floor((oldVal - newVal) / 2);
                if (hrlChange > 0) {
                    this.COD += hrlChange;
                    changes.push({ key: 'COD', value: hrlChange, desc: `头发少了，编程能力+${hrlChange}` });
                }
            } else if (key === 'MNY') {
                // 存款不能为负
                newVal = Math.max(0, newVal);
            } else if (key === 'HAP') {
                // 快乐值 0-10
                newVal = Util.clamp(newVal, 0, 10);
            } else if (key === 'STA') {
                // 体力 0-10
                newVal = Util.clamp(newVal, 0, 10);
            } else if (key === 'COD' || key === 'COM' || key === 'FAM') {
                // 核心属性 0-10
                newVal = Util.clamp(newVal, 0, 10);
            } else if (key === 'LVL') {
                // 职场等级 1-10
                newVal = Util.clamp(newVal, 1, 10);
            }

            this[key] = newVal;

            // 记录变化
            const diff = newVal - oldVal;
            if (diff !== 0) {
                const sign = diff > 0 ? '+' : '';
                changes.push({ key, value: diff, desc: `${key} ${sign}${diff}` });
            }

            // 更新最高/最低记录
            if (key === 'SAL' && this.SAL > this.maxSalary) {
                this.maxSalary = this.SAL;
            }
            if (key === 'MNY' && this.MNY > this.maxMoney) {
                this.maxMoney = this.MNY;
            }
        }
        return changes;
    }

    /**
     * 检查是否满足升职条件
     * @param {Object} levelData - 等级数据
     * @returns {boolean}
     */
    canPromote(levelData) {
        if (!levelData) return false;
        if (this.AGE < (levelData.minAge || 0)) return false;
        if (this.COD < (levelData.requireCOD || 0) && this.COM < (levelData.requireCOM || 0)) return false;
        return true;
    }

    /**
     * 获取所有属性的摘要（用于UI显示）
     */
    getSummary() {
        return {
            COD: this.COD,
            COM: this.COM,
            STA: this.STA,
            FAM: this.FAM,
            AGE: this.AGE,
            LVL: this.LVL,
            MNY: this.MNY,
            SAL: this.SAL,
            HAP: this.HAP,
            HRL: this.HRL,
        };
    }
}

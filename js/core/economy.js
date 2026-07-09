/**
 * 经济系统模块
 */
class Economy {
    constructor() {
        this.monthlyIncome = 0;
        this.monthlyExpense = 0;
        this.rent = 1500;      // 初始房租
        this.expenseRate = 0.4; // 生活开销占月薪比例
    }

    /**
     * 计算月收入
     * @param {Object} prop - 属性
     * @param {Array} talents - 天赋列表
     */
    calcMonthlyIncome(prop, talents) {
        let income = prop.SAL;

        // 绩效奖金（随机 0-20% 月薪）
        const bonusRate = Util.randomInt(0, 20) / 100;
        income += Math.floor(prop.SAL * bonusRate);

        // 天赋加成：斜杠青年副业收入
        if (talents.some(t => t.tags && t.tags.includes('side_income'))) {
            income += Math.floor(prop.SAL * 0.3);
        }

        this.monthlyIncome = income;
        return income;
    }

    /**
     * 计算月支出
     * @param {Object} prop
     * @param {Array} talents
     */
    calcMonthlyExpense(prop, talents) {
        // 房租
        let expense = this.rent;

        // 生活开销（月薪的 30%-50%）
        const livingCost = Math.floor(prop.SAL * this.expenseRate);
        expense += livingCost;

        // 社交开销
        expense += Math.floor(prop.SAL * 0.05);

        // 天赋：自带杯子 - 省点钱
        if (talents.some(t => t.tags && t.tags.includes('save_cost'))) {
            expense -= 100;
        }

        this.monthlyExpense = Math.max(0, expense);
        return expense;
    }

    /**
     * 计算年度净收入
     */
    calcYearlyNet(prop, talents) {
        const income = this.calcMonthlyIncome(prop, talents);
        const expense = this.calcMonthlyExpense(prop, talents);
        return (income - expense) * 12;
    }

    /**
     * 模拟一年的经济变化
     * @returns {Object} { income, expense, net, changes }
     */
    simulateYear(prop, talents) {
        const monthlyIncome = this.calcMonthlyIncome(prop, talents);
        const monthlyExpense = this.calcMonthlyExpense(prop, talents);
        const netMonthly = monthlyIncome - monthlyExpense;
        const netYearly = netMonthly * 12;

        // 加薪（每年有概率涨薪）
        let salaryRaise = 0;
        if (Math.random() < 0.4) {
            salaryRaise = Util.randomInt(200, 1000);
            prop.SAL += salaryRaise;
        }

        // 房租上涨（每年涨 100-300）
        const rentRaise = Util.randomInt(100, 300);
        this.rent += rentRaise;

        // 存款变化
        prop.MNY += netYearly;
        if (prop.MNY > prop.maxMoney) {
            prop.maxMoney = prop.MNY;
        }

        // 特殊事件：天降横财（极小概率）
        if (Math.random() < 0.02) {
            const windfall = Util.randomInt(5000, 50000);
            prop.MNY += windfall;
            return {
                income: monthlyIncome,
                expense: monthlyExpense,
                net: netYearly + windfall,
                salaryRaise,
                rentRaise,
                windfall,
                special: '天降横财！额外获得 ' + Util.formatMoney(windfall)
            };
        }

        // 特殊事件：突发支出（极小概率）
        if (Math.random() < 0.03) {
            const suddenCost = Util.randomInt(2000, 20000);
            prop.MNY = Math.max(0, prop.MNY - suddenCost);
            return {
                income: monthlyIncome,
                expense: monthlyExpense,
                net: netYearly - suddenCost,
                salaryRaise,
                rentRaise,
                suddenCost,
                special: '突发支出！损失 ' + Util.formatMoney(suddenCost)
            };
        }

        return {
            income: monthlyIncome,
            expense: monthlyExpense,
            net: netYearly,
            salaryRaise,
            rentRaise
        };
    }

    /**
     * 升职加薪
     * @param {number} newLevel - 新等级
     * @param {Object} levelData - 等级数据
     */
    promote(newLevel, levelData) {
        if (!levelData) return 0;
        const oldSalary = this._lastSalary || 0;
        const newSalary = Util.randomInt(levelData.salaryRange[0], levelData.salaryRange[1]);
        const raise = newSalary - oldSalary;
        this._lastSalary = newSalary;
        return { newSalary, raise };
    }

    reset() {
        this.rent = 1500;
        this.expenseRate = 0.4;
        this.monthlyIncome = 0;
        this.monthlyExpense = 0;
        this._lastSalary = 0;
    }
}

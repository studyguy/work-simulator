/**
 * 条件解析引擎
 * 参考人生重开模拟器的 condition 系统
 * 支持格式：属性名 比较符 数值
 * 如：COD>=3, COM>=2, 天赋_富二代体验生活
 */
const Condition = {
    /**
     * 检查单个条件是否满足
     * @param {string} condStr - 条件字符串
     * @param {Object} propertySet - 属性集（包含属性和天赋列表）
     * @returns {boolean}
     */
    check(condStr, propertySet) {
        if (!condStr || condStr.trim() === '') return true;

        // 处理逻辑运算符 || 和 &&
        if (condStr.includes('||')) {
            return condStr.split('||').some(c => this.check(c.trim(), propertySet));
        }
        if (condStr.includes('&&')) {
            return condStr.split('&&').every(c => this.check(c.trim(), propertySet));
        }

        condStr = condStr.trim();

        // 天赋条件：天赋_天赋名
        if (condStr.startsWith('天赋_')) {
            const talentName = condStr.replace('天赋_', '');
            return propertySet.talents && propertySet.talents.includes(talentName);
        }

        // 非天赋条件：属性名 比较符 数值
        const match = condStr.match(/^(\w+)\s*(>=|<=|>|<|==|=|!=)\s*(\d+)$/);
        if (!match) {
            // 如果没有匹配格式，当作条件不存在（宽松处理）
            console.warn('无法解析的条件:', condStr);
            return true;
        }

        const [, prop, operator, valueStr] = match;
        const targetValue = parseInt(valueStr, 10);
        const currentValue = propertySet[prop] !== undefined ? propertySet[prop] : 0;

        switch (operator) {
            case '>=': return currentValue >= targetValue;
            case '<=': return currentValue <= targetValue;
            case '>':  return currentValue > targetValue;
            case '<':  return currentValue < targetValue;
            case '==':
            case '=':  return currentValue === targetValue;
            case '!=': return currentValue !== targetValue;
            default:   return true;
        }
    },

    /**
     * 批量检查条件数组
     * @param {Array|string} conditions - 条件数组或单个条件
     * @param {Object} propertySet
     * @returns {boolean}
     */
    checkAll(conditions, propertySet) {
        if (!conditions) return true;
        if (typeof conditions === 'string') {
            return this.check(conditions, propertySet);
        }
        if (Array.isArray(conditions)) {
            return conditions.every(c => this.check(c, propertySet));
        }
        return true;
    },

    /**
     * 检查排除条件（任意一个满足则排除）
     */
    checkExclude(excludes, propertySet) {
        if (!excludes) return false;
        if (typeof excludes === 'string') {
            return this.check(excludes, propertySet);
        }
        if (Array.isArray(excludes)) {
            return excludes.some(c => this.check(c, propertySet));
        }
        return false;
    }
};

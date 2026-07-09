/**
 * 工具函数模块
 */
const Util = {
    /**
     * 深拷贝对象
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * 权重随机选择
     * @param {Array} items - 元素数组
     * @param {Function} weightFn - 返回权重的函数
     * @returns {*} 选中的元素
     */
    weightedRandom(items, weightFn) {
        if (!items || items.length === 0) return null;
        const weights = items.map((item, i) => ({ index: i, weight: weightFn(item) }));
        const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
        if (totalWeight <= 0) return items[Math.floor(Math.random() * items.length)];
        let random = Math.random() * totalWeight;
        for (const w of weights) {
            random -= w.weight;
            if (random <= 0) return items[w.index];
        }
        return items[items.length - 1];
    },

    /**
     * 从数组中随机取 n 个不重复元素
     */
    randomPick(arr, n) {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(n, arr.length));
    },

    /**
     * 随机整数 [min, max]
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * 限制值在范围内
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    /**
     * 从 localStorage 读取
     */
    loadData(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.warn('Load data error:', key, e);
            return defaultValue;
        }
    },

    /**
     * 保存到 localStorage
     */
    saveData(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Save data error:', key, e);
            return false;
        }
    },

    /**
     * 格式化金额
     */
    formatMoney(amount) {
        if (amount >= 10000) {
            return (amount / 10000).toFixed(1) + 'w';
        }
        return amount.toLocaleString();
    },

    /**
     * 生成分享文本（占位，后续可扩展为 Canvas 图片）
     */
    generateShareText(stats) {
        const lines = [
            '【打工模拟器】',
            `年龄：${stats.age}岁`,
            `职场等级：${stats.level}`,
            `最高月薪：${Util.formatMoney(stats.maxSalary)}`,
            `总存款：${Util.formatMoney(stats.money)}`,
            `换过公司：${stats.jobChanges}家`,
            `被裁员：${stats.laidOff}次`,
            '---',
            '你也来试试你的打工生涯！'
        ];
        return lines.join('\n');
    },

    /**
     * 随机名言
     */
    randomQuote() {
        const quotes = [
            '上班如上坟',
            '打工是暂时的，摸鱼是永恒的',
            '今天不努力工作，明天努力找工作',
            '钱多事少离家近，只能选一个',
            '不想当CEO的打工人不是好打工人',
            '工作使我快乐——这句话老板说的',
            '我打工，我快乐——骗鬼呢',
            '人生苦短，我用Python；人生太长，我在打工',
            '打工是不可能打工的，这辈子都不可能...真香',
            '每个不想上班的周一，都是对周末的思念',
            '所谓铁饭碗，不是在一个地方吃一辈子饭，而是一辈子到哪里都有饭吃',
            '面试造火箭，入职拧螺丝',
            '不要跟我谈理想，我的理想是不上班',
            '打工人的快乐，就是周五下午五点半',
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
};

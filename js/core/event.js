/**
 * 事件系统模块
 */
class EventSystem {
    constructor() {
        this.allEvents = [];
        this.triggeredEvents = []; // 已触发事件ID列表
        this.currentEvent = null;
    }

    /**
     * 加载事件数据
     */
    loadEvents(eventData) {
        this.allEvents = eventData || [];
    }

    /**
     * 根据年龄和属性获取可用事件池
     */
    getEventPool(prop) {
        if (!this.allEvents || this.allEvents.length === 0) return [];

        return this.allEvents.filter(event => {
            // 检查年龄范围
            if (event.age_range) {
                const [min, max] = event.age_range;
                if (prop.AGE < min || prop.AGE > max) return false;
            }

            // 检查职场等级
            if (event.work_level_min !== undefined && prop.LVL < event.work_level_min) return false;
            if (event.work_level_max !== undefined && prop.LVL > event.work_level_max) return false;

            // 检查已触发（不重复触发相同事件）
            if (event.noRepeat !== false && this.triggeredEvents.includes(event.id)) return false;

            // 检查排除条件
            if (event.exclude && Condition.checkExclude(event.exclude, prop)) return false;

            // 检查需求条件
            if (event.require && !Condition.checkAll(event.require, prop)) return false;

            return true;
        });
    }

    /**
     * 从事件池中随机选一个事件（权重随机）
     */
    pickEvent(prop) {
        const pool = this.getEventPool(prop);
        if (pool.length === 0) return null;

        const event = Util.weightedRandom(pool, e => e.weight || 1);
        if (!event) return null;

        this.currentEvent = event;
        this.triggeredEvents.push(event.id);
        return event;
    }

    /**
     * 处理事件分支
     * @param {Object} event - 当前事件
     * @param {Object} prop - 属性集
     * @returns {Object|null} 分支事件或 null
     */
    checkBranch(event, prop) {
        if (!event.branch || event.branch.length === 0) return null;

        for (const branch of event.branch) {
            // 分支格式： "条件:事件ID"
            const [condStr, eventIdStr] = branch.split(':');
            const targetId = parseInt(eventIdStr, 10);
            if (Condition.check(condStr.trim(), prop)) {
                const branchEvent = this.allEvents.find(e => e.id === targetId);
                if (branchEvent) {
                    this.triggeredEvents.push(branchEvent.id);
                    return branchEvent;
                }
            }
        }
        return null;
    }

    /**
     * 重置事件系统
     */
    reset() {
        this.triggeredEvents = [];
        this.currentEvent = null;
    }

    /**
     * 获取事件总数
     */
    getTotalCount() {
        return this.allEvents.length;
    }

    /**
     * 获取已触发事件数
     */
    getTriggeredCount() {
        return this.triggeredEvents.length;
    }
}

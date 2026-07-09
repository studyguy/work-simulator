/**
 * 天赋数据
 * grade: 1=普通, 2=稀有, 3=传说
 * effect: 对属性的影响
 * status: 额外属性分配点数
 * condition: 触发条件
 */
const TALENTS_DATA = [
    // ===== 普通天赋 (grade=1) =====
    {
        id: 101, name: '科班出身', description: '毕竟学了四年，不能白学',
        grade: 1, effect: { COD: 1, SAL: 500 }, status: 0
    },
    {
        id: 102, name: '考证达人', description: '证书摞起来比人还高',
        grade: 1, effect: { COM: 1 }, status: 0,
        condition: 'AGE>=24'
    },
    {
        id: 103, name: '早睡早起', description: '养生从入职第一天开始',
        grade: 1, effect: { STA: 2 }, status: 0
    },
    {
        id: 104, name: '小镇做题家', description: '靠刷题改变命运',
        grade: 1, effect: { COD: 2, FAM: -1 }, status: 0
    },
    {
        id: 105, name: '准时下班', description: '到点就走，绝不内卷',
        grade: 1, effect: { HAP: 1 }, status: 0
    },
    {
        id: 106, name: '饭搭子', description: '午饭时间是最好的社交',
        grade: 1, effect: { HAP: 1 }, status: 0,
        condition: 'COM>=2'
    },
    {
        id: 107, name: '自带杯子', description: '公司纸杯？不存在的',
        grade: 1, effect: { HAP: 1 }, status: 0, tags: ["save_cost"]
    },
    {
        id: 108, name: '钉钉秒回', description: '哪怕在洗澡也秒回消息',
        grade: 1, effect: { COM: 1 }, status: 0
    },
    {
        id: 109, name: '技能树点满', description: '什么都会一点，什么都不精',
        grade: 1, effect: { COD: 1, COM: 1 }, status: 0
    },
    {
        id: 110, name: '省钱小能手', description: '每一分钱都要花在刀刃上',
        grade: 1, effect: { FAM: 1 }, status: 0
    },
    {
        id: 111, name: '职场老实人', description: '领导说什么就是什么',
        grade: 1, effect: { STA: 1 }, status: 0
    },
    {
        id: 112, name: '键盘侠', description: '线上重拳出击，线下唯唯诺诺',
        grade: 1, effect: { COD: 1, COM: -1 }, status: 0
    },

    // ===== 稀有天赋 (grade=2) =====
    {
        id: 201, name: '内推贵人', description: '表哥在腾讯当总监',
        grade: 2, effect: { LVL: 1, SAL: 2000 }, status: 0
    },
    {
        id: 202, name: '开源贡献者', description: 'GitHub 绿到发光',
        grade: 2, effect: { COD: 2 }, status: 1
    },
    {
        id: 203, name: '画饼免疫', description: '老板画的饼从来不吃',
        grade: 2, effect: { HAP: 2 }, status: 0
    },
    {
        id: 204, name: '摸鱼大师', description: '带薪拉屎，吾辈楷模',
        grade: 2, effect: { HAP: 2 }, status: 0
    },
    {
        id: 205, name: '学术背景', description: 'Paper 发到手软',
        grade: 2, effect: { COD: 1, COM: 1 }, status: 1
    },
    {
        id: 206, name: '斜杠青年', description: '写代码/做自媒体/开滴滴',
        grade: 2, effect: { MNY: 0 }, status: 1, tags: ["side_income"]  // 效果在economy中处理
    },
    {
        id: 207, name: '茶水间情报', description: '所有八卦都逃不过你的耳朵',
        grade: 2, effect: { COM: 1, HAP: 1 }, status: 0
    },
    {
        id: 208, name: '远程办公体质', description: '三年没去过公司',
        grade: 2, effect: { HAP: 2, STA: 1 }, status: 0
    },
    {
        id: 209, name: '抗压达人', description: '越挫越勇，越压越强',
        grade: 2, effect: { STA: 3 }, status: 0
    },
    {
        id: 210, name: '社交恐怖分子', description: '和谁都能聊两句',
        grade: 2, effect: { COM: 3 }, status: 0
    },

    // ===== 传说天赋 (grade=3) =====
    {
        id: 301, name: '富二代体验生活', description: '不是为了挣钱，是为了体验人生',
        grade: 3, effect: { FAM: 5 }, status: 3
    },
    {
        id: 302, name: '风口上的猪', description: '站在风口上，猪都能飞起来',
        grade: 3, effect: { MNY: 100000 }, status: 0,
        condition: 'AGE>=28'
    },
    {
        id: 303, name: '祖传代码', description: '这代码是十年前学长写的',
        grade: 3, effect: { COD: 3 }, status: 0
    },
    {
        id: 304, name: '免死金牌', description: 'HR 动不了你',
        grade: 3, effect: { STA: 2 }, status: 0
    },
    {
        id: 305, name: '天选接线员', description: '猎头电话接到手软',
        grade: 3, effect: { COM: 2, SAL: 3000 }, status: 1
    },
    {
        id: 306, name: '打工皇帝', description: '钱多事多离家远',
        grade: 3, effect: { SAL: 5000, HAP: -1 }, status: 2
    },
    {
        id: 307, name: '天选之人', description: '运气爆棚，走路都能捡到钱',
        grade: 3, effect: { HAP: 2 }, status: 1
    },
    {
        id: 308, name: '卷王之王', description: '你不睡觉，别人也别想睡',
        grade: 3, effect: { COD: 2, STA: 2 }, status: 1,
        condition: 'STA>=3'
    },

    // ===== 新增稀有天赋 (grade=2) =====
    {
        id: 211, name: '代码洁癖', description: '看到不规范缩进就想改，改着改着就忘了正事',
        grade: 2, effect: { COD: 1, HAP: -1 }, status: 1,
        condition: 'COD>=3'
    },
    {
        id: 212, name: '职场显眼包', description: '开会总被点名，好事坏事都躲不过',
        grade: 2, effect: { COM: 2, STA: -1 }, status: 0
    },
    {
        id: 213, name: '大厂工牌', description: '挂着工牌坐地铁，感觉整条线都是自家的',
        grade: 2, effect: { HAP: 1, COM: 1 }, status: 0
    },
    {
        id: 214, name: '自动续杯', description: '每天四杯咖啡起步，公司的咖啡机是你买的',
        grade: 2, effect: { STA: 2, MNY: -1000 }, status: 0
    },
    {
        id: 215, name: '摸鱼雷达', description: '老板离你还有十米，屏幕已经切到了 IDE',
        grade: 2, effect: { HAP: 2, COM: -1 }, status: 0
    }
];

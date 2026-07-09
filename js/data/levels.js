/**
 * 职场等级数据
 * key: 等级 (1-10)
 * value: { title, salaryRange, requireCOD, requireCOM, minAge }
 */
const LEVELS = {
    1: { title: '试用期打杂', salaryRange: [3000, 5000], requireCOD: 0, requireCOM: 0, minAge: 0 },
    2: { title: '初级搬砖工', salaryRange: [5000, 8000], requireCOD: 0, requireCOM: 0, minAge: 0 },
    3: { title: '正式员工', salaryRange: [8000, 12000], requireCOD: 2, requireCOM: 2, minAge: 22 },
    4: { title: '高级老油条', salaryRange: [12000, 18000], requireCOD: 4, requireCOM: 3, minAge: 24 },
    5: { title: '小组长 / Team Lead', salaryRange: [18000, 25000], requireCOD: 5, requireCOM: 4, minAge: 27 },
    6: { title: '项目经理 / 架构师', salaryRange: [25000, 35000], requireCOD: 6, requireCOM: 5, minAge: 30 },
    7: { title: '总监 / 高级架构师', salaryRange: [35000, 50000], requireCOD: 7, requireCOM: 6, minAge: 34 },
    8: { title: '副总裁 / CTO', salaryRange: [50000, 80000], requireCOD: 8, requireCOM: 7, minAge: 38 },
    9: { title: 'CEO / 创始人', salaryRange: [80000, 150000], requireCOD: 9, requireCOM: 8, minAge: 42 },
    10: { title: '财务自由 / 退休', salaryRange: [150000, 300000], requireCOD: 10, requireCOM: 10, minAge: 50 }
};

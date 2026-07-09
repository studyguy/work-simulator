/**
 * 主应用控制器
 */
const App = {
    currentPage: 'title',
    gameConfig: {},      // 游戏配置（学历、天赋、属性）
    gameResult: null,    // 游戏结局

    pages: {
        'title': TitleUI,
        'education': EducationUI,
        'talent': TalentPickUI,
        'attribute': AttributeAssignUI,
        'simulate': SimulateUI,
        'summary': SummaryUI
    },

    /**
     * 初始化应用
     */
    init() {
        // 检查是否有存档
        const savedData = Util.loadData('work_sim_save');
        if (savedData) {
            // 可以在这里添加"继续游戏"按钮
        }

        // 渲染标题页
        this.renderPage('title');

        // 全局事件委托 - 点击
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;
            const action = target.dataset.action;
            const [page, method] = action.split(':');
            const uiMap = {
                'title': TitleUI,
                'education': EducationUI,
                'talent': TalentPickUI,
                'attribute': AttributeAssignUI,
                'simulate': SimulateUI,
                'summary': SummaryUI,
                'app': App
            };
            const ui = uiMap[page];
            if (ui && ui[method]) {
                ui[method](target);
            }
        });

        // 全局事件委托 - input（滑块实时拖动）
        document.addEventListener('input', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;
            const action = target.dataset.action;
            const [page, method] = action.split(':');
            const uiMap = {
                'attribute': AttributeAssignUI
            };
            const ui = uiMap[page];
            if (ui && ui[method]) {
                ui[method](target);
            }
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.active').forEach(el => el.classList.remove('active'));
            } else if (e.key === 'Enter' || e.key === ' ') {
                if (this.currentPage === 'simulate') {
                    const btn = document.getElementById('sim-next-btn');
                    if (btn && !btn.disabled) btn.click();
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                if (this.currentPage !== 'simulate') return;
            }
        });
    },

    /**
     * 渲染指定页面
     */
    renderPage(pageName) {
        const app = document.getElementById('app');
        const pageUI = this.pages[pageName];
        if (!pageUI) return;

        const doRender = () => {
            app.innerHTML = '';
            app.innerHTML = pageUI.render();
            this.currentPage = pageName;
            if (pageUI.onEnter) {
                pageUI.onEnter();
            }
        };

        if (app.children.length > 0) {
            const oldContent = app.children[0];
            oldContent.classList.add('page-exit');
            oldContent.addEventListener('animationend', () => {
                doRender();
            }, { once: true });
            // 防止动画异常，设置超时保护
            setTimeout(() => {
                if (oldContent.parentNode) {
                    doRender();
                }
            }, 300);
        } else {
            doRender();
        }
    },

    /**
     * 跳转到页面
     */
    goTo(pageName) {
        if (typeof pageName === 'object') {
            pageName = pageName.dataset.page;
        }
        this.renderPage(pageName);
    },

    /**
     * 开始游戏
     */
    startGame() {
        this.renderPage('simulate');
    },

    /**
     * 重新开始
     */
    restart() {
        this.gameConfig = {};
        this.gameResult = null;
        life.reset();
        this.renderPage('title');
    },

    /**
     * 重置所有数据
     */
    resetAll() {
        localStorage.removeItem('work_sim_save');
        localStorage.removeItem('work_sim_global');
        this.restart();
    },

    /**
     * 继续游戏（读取存档）
     */
    continueGame() {
        this.renderPage('simulate');
        // SimulateUI.onEnter 会检查存档并自动加载
    }
};

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

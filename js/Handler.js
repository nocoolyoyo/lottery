/**
 * Created by nocoolyoyo on 2018/1/29.
 */
(function (global, factory) {
    //操作栏
    global.Handler = factory( );

}(this, (function () {
    return  {
        $el: document.querySelector('#handler'),
        $showFlow: document.querySelector('#btnShowFlow'),
        $showHistory: document.querySelector('#btnShowHistory'),
        $showConfig: document.querySelector('#btnShowConfig'),
        $btnResetAll: document.querySelector('#btnResetAll'),
        show: function () {
            this.$el.style.opacity = '1'
        },
        hide: function () {
            this.$el.style.opacity = '0'
        },
        showConfig: function () {
            Config.show();
        },
        showFlow: function () {
            if(RollFlow.length === Roller.curFlow) {
                Prompt.prepare('已无更多抽奖项目').show(function () {
                })
                return
            }
            Roller.show();
        },
        showHistory: function () {
            History.prepare().show();
        },
        resetAll: function () {
            Prompt.prepare('确定要重置抽奖吗？').show(function () {
                History.reset();
                window.location.reload();
            })
        },
        init: function () {
            this.$showFlow.addEventListener('click', this.showFlow.bind(this));
            this.$showHistory.addEventListener('click', this.showHistory.bind(this));
            this.$btnResetAll.addEventListener('click', this.resetAll.bind(this))
            this.$showConfig.addEventListener('click', this.showConfig.bind(this))
        }
    }
})))

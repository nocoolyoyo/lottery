/**
 * Created by nocoolyoyo on 2018/1/29.
 */
(function (global, factory) {
    //遮罩层
    global.Mask = factory();

}(this, (function () {
//遮罩
    return {
        $el: document.querySelector('#mask'),
        status: 'hide',
        show: function () {
            var _this = this;
            _this.$el.style.display = "block"
            setTimeout(function () {
                _this.$el.className = "show"
            },10)
        },
        hide: function () {
            var _this = this;
            _this.$el.className = ""
            setTimeout(function () {
                _this.$el.style.display = "none"
            },300)
        }
    }
})))



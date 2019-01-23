
(function (global, factory) {
    //询问层
    global.Prompt = factory();

}(this, (function () {
//确认框
    return {
        $el: document.querySelector('#prompt'),
        $message: null,
        $confirm: null,
        $cancel: null,
        prepare: function(msg){
            this.$message.innerText = msg;
            return this
        },
        show: function (confirm) {
            var _this = this;
            _this.$el.className  = "show";
            _this.$confirm.onclick = function(){
                _this.hide();
                setTimeout(confirm, 300)
            }
            Mask.show();
        },
        hide: function () {
            this.$el.className  = "";
            Mask.hide();
        },
        init: function () {

            this.$confirm = this.$el.querySelector('#promptConfirm');
            this.$message = this.$el.querySelector('#promptMsg');
            this.$cancel= this.$el.querySelector('.btn-close');
            this.$cancel.addEventListener('click', this.hide.bind(this))
        }
    }
})))





//每轮结果页面
(function (global, factory) {
    //结果栏
    global.Result = factory();

}(this, (function () {
    return {
        $el: document.querySelector('#result'),
        $list: null,
        $btnClose: null,
        prepare: function(data, name){
            var _temp = '';
            var _size = data.length === 1? 'lg':'sm';

            data.forEach(function (value) {
                _temp += '<div class="card-user ' + _size +'">'+
                    '<div class="avatar">'+
                    '<img src="'+ value.avatar +'" alt="" >'+
                    '</div>'+
                    '<div class="info">'+
                    '<p class="name">'+ value.user +'</p>'+
                    '<p class="dept">'+ value.dept +'</p>'+
                    '<p class="ID">' + value.number +'</p>'+
                    '</div>'+
                    '</div>'
            })
            this.$el.querySelector('.title').innerText = name + '获奖名单';
            this.$list.innerHTML = _temp;
            return this
        },
        show: function(){
            this.$el.className  = "show";
            Mask.show();
        },
        hide: function(){
            this.$el.className  = "";
            Mask.hide();
        },
        init: function () {
            this.$list = this.$el.querySelector('#luckyDogs');
            this.$el.querySelector('.btn-close').addEventListener('click', this.hide.bind(this))
        }
    }
})))





/**
 * Created by nocoolyoyo on 2018/1/29.
 */
(function (global, factory) {
    //自定义抽奖配置栏(补抽)
    global.Config = factory();

}(this, (function () {
//流程抽奖流程预设
    var ConfigMap =(function () {
        var _temp = {};
        RollFlow.forEach(function (p1, p2, p3) {
            _temp[p1.name] = p1
        })
        return _temp;
    })();

    return {
        $el: document.querySelector('#config'),
        $select: null,
        $btnSure: null,
        show: function () {
            this.$el.className  = "show";
        },
        hide: function () {
            this.$el.className  = "";
        },
        pushOptions: function () {
            var itemHtml = '';
            RollFlow.forEach(function(p1, p2){
                if(p1.isDefault)  itemHtml += '<option value="'+p1.name+'">'+ p1.name+'</option>'
            })
            this.$select.innerHTML = itemHtml;
        },
        init: function () {
            this.$btnSure = this.$el.querySelector('#btnConfigSure');
            this.$btnSure.addEventListener('click', this.insert.bind(this));
            this.$select =  this.$el.querySelector('select');
            this.$el.querySelector('.btn-close').addEventListener('click', this.hide.bind(this));
            this.pushOptions();
        },
        //加入抽奖流
        insert: function () {
            var _this = this;
            var _value = this.$el.querySelector('#configType').value;
            var _remark = this.$el.querySelector('#configRemark').value;
            var _num = this.$el.querySelector('#configNum').value;
            var _data = {
                name:  _value+'（补抽）' ,
                num: _num,
                isDefault:  false,
                type: 'user',
                award:   ConfigMap[_value].award,
                items: [],
                luckyDogs: [],
                remark: _remark
            }
            Prompt.prepare('补抽项目: ' +_value+ '\n补抽人数' + _num+'\n补抽备注'+_remark+'\n确定要加入吗？').show(function () {
                _this.hide();
                Roller.insert(_data).prepare().show();
            })

        }
    }
})))



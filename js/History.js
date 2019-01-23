/**
 * Created by nocoolyoyo on 2018/1/29.
 */
(function (global, factory) {
    //历史栏
    global.History = factory();

}(this, (function () {
    return  {
        $el: document.querySelector('#history'),
        $btnExport:  document.querySelector('#btnExport'),
        $list: null,
        $btnClose: null,
        _getTemplate: function (flow) {
            var resultTxt = "";
            if(flow.luckyDogs.length === 0) {
                resultTxt = '<tr class="list">' +
                    '<td class="title">' + flow.name + ':</td>' +
                    '<td>未开始</td>'+
                    '</tr>'
            }else{
                if(flow.type === "number") {

                    Data.lucky[flow.luckyDogs[0]].forEach(function (p1, p2, p3) {
                        resultTxt += '<tr class="list">';
                        resultTxt += p2 === 0
                            ? '<td class="title" rowspan="' + Data.lucky[flow.luckyDogs[0]].length +'">' + flow.name + ':</td>'
                            : '';
                        resultTxt += '<td>'+ p1.user +'</td>' +
                            '<td>'+ p1.number + '</td>' +
                            '<td>'+ p1.dept + '</td>' +
                            '<td>'+ '幸运数字是:'+ flow.luckyDogs[0] + '</td>' +
                            '</tr>';
                    })
                }else{
                    flow.luckyDogs.forEach(function (p1, p2, p3) {
                        resultTxt +=   '<tr class="list">';
                        resultTxt +=  p2 === 0
                            ? '<td class="title" rowspan="' + flow.luckyDogs.length +'">' + flow.name + ':</td>'
                            : '';
                        resultTxt +=   '<td>'+ p1.user +'</td>' +
                            '<td>' + p1.number + '</td>' +
                            '<td>' + p1.dept + '</td>' +
                            '<td>' + flow.remark + '</td>' +
                            '</tr>';

                    })

                }
            }
            return resultTxt
        },
        prepare: function(){
            var _this = this;
            var _temp = "";

            RollFlow.forEach(function (p1, p2, p3) {
                _temp += _this._getTemplate(p1)
            })
            _this.$list.innerHTML = _temp;

            return this;
        },
        show: function () {
            this.$el.className  = "show";
            Handler.hide();
        },
        hide: function () {
            this.$el.className  = "";
            Handler.show();
        },
        //保存数据
        saveLocal: function () {

            //保存数据
            localStorage.setItem('RollFlow',JSON.stringify(RollFlow));
            //记录轮数
            localStorage.setItem('curFlow',Roller.curFlow + 1);
            //记录结果
            localStorage.setItem('end',Roller.end);
        },
        //载入数据
        loadLocal: function (key) {
            return localStorage.getItem(key);
        },
        exportResult: function (){
            export2Excel('historyTable', '抽奖结果')
        },
        init: function () {
            this.$list = this.$el.querySelector('tbody');
            this.$btnClose = this.$el.querySelector('.btn-close');
            this.$btnClose.addEventListener('click', this.hide.bind(this));
            this.$btnExport.addEventListener('click', this.exportResult.bind(this));
            var localRollFlow = this.loadLocal('RollFlow');
            var localCurFlow = this.loadLocal('curFlow');
            var localEnd = this.loadLocal('end');
            if(localRollFlow !== null) {
                RollFlow = JSON.parse(localRollFlow);
                Roller.curFlow = Number(localCurFlow);
                Roller.end = Number(localEnd);
                //记录结束
                Roller.prepare()

                if(Roller.curFlow > 9) {
                    Handler.$showConfig.style.display = '';
                }
            }else{
                Roller.prepare()
            }
        },
        reset: function () {
            localStorage.clear();
        }
    }
})))


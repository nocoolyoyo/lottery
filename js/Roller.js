
//每轮结果页面
(function (global, factory) {
    //抽奖滚动栏
    global.Roller = factory();

}(this, (function () {
    //颜色表
    var colorMap = [
        '#70599D',
        '#6E70F7',
        '#FF403B',
        '#FE1E6D',
        '#FFC000',
        '#93D76E',
        '#51a3ff',
        '#de8b3d',
        '#b33af8',
        '#158923'
    ];
    //获取随机色
    function getRandomColor() {
        //生成范围随机数字
        return colorMap[getRandom(0, colorMap.length)]
    }

   return {
        $el: document.querySelector('#roller'),
        $candidateBox:  null,
        $btnAction: null,
        $btnNext: null,
        $btnClose: null,
        $selections: null,
        status: "normal",     //Roller状态：rolling, normal,end
        curFlow: 0,     //当前所在抽奖流
        timer: null,
        interval: 100,
        endInterval: 1000,
        end:0,
        result: null, //网络随机抽取结果
        //人员滚动模板
        _getUserTemp:function () {
            return   '<div class="item user" >'+
                '<span></span>'+
                '</div>'
            // return   '<div class="item user" style="background-color: '+getRandomColor()+'">'+
            //     '<span></span>'+
            //     '</div>'
        },
        //数字滚动模板
        _getNumberTemp:function (number) {
            return   '<div class="item number"  data-'+number +'>'+
                '<span>'+number+'</span>'+
                '</div>'
        },
        //填充待选数据
        pushItems: function () {

            Core.pushItems(this.curFlow)

        },
        prepare: function () {

            //准备工作
            var _this = this;
            if(RollFlow.length === _this.curFlow) {
                return
            }

            this.$btnNext.disabled = true;
            this.$btnAction.disabled = false;

            var opts = RollFlow[_this.curFlow];
            var _temp = "";
            _this.pushItems();

            //根据数量渲染对应的滚动面板
            if(opts.type === "number") {
                for(var i = 0; i < opts.items.length; i++){
                    _temp += _this._getNumberTemp(opts.items[i])
                }
            }else if(opts.type === "user") {
                for(var i = 0; i < opts.num; i++){
                    _temp += _this._getUserTemp()
                }
            }
            //抽奖位置填充
            this.$candidateBox.innerHTML = _temp;
            //标题填充
            this.$el.querySelector('.title').innerText = opts.name;
            //奖品名字填充
            this.$el.querySelector('.award-title').innerText = opts.award.name;
            //奖品图片填充
            this.$el.querySelector('#awardBox').querySelector('img').src = opts.award.avatar;
            this.$selections = this.$el.querySelectorAll('.item');

            return this;
        },
        //插入流程
        insert:function (data) {
            var _this = this;
            RollFlow.splice(_this.curFlow, 0, data);
            return this;
        },
        start: function () {
            var _this = this;
            var opts = RollFlow[_this.curFlow];

            //切换Roller相关状态
            _this.$btnAction.disabled = true;
            _this.$btnAction.classList.add("button-caution");
            _this.$btnAction.classList.remove("button-primary");
            _this.status = "rolling";

            //开始滚动动画
            if(opts.type === "number") {
                _this.timer = setInterval(
                    _this.animationNum.bind(this),
                    _this.interval)
            }else if(opts.type === "user") {
                _this.timer = setInterval(
                    _this.animationUser.bind(this),
                    _this.interval)
            }

            //提前抽取结果
            Core.drawResult(RollFlow[_this.curFlow], function () {
                History.saveLocal();
                _this.$btnAction.disabled = false;
                _this.$btnAction.innerText = "停止";
            });

        },
        stop: function () {
            var _this = this;
            if( _this.status !== "rolling" ) return;
            _this.status = "normal";
            var opts = RollFlow[_this.curFlow];
            //切换Roller相关状态
            _this.$btnAction.disabled = true;
            _this.$btnAction.classList.add("button-primary");
            _this.$btnAction.classList.remove("button-caution");
            _this.$btnAction.innerText = "开始";
            clearInterval(_this.timer);

            setTimeout(function () {
                if(opts.type === "number") {
                    _this.drawNum();
                }else if(opts.type === "user") {
                    _this.drawUser();
                }
            }, 150)

        },

        $aniNumPrenode: null,
        animationNum: function (isEnd) {
            isEnd = isEnd || false;

            var _this = this;
            var opts = RollFlow[_this.curFlow];
            var _index = isEnd
                ? RollFlow[ _this.curFlow ].luckyDogs[0]
                : getRandom(0, opts.items.length);

            if(isEnd) {
                var _number = RollFlow[ _this.curFlow ].luckyDogs[0];
                var $target = _this.$el.querySelector('[data-' + _number);
                $target.style.backgroundColor = getRandomColor();
            }else{
                _this.$selections[_index].style.backgroundColor = getRandomColor();
            }

            if(_this.$aniNumPrenode !== null)  {
                if(_this.$aniNumPrenode  ===  _this.$selections[_index]) return;
                _this.$aniNumPrenode.style.backgroundColor = 'transparent';
            }
            _this.$aniNumPrenode = _this.$selections[_index];
        },
        animationUser: function (isEnd) {
            isEnd = isEnd || false;

            var _this = this;

            if(isEnd) {
                _this.$selections.forEach(function (p1,p2) {
                    p1.style.borderColor = getRandomColor();
                    p1.childNodes[0].innerText =  RollFlow[ _this.curFlow ].luckyDogs[p2].user
                })

            }else{

                _this.$selections.forEach(function (p1,p2) {
                    p1.style.borderColor = getRandomColor();
                })
            }
        },
        //下一轮
        next: function () {
            if(this.curFlow  ===  RollFlow.length) {
                Prompt.prepare('已无更多抽奖项目').show(function () {
                })
                return
            }
            if(this.curFlow > 9) {
                Handler.$showConfig.style.display = '';
            }
            this.prepare();
            //按钮重置
            this.$btnAction.disabled = false;
        },
        show: function () {
            this.$el.className  = "show";
            Handler.hide()
        },
        hide: function () {
            this.$el.className  = "";
            Handler.show()
        },
        //数字抽奖出结果过程动画
        drawNum: function (interval) {
            var _this = this;
            _this.animationNum(true);
            setTimeout(function () {
                Result.prepare(Data.lucky[RollFlow[ _this.curFlow ].luckyDogs[0]], RollFlow[ _this.curFlow ].name).show();
                _this.$btnNext.disabled = false;
                _this.curFlow += 1;
            },1000)
        },
        //用户抽奖出结果过程动画
        drawUser: function (interval) {
            var _this = this;
            _this.animationUser(true);
            setTimeout(function () {
                Result.prepare(RollFlow[ _this.curFlow ].luckyDogs, RollFlow[ _this.curFlow ].name).show();
                _this.$btnNext.disabled = false;
                _this.curFlow += 1;
            },1000)
        },
        handleClick: function () {

            if(this.status === "normal") {
                this.start()
            }else if(this.status === "rolling") {
                this.stop()
            }
        },
        init: function () {
            this.$candidateBox = this.$el.querySelector('#candidateBox');
            this.$btnAction = this.$el.querySelector('#rollAction');
            this.$btnNext = this.$el.querySelector('#rollNext');
            this.$btnClose = this.$el.querySelector('.btn-close');
            this.$btnAction.addEventListener('click', this.handleClick.bind(this))
            this.$btnNext.addEventListener('click', this.next.bind(this));
            this.$btnClose.addEventListener('click', this.hide.bind(this));
        }
    }
})))






/**
 * Created by nocoolyoyo on 2018/1/29.
 * 核心抽奖代码
 */

(function (global, factory) {
    //核心抽奖代码
    global.Core = factory();

}(this, (function () {

    //这个是随机数网站的随机apiKey
    var apiKeys = [
        '8273ecaf-2486-45ff-90f9-97220ebc80e6',
        '47cdd549-3dcc-49ba-bc1b-9dd5069511ca',
        'a3dccfc3-ba4a-4b92-b5a9-d286ff61866a',
        '85138eab-f5f9-458d-8f9d-424281fffdcd',
        'f4e6d516-b5e9-4d7d-958b-9877e3147b5f',
        '0c3e04a3-0711-439c-8aa4-cc455eb30ba5',
        'a961f904-a802-41ce-95fc-c980b0a96228',
        '0e329622-0902-4055-b938-bd82ad2b567a',
        'd23c1c58-6dd4-4ba8-ad48-e14bcf1ccee8',
        'c549ff0c-56e5-4139-9061-df4bff38ed8c',
        'ea2726cf-95e7-4567-aef9-e5e131b48a91',
        '1416524e-5b00-4360-ad87-902ce283b8cf',
        '9fca1ee8-523b-489a-b318-685af8e49bbc',
        'b011145d-faba-40cb-8b91-10ebc0e8c76c',
        'a3e5c4f3-621a-4df2-acac-6596eb346f47',
        '3bbf3a22-30ad-477d-b398-2d6b0d96420d',
        '2347e5ad-de59-4048-9a65-19007efa679d',
        '0d6ad6c8-afb3-4d8c-830a-10c979639c4e'
    ]
    var lastApiKey = getRandom(0, apiKeys.length - 1);
    function getApiKey() {
        lastApiKey++;
        if(lastApiKey > apiKeys.length -1) lastApiKey = 0;
        return apiKeys[lastApiKey];
    }
    return  {
        /** 获取第三方随机结果
         * @params Number { min }: 随机数开始数字
         * @params Number { max }: 随机数结束数字
         * @params Number { num }: 随机数抽取数量
         * @params Function { success }: 抽取结果回调
         */
        getRndResult: function(min, max, num, success) {
            var _this = this;
            var randomUrl = 'https://api.random.org/json-rpc/1/invoke';
            //随机数接口的请求所需的key,为了防止同个key接口请求过于频繁，所以随机抽取key确保请求成功
            var randomKey = getApiKey();
            //这里是随机数的请求参数
            var params = {
                "jsonrpc": "2.0",
                "method": "generateIntegers",
                "params": {
                    "apiKey": randomKey,
                    "n": num,
                    "min": min,
                    "max": max,
                    "replacement": false,   //这个参数确保生成不可重复的随机数
                    "base": 10
                },
                'id': new Date().getTime() + getRandom(0, 100)
            }
            //生成XMLHttpRequest请求方法实例
            var  xhr =  new XMLHttpRequest();
            //打开链接
            xhr.open("POST", randomUrl, true)
            //设置请求返回的参数格式
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8;");
            var time = 10000;   //10s 超时重新提交
            var timeout = false;   //是否超时
            //超时定时
            var timer = setTimeout(function(){
                timedout = true;
                xhr.abort();
                _this.getRndResult(min, max, num, success)
            },time);

            xhr.onreadystatechange = function(e){
                if(xhr.readyState !== 4) return;
                if(timeout) return;
                clearTimeout(timer);
                if(xhr.status === 200){
                    console.log(e)
                    var result = e.target.responseText;
                    //在console.log中打印出随机生成的数据
                    console.log(JSON.parse(result).result.random.data)
                    //数据推入到success回调中进行展示
                    success(JSON.parse(result).result.random.data)
                }
            };

            //发送请求
            xhr.send(JSON.stringify(params));
        },
        /**抽取获奖结果
         * @params Number { flowOpts }: 当前抽奖轮的配置项
         * @params Function { callBack }: 抽奖结果回调
         */
        drawResult: function (flowOpts, callBack) {
            var result = null;
            var min = 0,
                  max = flowOpts.items.length -1,
                  num = flowOpts.num;
            if(flowOpts.type === "number") {
                //抽取幸运奖结果
                this.getRndResult(min, max, num,  function (res) {
                    result = flowOpts.items[res[0]];
                    flowOpts.luckyDogs.push( result );
                    if(typeof callBack === "function") callBack();
                })
            }else{
                //抽取其他奖项结果
                this.getRndResult(min, max, num, function (res) {
                    result = res;
                    result.forEach(function (p1, p2) {
                        flowOpts.luckyDogs.push(
                            flowOpts.items[p1]
                        );
                    });
                    if(typeof callBack === "function") callBack();
                })
            }
        },
        /**填充候选名单
         * @params Number { curFlow }: 当前抽奖轮
         */
        pushItems: function (curFlow) {
            switch(true) {
                //幸运奖第一轮
                case curFlow === 0:
                    //幸运奖的十个数字推入到RollFlow抽奖流的被抽列表中
                    RollFlow[curFlow].items = [0,1,2,3,4,5,6,7,8,9];
                    //打印出本轮被选的数据用于检阅
                    console.log(RollFlow[ curFlow ].items)
                    break;
                //幸运奖第二轮
                case curFlow === 1:
                    //幸运奖的十个数字推入到RollFlow抽奖流的被抽列表中，
                    //移除上一轮已经抽过的幸运数字
                    RollFlow[ curFlow ].items = [0,1,2,3,4,5,6,7,8,9];
                    RollFlow[ curFlow ].items .splice(RollFlow[ curFlow - 1].luckyDogs[0],1);
                    //打印出本轮被选的数据用于检阅
                    console.log(RollFlow[ curFlow ].items)
                    break;
                //三等奖第一轮
                case curFlow === 2:
                    //从这里开始填充被选的用户数据
                    RollFlow[ curFlow ].items = UserData.concat();
                    //打印出本轮被选的用户数据用于检阅
                    console.log(RollFlow[ curFlow ].items)
                    break;
                //三等奖之后的抽奖
                case curFlow >= 3:
                    //第三论抽奖的候选名单每次都要剔除上次的候选名单人员
                    var lastItems = RollFlow[ curFlow - 1 ].items;      //上一轮被选集合
                    var lastLuckies = RollFlow[ curFlow - 1 ].luckyDogs     //上一轮选中集合
                    RollFlow[ curFlow ].items = getReduceArray( lastItems, lastLuckies);
                    //打印出本轮被选的用户数据用于检阅
                    console.log(RollFlow[ curFlow ].items)
                    break;
                default:
            }
        }
    };
})))







//数组剔除
Array.prototype.remove = function ( index ) {
    var _this = this;
    var _tempArr = _this.concat();
    arr.forEach(function (p1,p2) {
        var _index = _this.indexOf(p1);
        if(_index !== -1) {
            _tempArr.splice(_tempArr.indexOf(p1), 1)
        }
    })
    return _tempArr
}
//数组是否包含某个元素
Array.prototype.contains = function ( needle ) {
    this.forEach(function (p1, p2, p3) {
        if (p1 === needle) return true;
    })
    return false;
}
//this绑定
Function.prototype.bind = function(obj) {
    var _this = this;
    return function() {
        _this.apply(obj,arguments);
    }
}

//生成范围内随机1个数字
function getRandom(min, max) {
    return Math.floor(Math.random()*max + min)
}
//对象数组相减
function getReduceArray(targetArr, minisArr) {

    var _tempArr = [];
    var tests = JSON.stringify(minisArr);
    targetArr.forEach(function (p1,p2) {
        var  match = new RegExp(p1.number);
        if(!match.test(tests)){ _tempArr.push(p1) }
    })
    return _tempArr;
}

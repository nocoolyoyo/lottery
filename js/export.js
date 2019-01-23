/**
 * Created by nocoolyoyo on 2018/1/22.
 */
(function (global, factory) {
    //导出excel
    global.export2Excel = factory();

}(this, (function () {
    //流程抽奖流程预设
    return function (tableId,name) {
        // 使用outerHTML属性获取整个table元素的HTML代码（包括<table>标签），然后包装成一个完整的HTML文档，设置charset为urf-8以防止中文乱码
        var html = "<html><head><meta charset='utf-8' /></head><body>" + document.querySelector("#"+tableId).outerHTML + "</body></html>";
        // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
        var blob = new Blob([html], { filename:name,  type: "application/vnd.ms-excel" });
        var a = document.createElement("a");
        // 利用URL.createObjectURL()方法为a元素生成blob URL
        a.href = URL.createObjectURL(blob);
        // 设置文件名，目前只有Chrome和FireFox支持此属性
        a.download = name +".xls";
        a.click();
    }
})))





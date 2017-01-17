/**
 * 统一动态加载工具
 * 用于动态加载页面, 实现加载体验统一化
 * 依赖:jquery
 */
var MLoader = {};

// 显示loading图标
MLoader.showLoading = function (container) {
    if (!container.hasClass('loading-wrap')) {
        container.addClass('loading-wrap');
    }
    container.html("<div class='loading'><span class='L'></span><span class='O'></span><span class='A'></span><span class='D'></span><span class='I'></span><span class='N'></span><span class='G'></span></div>");
};

// 向容器加载内容
MLoader.load = function (container, path, displayLoading, timeout) {
    // 默认显示loading图标
    if (displayLoading == undefined) {
        displayLoading = true;
    }
    if (displayLoading) {
        this.showLoading(container);
    }

    setTimeout(function () {
        container.load(path, function (html, status, resp) {
            container.removeClass('loading-wrap');
        });
    }, timeout || 0);
};

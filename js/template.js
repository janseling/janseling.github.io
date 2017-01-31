$(function () {
    MLoader.load($('#nav'), '/template/nav.html?'+ new Date().getTime(), false);
    MLoader.load($('#header'), '/template/header.html?'+ new Date().getTime(), false);
    MLoader.load($('#footer'), '/template/footer.html?'+ new Date().getTime(), false);
});

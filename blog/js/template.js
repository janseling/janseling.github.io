$(function () {
    MLoader.load($('#header'), '/blog/template/header.html?'+ new Date().getTime(), false);
    MLoader.load($('#footer'), '/blog/template/footer.html?'+ new Date().getTime(), false);
});

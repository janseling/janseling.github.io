$(function () {
    MLoader.load($('#header'), '/blog/template/header.html', false);
    MLoader.load($('#footer'), '/blog/template/footer.html', false);

    MLoader.load($('.container'), '/blog/template/header.html', true, 3000);
});

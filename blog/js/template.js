$(function () {
    MLoader.load($('#header'), '/blog/header.html', false);
    MLoader.load($('#footer'), '/blog/footer.html', false);


    MLoader.load($('.container'), '/blog/header.html', true, 5000);
});

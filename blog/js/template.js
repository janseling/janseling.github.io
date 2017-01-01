$(function () {
    $('#header').load('/blog//header.html', function () {
        console.log(arguments);
    });

    $('#footer').load('/blog/footer.html', function () {
        console.log(arguments);
    });
});

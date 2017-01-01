$(function () {
    $('#header').load('../header.html', function () {
        console.log(arguments);
    });

    $('#footer').load('../footer.html', function () {
        console.log(arguments);
    });
});

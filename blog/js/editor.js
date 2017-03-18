if (!AV.User.current()) {
    window.location.href = 'login.html';
}

var cateMenu = $('#cate-list-menu');
var seriesMenu = $('#series-list-menu');

loadData();

function loadData () {
    var params = {};
    var id = getQueryParam('id');
    if (id) {
        params.id = id;
    }
    AV.Cloud.rpc('queryAllBlog', params).then(function(result) {
        setAid(result.aid);
        setArticle(result.article);
        setArticles(result.articles);
        setMenu(cateMenu, result.cates);
        setMenu(seriesMenu, result.series);
    });
}

var articleForm = $('#article-form');
articleForm.submit(saveArticle);
var aidInput = $('<input type="hidden" name="id" />');
function setAid (aid) {
    aidInput.remove();
    if (aid) {
        aidInput.val(aid);
        articleForm.append(aidInput);
    }
}

function setMenu (menu, data) {
    menu.empty();
    if (data) {
        for (var i = 0; i < data.length; i++) {
            menu.append('<li>'+data[i].get('tagName')+'</li>');
        }
    }
}

var cateName = $('#cate-name');
var seriesName = $('#series-name');
var articleContent = $("#article-content");
function setArticle (article) {
    if (article) {
        cateName.val(article.get('category'));
        seriesName.val(article.get('series'));
        articleContent.text(article.get('content'));
        refreshPreview();
        return;
    }
    cateName.val('');
    seriesName.val('');
    articleContent.text('');
    refreshPreview();
}

var blogList = $('.blog-list');
var articlesEmpty = $("#articles-empty");
function setArticles (articles) {
    blogList.empty();
    if (articles && articles.length > 0) {
        articlesEmpty.hide();
        for (var i = 0; i < articles.length; i++) {
            blogList.append(articleItem(articles[i].id, articles[i].get('title'), articles[i].get('category'), articles[i].get('series'), articles[i].get('status')));
        }
        return;
    }
    articlesEmpty.show();
}

function articleItem (id, title, category, series, status) {
    return '<li class="clearfix">'+
            '<div>'+
                '<a href="?id='+id+'" class="col-md-10 clearfix" style="padding-left:5px;padding-right:5px;">'+
                    '<p class="title">'+title+'</p>'+
                    '<label class="category col-md-6 text-left">分类: '+category+'</label>'+
                    '<label class="series col-md-6 text-center">系列: '+series+'</label>'+
                '</a>'+
                '<form onsubmit="return saveArticle(this);" class="col-md-2 text-right clearfix" style="padding-left:0;padding-right:5px">'+
                    '<input type="hidden" name="id" value="'+id+'" />'+
                    '<input type="hidden" name="status" value="'+(status == 1 ? '0' : '1')+'" />'+
                    '<button class="btn '+(status == 1 ? 'btn-warning' : 'btn-primary')+' btn-sm" type="submit">'+(status == 1 ? '撤回' : '发布')+'</button>'+
                '</form>'+
            '</div>'+
        '</li>';
}

function saveArticle (obj) {
    var params = {};
    var data = $((obj.tagName == 'FORM') ? obj : this).serializeArray();
    for (var i = 0; i < data.length; i++) {
        params[data[i].name] = data[i].value;
    }
    AV.Cloud.rpc('saveBlog', params).then(function(article) {
        window.location.href = 'editor.html';
    }, function (error) {
        alert(error);
    });
    return false;
}

function getQueryParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}


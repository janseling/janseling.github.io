$(function () {
    var timelineList = $('#timeline-list');

    function addTimeline (data) {
        if (!data) {
            return;
        }
        var timelineItem = '<li>'+
          '<div class="timeline-bg timeline-item">'+
            '<p class="timeline-time">'+formatTime(data.createdAt, true)+'</p>'+
            '<p class="timeline-content">'+data.get('content')+'</p>';
        if (data.images) {
            timelineItem += '<div class="timeline-image row">'+
              '<div class="col-md-4 col-xs-4">'+
                '<div><img></img></div>'+
              '</div>'+
              '<div class="col-md-4 col-xs-4">'+
                '<div><img></img></div>'+
              '</div>'+
            '</div>';
        }
        timelineItem += '</div></li>';
        timelineList.append(timelineItem);
    }

    function queryTimelines () {
        var query = new AV.Query('Timeline');
        query.descending('createdAt');
        query.find().then(function (timelines) {
            for (var i = 0; i < timelines.length; i++) {
                addTimeline(timelines[i]);
            };
        });
    }

    function formatTime (datetime, compare) {
        if (compare) {
            var diff = (new Date().getTime() - datetime.getTime()) / 1000;
            if (diff < 60) {
                return parseInt(diff) + ' 秒前';
            }
            if (diff < 3600) {
                return parseInt(diff / 60) + ' 分钟前';
            }
            if (diff < 86400) {
                return parseInt(diff / 3600) + ' 小时前';
            }
            if (diff < 604800) {
                return parseInt(diff / 86400) + ' 天前';
            }
        }
        return datetime.getFullYear() + '-' +
            (datetime.getMonth() < 9 ? '0' : '') + (datetime.getMonth() + 1) + '-' +
            (datetime.getDate() < 10 ? '0' : '') + datetime.getDate() + ' ' +
            (datetime.getHours() < 10 ? '0' : '') + datetime.getHours() + ':' +
            (datetime.getMinutes() < 10 ? '0' : '') + datetime.getMinutes() + ':' +
            (datetime.getSeconds() < 10 ? '0' : '') + datetime.getSeconds();
    }

    function countdownCurrent () {
        $('#time-current').html(formatTime(new Date(), false));
        setTimeout(countdownCurrent, 1000);
    }

    function createTimeline () {
        var params = {};
        params['content'] = $('#content').val();

        AV.Cloud.rpc('saveTimeline', params).then(function (timeline) {
            addTimeline(timeline);
            $('#content').val('');
        }, function (error) {
            alert(error);
        });
    }

    if (AV.User.current()) {
        $('#input-wrap').show();
    }
    $('#submit').click(function () {
        createTimeline();
    });
    queryTimelines();
    countdownCurrent();

});

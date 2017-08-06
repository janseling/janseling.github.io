$(function () {
    var timelineList = $('#timeline-list');

    function addTimeline (data) {
        if (!data) {
            return;
        }
        var timelineItem = '<li>'+
          '<div class="timeline-bg timeline-item">'+
            '<p class="timeline-time">'+data.time+'</p>'+
            '<p class="timeline-content">'+data.content+'</p>';
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
        //addTimeline({time:'20秒前', content: 'adqwdqw'});
    });
    queryTimelines();

});

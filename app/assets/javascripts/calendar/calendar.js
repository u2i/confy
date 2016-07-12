$(function () {
    events.forEach(function (event) {
        event.start_time = new Date(event.start_time);
        event.end_time = new Date(event.end_time);
        var tableCell = $("td[data-date='" + event.start_time.getTime() / 1000 + "']");
        var eventElement = tableCell.children('.event-container');
        $.ajax({
            type: 'GET',
            dataType: 'html',
            url: eventUrl + '/' + event.id
        }).success(function (data) {
            eventElement.append(data);
            var length = (event.end_time.getTime() - event.start_time.getTime()) / 1000 / eventTimeGranularity;

            var top = tableCell.offset().top,
                left = tableCell.offset().left,
                width = tableCell.css('width'),
                height = length * parseInt(tableCell.css('height'));
            eventElement.css({top: top, left: left, width: width, height: height + 'px'});
            $('body').append(eventElement);
        }).error(function (xhr, status, err) {
            console.log(err)
        });
    })
});

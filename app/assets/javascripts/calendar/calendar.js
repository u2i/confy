$(function () {

    events.forEach(function (block) {
        var eventWidth = parseInt(getEventTableCell(block[0]).css('width')) / block.length;

        var promises = [];

        block.forEach(function (event) {
            event.start_time = new Date(event.start_time);
            event.end_time = new Date(event.end_time);
            var tableCell = getEventTableCell(event);
            var eventContainer = tableCell.children('.event-container');

            var length = (event.end_time.getTime() - event.start_time.getTime()) / 1000 / eventTimeGranularity;

            promises.push($.ajax({
                type: 'GET',
                dataType: 'html',
                url: eventUrl + '/' + event.id
            }).done(function (data) {
                eventContainer.append(data);
                var height = length * parseInt(tableCell.css('height'));
                getEventElement(eventContainer, event).css({height: height + 'px'});
            }).error(function (xhr, status, err) {
                console.log(err)
            }));

            Promise.all(promises).then(function () {
                var eventsInThisContainer = eventContainer.children('.event').length;
                var width = eventsInThisContainer * eventWidth,
                    offset = (block.indexOf(event) - eventsInThisContainer + 1) * eventWidth;
                eventContainer.css({width: width, 'margin-left': offset});
            });
        });


    });

    $(window).resize(function () {
        events.forEach(function (event) {
            var tableCell = getEventTableCell(event);
            var eventContainer = tableCell.children('.event-container');
            setEventSize(tableCell, eventContainer, event);
        });
    });

    function getEventTableCell(event) {
        if (!event.start_time.getTime) {
            event.start_time = new Date(event.start_time);
            event.end_time = new Date(event.end_time);
        }
        return $("td[data-date='" + event.start_time.getTime() / 1000 + "']");
    }

    function getEventElement(eventContainer, event) {
        return eventContainer.children('.event[data-id="' + event.id + '"]');
    }

    function setEventSize(tableCell, eventContainer, event) {
        var length = (event.end_time.getTime() - event.start_time.getTime()) / 1000 / eventTimeGranularity;

        var width = tableCell.css('width'),
            height = length * parseInt(tableCell.css('height'));
        eventContainer.css({width: width});
        getEventElement(eventContainer, event).css({height: height + 'px'});
    }
});

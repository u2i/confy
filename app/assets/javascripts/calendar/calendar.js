$(function () {
    events.forEach(function (block) {
        var eventWidth = getEventWidth(block);

        block.forEach(function (event) {
            var tableCell = getEventTableCell(event);
            var eventContainer = tableCell.children('.event-container');
            var eventsInThisContainer = block.filter(function (e) {
                return e.start_time == event.start_time;
            }).length;

            var width = eventsInThisContainer * eventWidth,
                offset = (block.indexOf(event) - eventsInThisContainer + 1) * eventWidth;
            eventContainer.css({width: width, 'margin-left': offset});

            var length = (new Date(event.end_time).getTime() - new Date(event.start_time).getTime()) / 1000 / eventTimeGranularity;

            $.ajax({
                type: 'GET',
                dataType: 'html',
                url: eventUrl + '/' + event.id
            }).done(function (data) {
                eventContainer.append(data);
                var height = length * parseInt(tableCell.css('height'));
                getEventElement(eventContainer, event).css({height: height + 'px'});
            });
        });
    });

    $(window).resize(function () {
        events.forEach(function (block) {
            block.forEach(function (event) {
                var tableCell = getEventTableCell(event);
                var eventContainer = tableCell.children('.event-container');
                setEventSize(eventContainer, block, event);
            });
        });
    });

    function getEventWidth(block) {
        return parseInt(getEventTableCell(block[0]).css('width')) / block.length;
    }

    function getEventTableCell(event) {
        return $("td[data-date='" + new Date(event.start_time).getTime() / 1000 + "']");
    }

    function getEventElement(eventContainer, event) {
        return eventContainer.children('.event[data-id="' + event.id + '"]');
    }

    function setEventSize(eventContainer, block, event) {
        var eventWidth = getEventWidth(block);

        var eventsInThisContainer = block.filter(function (e) {
            return e.start_time == event.start_time;
        }).length;

        var width = eventsInThisContainer * eventWidth,
            offset = (block.indexOf(event) - eventsInThisContainer + 1) * eventWidth;
        eventContainer.css({width: width, 'margin-left': offset});
    }
});

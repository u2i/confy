$(function () {
    fetchEvents();
    $(window).resize(updateEvents);

    function fetchEventPartial(event) {
        $.ajax({
            type: 'GET',
            dataType: 'html',
            url: eventUrl + '/' + event.id
        }).done(function (data) {
            var eventContainer = getEventContainer(event);
            eventContainer.append(data);

            getEventElement(eventContainer, event).css({height: eventHeight(event) + 'px'});
        });
    }

    function fetchEvents() {
        blocks.forEach(function (block) {
            block.forEach(function (event) {
                fetchEventPartial(event);
                setEventContainerSize(block, event);
            });
        });
    }

    function updateEvents() {
        blocks.forEach(function (block) {
            block.forEach(function (event) {
                setEventContainerSize(block, event);
            });
        });
    }

    function eventWidth(block) {
        return parseInt(getEventTableCell(block[0]).css('width')) / block.length;
    }

    function eventHeight(event) {
        return eventLengthInSeconds(event) * parseInt(getEventTableCell(event).css('height'));
    }

    function getEventTableCell(event) {
        return $("td[data-date='" + new Date(event.start_time).getTime() / 1000 + "']");
    }

    function getEventContainer(event) {
        return getEventTableCell(event).children('.event-container');
    }

    function getEventElement(eventContainer, event) {
        return eventContainer.children('.event[data-id="' + event.id + '"]');
    }

    function setEventContainerSize(block, event) {
        var eventContainer = getEventContainer(event);

        var eventsInThisContainer = block.filter(function (e) {
            return e.start_time == event.start_time;
        }).length;

        var width = eventsInThisContainer * eventWidth(block),
            offset = (block.indexOf(event) - eventsInThisContainer + 1) * width;
        eventContainer.css({width: width, 'margin-left': offset});
    }

    function eventLengthInSeconds(event) {
        return (new Date(event.end_time).getTime() - new Date(event.start_time).getTime()) / 1000 / eventTimeGranularity;
    }
});

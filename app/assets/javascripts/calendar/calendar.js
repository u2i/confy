$(document).on('turbolinks:load', (function () {
    function fetchEventPartial(event) {
        var parent = getEventContainer(event);
        var partial = document.createElement("div");
        partial.setAttribute('data-id', event.id);
        partial.setAttribute('class', 'event');
        partial.setAttribute('style', 'background-color: ' + event.conference_room.color);
        // TEMPORARY HACK
        partial.innerHTML =  ['<div class="event-time">', moment(event.start.date_time).format("HH:mm"), '</div>',
            '<div class="event-name">', event.summary, '</div>',
            '<div class="event-user">',
        '<small>by</small>', event.creator.displayName, '</div>',
            '<div class="event-location">',
        '<small>in</small>', event.conference_room.title, '</div>'].join('\n');
        parent.append(partial);
        getEventElement(parent, event).css({height: eventHeight(event) + 'px'});
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
        time = new Date(event.start.date_time).getTime() / 1000;
        return $("td[data-date='" + time + "']");
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
            return e.start.date_time == event.start.date_time;
        }).length;

        var width = eventsInThisContainer * eventWidth(block),
            offset = (block.indexOf(event) - eventsInThisContainer + 1) * eventWidth(block);

        eventContainer.css({width: width, 'margin-left': offset});
    }

    function eventLengthInSeconds(event) {
        var startTimestamp = new Date(event.start.date_time).getTime(),
            endTimestamp = new Date(event.end.date_time).getTime();
        return (endTimestamp - startTimestamp) / 1000 / unitEventLength;
    }

    fetchEvents();
    $(window).resize(updateEvents);

}));

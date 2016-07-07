// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

$(function () {
    var startTimePicker = $('#start-time-picker');
    var endTimePicker = $('#end-time-picker');
    startTimePicker.datetimepicker();
    endTimePicker.datetimepicker({
        useCurrent: false
    });

    var startData = startTimePicker.data('DateTimePicker');
    var endData = endTimePicker.data('DateTimePicker');

    startTimePicker.on('dp.change', function (e) {
        endData.minDate(e.date);
        if (!endData.date()) {
            endData.date(e.date);
        }
    });
    endTimePicker.on('dp.change', function (e) {
        startData.maxDate(e.date);
        if (!startData.date()) {
            startData.date(e.date);
        }
    });
});
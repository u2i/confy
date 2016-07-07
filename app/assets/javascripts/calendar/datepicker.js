$(function () {
    var DATE_FORMAT = 'DD/MM/YYYY HH:mm';

    var startTimePicker = $('#start-time-picker');
    var endTimePicker = $('#end-time-picker');
    startTimePicker.datetimepicker({
        format: DATE_FORMAT
    });
    endTimePicker.datetimepicker({
        useCurrent: false,
        format: DATE_FORMAT
    });

    var startData = startTimePicker.data('DateTimePicker');
    var endData = endTimePicker.data('DateTimePicker');

    startTimePicker.on('dp.change', function (e) {
        var endDate = endData.date();
        if (!endDate || endDate < startData.date()) {
            endData.date(e.date);
        }
    });
    endTimePicker.on('dp.change', function (e) {
        var startDate = startData.date();
        if (!startDate || startDate > endData.date()) {
            startData.date(e.date);
        }
    });
});

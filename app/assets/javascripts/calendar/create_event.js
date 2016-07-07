$(function () {
    $('#create-event-form').on('ajax:success', function () {
        $('#create-event-modal').modal('hide');
    }).on('ajax:error', function (e, xhr, status, err) {
        $('#create-event-error').text('Failed to create event: ' + err).show();
    })
});

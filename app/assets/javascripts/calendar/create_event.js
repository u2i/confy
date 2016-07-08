$(function () {
    $(document).on('ajax:success', '#create-event-form', function () {
        $('#create-event-modal').modal('hide');
    }).on('ajax:error', '#create-event-error', function (e, xhr, status, err) {
        $('#create-event-error').text('Failed to create event: ' + err).show();
    })
});

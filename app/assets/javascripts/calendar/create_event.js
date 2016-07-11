$(function () {
    $(document).on('ajax:success', '#create-event-form', function () {
        $('#create-event-modal').modal('hide');
        window.location.reload();
    }).on('ajax:error', '#create-event-form', function (e, xhr, status, err) {
        $('#create-event-error').text('Failed to create event: ' + err).show();
    })
});

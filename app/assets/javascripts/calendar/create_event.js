$(function () {
    $(document).on('ajax:success', '#create-event-form', function () {
        $('#create-event-modal').modal('hide');
        $('#create-event-form')[0].reset(); // Equivalent to document.getElementById("create-event-form")
    }).on('ajax:error', '#create-event-form', function (e, xhr, status, err) {
        $('#create-event-error').text('Failed to create event: ' + err).show();
    })
});

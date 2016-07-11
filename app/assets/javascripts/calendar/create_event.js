$(function () {
    $(document).on('ajax:success', '#create-event-form', function () {
        $('#create-event-modal').modal('hide');
    }).on('ajax:error', '#create-event-form', function (e, xhr) {
        var responseObj = JSON.parse(xhr.responseText);

        $('.form-group').removeClass('has-error')
            .children('.error-text').empty();

        Object.getOwnPropertyNames(responseObj)
            .forEach(function (propName) {
                var fieldGroup = $('#' + propName + '-field-group');
                fieldGroup.addClass('has-error')
                    .children('.error-text').text(responseObj[propName][0]);
            });
    });
});

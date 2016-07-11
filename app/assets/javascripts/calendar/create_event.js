$(function () {
    $(document).on('ajax:success', '#create-event-form', function () {
        $('#create-event-modal').modal('hide');
    }).on('ajax:error', '#create-event-form', function (e, xhr) {
        var responseObj = JSON.parse(xhr.responseText);
        var errorElem = $('#create-event-error');
        errorElem.empty();
        var errorList = errorElem.append('<ul></ul>');

        Object.getOwnPropertyNames(responseObj)
            .forEach(function (propName) {
                responseObj[propName].forEach(function (error) {
                    errorList.append('<li>' + error + '</li>')
                });
            });

        errorElem.show();
    });
});

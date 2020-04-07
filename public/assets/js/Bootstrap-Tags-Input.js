$(document).ready(function() {
    $('input[data-role="tagsinput"]').each(function (index, el) {
        var labelClass = el.dataset.class;
        if (labelClass) {
            $(el).tagsinput({
                tagClass: function () {
                    return 'label ' + labelClass;
                }
            });
        }
    });
});

jQuery.fn.overlabel = function (targField) {

    this.each(function () {
        var label = AJS.$(this)
                .removeClass("overlabel")
                .addClass("overlabel-apply")
                .click(function(e) {
                    field.focus();
                    e.preventDefault();
                });

        var field = targField || AJS.$("#" + label.attr("for"));

        field.focus(function() {
            label.addClass("hidden");
        }).blur(function() {
            if (AJS.$(this).val() === "")
            {
                label.removeClass("hidden");
            }
        });

        if (field.val() && field.val() !== "") {
            label.addClass("hidden");
        }
    });
    return this;

};

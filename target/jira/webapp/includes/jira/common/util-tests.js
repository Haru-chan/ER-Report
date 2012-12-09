AJS.test.require("jira.webresources:jira-global");

(function () {

    module("Generic Util Tests", {
        setup: function() {
            this.$element = AJS.$("<input />");
            AJS.$("body").append(this.$element);
        },
        teardown: function() {
            this.$element.remove();
            this.$element = null;
        }
    });

    test("jQuery element is focused", function () {
        this.$element.focus();
        ok(AJS.elementIsFocused(this.$element), "jQuery element is focused.");
    });

    test("non jQuery element is focused", function () {
        this.$element.focus();
        ok(AJS.elementIsFocused(this.$element.get(0)), "non jQuery element is focused.");
    });

    test("jQuery element is not focused when blurred", function () {
        this.$element.focus();
        this.$element.blur();
        ok(!AJS.elementIsFocused(this.$element.get(0)), "non jQuery element is focused.");
    });

})();
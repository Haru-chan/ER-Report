(function ($) {

    function createPriorityPicker(context) {

        // @see JRADEV-9286
        // Disable AJS.SingleSelect for priority fields.
        //   - This is a temporary workaround.
        //   - The currently selected value is absent from the dropdown list,
        //     which makes it confusing to use AJS.SingleSelect with priority fields.
        // TODO: Remove this behaviour from AJS.SingleSelect, then re-enable priority fields.
        return;

        context.find("select#priority").each(function (i, el) {
            new AJS.SingleSelect({
                element: el,
                revertOnInvalid: true
            });
        });
    }

    JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, function (e, context) {
        createPriorityPicker(context);
    });

})(AJS.$);
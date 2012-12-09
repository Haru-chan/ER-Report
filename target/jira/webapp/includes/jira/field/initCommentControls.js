(function () {

    function applyCommentControls(context) {

        context = context || document.body;

        new AJS.SecurityLevelSelect(AJS.$("#commentLevel", context));
        var wikiRenders = jQuery(".wiki-js-prefs", context);
        wikiRenders.each(function() {
            JIRA.wikiPreview(this, context).init();
        });
    }

    JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, function (e, context) {
        applyCommentControls(context);
    });
})();

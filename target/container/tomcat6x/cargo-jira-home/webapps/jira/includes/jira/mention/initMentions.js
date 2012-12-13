AJS.$(function() {

    var mentionsController;

    function initMentions() {
        if (!mentionsController) {
            mentionsController = new JIRA.Mention();
        }
        mentionsController.textarea(this);
    }

    AJS.$(document).delegate(".mentionable", "focus", initMentions);
    AJS.$(".mentionable").each(initMentions);
});
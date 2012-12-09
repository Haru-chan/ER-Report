AJS.$(function() {

    AJS.$("#admin-quicknav-trigger").click(function(e) {
        jira.app.adminQuickNavDialog.show();
        e.preventDefault();
    });

    var adminSummaryLink = AJS.$("#admin_summary");
    if (adminSummaryLink) {
        adminSummaryLink.parent().click(function () {
            window.location = adminSummaryLink.attr("href");
        });
    }
});

JIRA.bind("QuickCreateIssue.sessionComplete", function (e, issues) {
    var html;
    if (issues && issues.length === 1) {
        html = JIRA.Issue.issueCreatedMessage(issues[0]);
        JIRA.Messages.showSuccessMsg(html, {
            closeable: true
        });
    } else {
        html = JIRA.Issue.issueCreatedMessage(issues[issues.length-1]);
        JIRA.Messages.showSuccessMsg(html, {
            closeable: true
        });
    }
});

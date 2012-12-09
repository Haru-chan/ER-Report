/**
 * @namespace JIRA.Dialogs
 */
JIRA.Dialogs = {};


JIRA.Dialogs.getDefaultAjaxOptions = function () {

    var $focusRow = JIRA.IssueNavigator.get$focusedRow();
    var linkIssueURI = this.options.url || this.getRequestUrlFromTrigger();


    if (/id=\{0\}/.test(linkIssueURI)) {
        if (!$focusRow.length) {
            return false;
        } else {
            linkIssueURI = linkIssueURI.replace(/(id=\{0\})/, "id=" + $focusRow.attr("rel"));
        }
    }

    if (JIRA.IssueNavigator.isNavigator()) {
        var result = /[?&]id=([0-9]+)/.exec(linkIssueURI);
        this.issueId = result && result.length == 2 ? result[1] : null;
        if(this.issueId !== $focusRow.attr("rel")) {
            //if the issue id doesn't match the focused row's issue id then reassign focus and get the
            //issuekey from the newly focused row! This can happen when clicking the pencil for the
            //labels picker.
            JIRA.IssueNavigator.Shortcuts.focusRow(this.issueId);
            $focusRow = JIRA.IssueNavigator.get$focusedRow();
        }
        this.issueKey = JIRA.IssueNavigator.getSelectedIssueKey();
    }

    return {
        data: {decorator: "dialog", inline: "true"},
        url: linkIssueURI
    };
};


/**
* Stores the current issue id into session storage if the dialogs submits successfully
*/
JIRA.Dialogs.storeCurrentIssueIdOnSucessfulSubmit = function () {
    if (JIRA.IssueNavigator.isNavigator()) {
        JIRA.IssueNavigator.setIssueUpdatedMsg({
            issueMsg: this.options.issueMsg,
            issueId: this.issueId,
            issueKey: this.issueKey
        });
    }
    this.issueId = null;
    this.issueKey = null;
};

<%@ page import="com.atlassian.jira.plugin.keyboardshortcut.KeyboardShortcutManager" %>
<%@ page import="com.atlassian.jira.ComponentManager" %>
<%@ taglib prefix="ww" uri="webwork" %>
<%@ taglib prefix="aui" uri="webwork" %>
<%@ taglib prefix="page" uri="sitemesh-page" %>
<html>
<head>
    <ww:if test="/validToView == true">
        <title><ww:text name="'linkissue.title'"/></title>
        <meta name="decorator" content="issueaction" />
        <%
            KeyboardShortcutManager keyboardShortcutManager = ComponentManager.getComponentInstanceOfType(KeyboardShortcutManager.class);
            keyboardShortcutManager.requireShortcutsForContext(KeyboardShortcutManager.Context.issuenavigation);
        %>
        <link rel="index" href="<ww:url value="/issuePath" atltoken="false"/>" />
    </ww:if>
    <ww:else>
        <title><ww:text name="'common.words.error'"/></title>
        <meta name="decorator" content="message" />
    </ww:else>
</head>
<body>
    <page:applyDecorator id="issue-link" name="auiform">

        <page:param name="action">LinkExistingIssue.jspa</page:param>
        <page:param name="submitButtonName">Link</page:param>
        <page:param name="showHint">true</page:param>
        <ww:property value="/hint('link')">
            <ww:if test=". != null">
                <page:param name="hint"><ww:property value="./text" escape="false" /></page:param>
                <page:param name="hintTooltip"><ww:property value="./tooltip" escape="false" /></page:param>
            </ww:if>
        </ww:property>

        <aui:component template="issueFormHeading.jsp" theme="'aui/dialog'">
            <aui:param name="'title'"><ww:text name="'linkissue.title'"/></aui:param>
            <aui:param name="'subtaskTitle'"><ww:text name="'linkissue.title.subtask'"/></aui:param>
            <aui:param name="'issueKey'"><ww:property value="/issueObject/key"  escape="false"/></aui:param>
            <aui:param name="'issueSummary'"><ww:property value="/issueObject/summary"  escape="false"/></aui:param>
            <aui:param name="'cameFromSelf'" value="/cameFromIssue"/>
            <aui:param name="'cameFromParent'" value="/cameFromParent"/>
        </aui:component>

        <page:param name="submitButtonText"><ww:text name="'linkissue.submitname'"/></page:param>
        <page:param name="cancelLinkURI"><ww:url value="/issuePath" atltoken="false"/></page:param>

        <aui:component name="'id'" template="hidden.jsp" theme="'aui'" />

        <ww:if test="/validToView == true">

            <div class="action-description"><ww:text name="'linkissue.desc'"/></div>

            <page:param name="legend"><ww:text name="'linkissue.issue.details'"/></page:param>

            <page:applyDecorator name="auifieldgroup">
                <aui:param name="'description'"><ww:text name="'linkissue.this.desc'"/></aui:param>
                <aui:select id="'link-type'" label="text('linkissue.this')" list="linkDescs" listKey="'.'" listValue="'.'" name="'linkDesc'" theme="'aui'" />
            </page:applyDecorator>

            <page:applyDecorator name="auifieldgroup">
                <aui:component label="text('common.concepts.issues')" name="'linkKey'" theme="'aui'" template="issuepicker.jsp">
                    <aui:param name="'size'" value="18"/>
                    <aui:param name="'formname'" value="'jiraform'"/>
                    <aui:param name="'currentIssue'" value="issue/string('key')" />
                    <aui:param name="'currentJQL'" value="/currentJQL" />
                    <aui:param name="'currentValue'" value="/currentValue" />
                </aui:component>
            </page:applyDecorator>

            <%@ include file="/includes/panels/updateissue_comment.jsp" %>

        </ww:if>
        <ww:else>
            <page:param name="submitButtonDisabled">true</page:param>
            <ww:if test="/linkDescs/empty == true">
                <div class="aui-message warning">
                    <span class="aui-icon icon-warning"></span>
                    <ww:text name="'linkissue.error.no.link.types'"/>
                </div>
            </ww:if>
            <ww:else>
                <header>
                    <h1><ww:text name="'common.words.error'"/></h1>
                </header>
                <%@ include file="/includes/issue/generic-errors.jsp" %>
            </ww:else>
        </ww:else>

    </page:applyDecorator>
</body>
</html>

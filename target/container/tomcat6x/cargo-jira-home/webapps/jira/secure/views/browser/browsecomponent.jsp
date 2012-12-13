<%@ taglib uri="webwork" prefix="ww" %>
<%@ page import="com.atlassian.plugin.webresource.WebResourceManager" %>
<%@ page import="com.atlassian.jira.ComponentManager" %>
<html>
<head>
    <title><ww:property value="/project/name" />: <ww:property value="/component/name" /></title>
    <content tag="section">browse_link</content>
    <%
        // Plugins 2.5 allows us to perform context-based resource inclusion. This defines the context "browse.component"
        WebResourceManager webResourceManager = ComponentManager.getInstance().getWebResourceManager();
        webResourceManager.requireResourcesForContext("jira.browse");
        webResourceManager.requireResourcesForContext("jira.browse.component");
    %>
    <script type="text/javascript">window.dhtmlHistory.create();</script>
</head>
<body>
    <header>
        <ww:if test="/hasCreateIssuePermissionForProject == true">
            <div id="create-issue">
                <h2><ww:text name="'common.words.create'" />:</h2>
                <ul class="operations">
                    <ww:iterator value="/popularIssueTypes">
                        <li>
                            <a class="create-issue-type lnk" data-pid="<ww:property value="/project/id" />" data-issue-type="<ww:property value="./id" />"  title="<ww:property value="./descTranslation"/>" href="<ww:url value="'/secure/CreateIssue.jspa'" atltoken="false"><ww:param name="'pid'" value="/project/id" /><ww:param name="'issuetype'" value="./id" /></ww:url>"><img src="<ww:url value="./iconUrl" atltoken="false" />" alt=""/><ww:property value="./nameTranslation"/></a>
                        </li>
                    </ww:iterator>
                    <ww:if test="/otherIssueTypes/empty == false">
                        <li class="aui-dd-parent">
                            <a id="more" class="lnk aui-dd-link standard no-icon" href="#" title="<ww:text name="'browseproject.create.other.issue.type'" />"><span><ww:text name="'common.words.other.no.dots'" /></span></a>
                            <div class="aui-list hidden">
                                <ul id="more-dropdown">
                                     <ww:iterator value="/otherIssueTypes">
                                        <li class="aui-list-item">
                                            <a class="aui-list-item-link create-issue-type aui-iconised-link" data-pid="<ww:property value="/project/id" />" data-issue-type="<ww:property value="./id" />" style="background-image:url(<ww:url value="./iconUrl" atltoken="false" />)" title="<ww:property value="./descTranslation"/>" href="<ww:url value="'/secure/CreateIssue.jspa'" atltoken="false"><ww:param name="'pid'" value="/project/id" /><ww:param name="'issuetype'" value="./id" /></ww:url>"><ww:property value="./nameTranslation"/></a>
                                        </li>
                                    </ww:iterator>
                                </ul>
                            </div>
                        </li>
                    </ww:if>
                </ul>
            </div>
        </ww:if>
        <ww:if test="/project/avatar != null">
            <div id="heading-avatar">
                <img id="project-avatar" alt="<ww:property value="/project/name"/>" class="project-avatar-48" height="48" src="<ww:url value="'/secure/projectavatar'" atltoken="false"><ww:param name="'pid'" value="/project/id" /><ww:param name="'avatarId'" value="/project/avatar/id" /><ww:param name="'size'" value="'large'" /></ww:url>" width="48" />
            </div>
        </ww:if>
        <ul class="breadcrumbs">
            <li>
                <a href="<ww:url value="'/browse/' + /project/key + '#selectedTab=com.atlassian.jira.plugin.system.project:summary-panel'" atltoken="false" />" title="<ww:property value="text('browsecomponent.back.to.desc', /browseProjectTabLabel, /project/name)" />"><ww:property value="/project/name" />:</a>
            </li>
        </ul>
        <h1><ww:property value="/component/name" /></h1>
    </header>
    <div class="content-container">
        <div class="content-related">
            <ul class="vertical tabs">
                <ww:iterator value="/componentTabPanels" status="'status'">
                    <li class="<ww:if test="/selected == completeKey">active</ww:if> <ww:if test="@status/first == true"> first</ww:if>">
                        <a class="browse-tab" id="<ww:if test="./completeKey/startsWith('com.atlassian.jira.plugin.system.')"><ww:property value="./key"/></ww:if><ww:else><ww:property value="./completeKey"/></ww:else>-panel" href="<ww:url value="'/browse/' + /project/key + '/component/' + /component/id" atltoken="false"><ww:param name="'selectedTab'" value="completeKey"/></ww:url>"><strong><ww:property value="label" /></strong></a>
                    </li>
                </ww:iterator>
            </ul>
        </div>
        <div id="project-tab" class="content-body aui-panel" data-project-key="<ww:property value="/project/key" />">
            <ww:property value="/tabHtml" escape="false" />
        </div>
    </div>
</body>
</html>

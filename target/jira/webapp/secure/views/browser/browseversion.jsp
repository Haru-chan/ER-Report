<%@ taglib uri="webwork" prefix="ww" %>
<%@ page import="com.atlassian.jira.ComponentManager" %>
<%@ page import="com.atlassian.plugin.webresource.WebResourceManager" %>
<html>
<head>
    <title><ww:property value="/project/name" />: <ww:property value="/version/name" /></title>
    <content tag="section">browse_link</content>
    <%
        // Plugins 2.5 allows us to perform context-based resource inclusion. This defines the context "browse.version"
        WebResourceManager webResourceManager = ComponentManager.getInstance().getWebResourceManager();
        webResourceManager.requireResourcesForContext("jira.browse");
        webResourceManager.requireResourcesForContext("jira.browse.version");
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
        <h1><ww:property value="/version/name" /></h1>
        <ul class="version-navigation">
            <ww:property value="/nextAndPreviousVersions">
                <ww:if test="./previous">
                    <li class="previous" >
                        <a title="<ww:text name="'browseversion.browse.previous'"/>" href="<ww:url value="'/browse/' + /project/key + '/fixforversion/' + ./previous/id" atltoken="false" />"><img src="<ww:url value="'/images/icons/arrow_left_faded.gif'" atltoken="false" />" alt="<ww:text name="'browseversion.browse.previous'"/>"><span><ww:property value="./previous/name"/></span></a>|
                    </li>
                </ww:if>
                <li class="current">
                    <span><ww:property value="/version/name"/></span>
                </li>
                <ww:if test="./next">
                    <li class="next" >
                        |<a title="<ww:text name="'browseversion.browse.next'"/>" href="<ww:url value="'/browse/' + /project/key + '/fixforversion/' + ./next/id" atltoken="false" />"><span><ww:property value="./next/name"/></span><img src="<ww:url value="'/images/icons/arrow_right_faded.gif'" atltoken="false" />" alt="<ww:text name="'browseversion.browse.next'"/>"></a>
                    </li>
                </ww:if>
            </ww:property>
        </ul>
    </header>
    <div class="content-container">
        <div class="content-related">
            <ul class="vertical tabs">
                <ww:iterator value="/versionTabPanels" status="'status'">
                    <li class="<ww:if test="/selected == completeKey">active</ww:if> <ww:if test="@status/first == true"> first</ww:if>">
                        <a id="<ww:if test="./completeKey/startsWith('com.atlassian.jira.plugin.system.')"><ww:property value="./key"/></ww:if><ww:else><ww:property value="./completeKey"/></ww:else>-panel" class="browse-tab" href="<ww:url value="'/browse/' + /project/key + '/fixforversion/' + /version/id" atltoken="false"><ww:param name="'selectedTab'" value="completeKey"/></ww:url>"><strong><ww:property value="label" /></strong></a>
                    </li>
                </ww:iterator>
            </ul>
        </div>
        <div id="project-tab" class="content-body aui-panel">
            <ww:property value="/tabHtml" escape="false" />
        </div>
    </div>
<fieldset class="hidden parameters">
    <input type="hidden" id="project-key" value="<ww:property value="/project/key"/>"/>
    <input type="hidden" id="version-id" value="<ww:property value="/version/id"/>"/>
</fieldset>

</body>
</html>

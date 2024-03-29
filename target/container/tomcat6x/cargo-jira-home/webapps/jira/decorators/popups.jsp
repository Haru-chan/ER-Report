<%@ page import="com.atlassian.plugin.webresource.WebResourceManager" %>
<%@ taglib uri="sitemesh-decorator" prefix="decorator" %>
<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="jiratags" prefix="jira" %>
<%
    // Plugins 2.5 allows us to perform context-based resource inclusion. This defines the context "atl.error"
    final WebResourceManager webResourceManager = ComponentManager.getComponent(WebResourceManager.class);
    webResourceManager.requireResourcesForContext("atl.popup");
    webResourceManager.requireResourcesForContext("jira.popup");
%>
<decorator:usePage id="decoratorPage"/>
<!DOCTYPE html>
<html>
<head>
    <%@ include file="/includes/decorators/aui-layout/head-common.jsp" %>
    <%@ include file="/includes/decorators/aui-layout/head-resources.jsp" %>
    <decorator:head/>
</head>
<body id="jira" class="aui-layout aui-theme-default page-type-popup <decorator:getProperty property="body.class" />">
<div id="page">
    <%--<%@ include file="/includes/decorators/aui-layout/notifications-content.jsp" %>--%>
    <section id="content" role="main">
        <decorator:body />
    </section>
</div>
</body>
</html>

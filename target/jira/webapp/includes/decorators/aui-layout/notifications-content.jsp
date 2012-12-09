<%@ page import="com.atlassian.jira.config.properties.APKeys" %>
<%@ page import="org.apache.log4j.Logger" %>
<%--<section class="notifications">--%>
    <%--<ul>--%>
        <%--<li>--%>
            <%--<div>Content-specific notifications - pluggable</div>--%>
        <%--</li>--%>
    <%--</ul>--%>
<%--</section>--%>
<%
    // This should always be included as it is not part of a themable plugin, instead it is core functionality
    final Logger log = Logger.getLogger("includes.decorators.bodytop");
    boolean userLoggedIn;
    String alertHeader = ap.getDefaultBackedText(APKeys.JIRA_ALERT_HEADER);
    String alertHeaderVisibility = ap.getDefaultBackedString(APKeys.JIRA_ALERT_HEADER_VISIBILITY);
    try
    {
        userLoggedIn = (SecurityUtils.getAuthenticator(pageContext.getServletContext()).getUser((HttpServletRequest) pageContext.getRequest()) != null);
    }
    catch (Exception e)
    {
        log.error(e);
        throw new RuntimeException(e);
    }

    if (alertHeader != null && alertHeader.trim().length() > 0 && ("public".equals(alertHeaderVisibility) || userLoggedIn))
        {
%>
<div id="announcement-banner" class="alertHeader">
<%= alertHeader %>
</div>
<% } %>

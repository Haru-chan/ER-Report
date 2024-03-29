<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<%@ taglib uri="jiratags" prefix="jira" %>
<html>
<head>
    <title><ww:text name="'portal.edit.and.share.page'"/></title>
    <content tag="section">home_link</content>
</head>
<body class="page-type-issuenav">
<!-- TODO: SEAN discuss removing the left hand panel of these pages so we could dialog them. -->
    <header>
        <h1><ww:text name="'portal.edit.and.share.page'"/></h1>
    </header>
    <div id="issuenav" class="content-container<ww:if test="/conglomerateCookieValue('jira.toggleblocks.cong.cookie','lhc-state')/contains('#issuenav') == true"> lhc-collapsed</ww:if>">
        <div class="content-related">
            <a class="toggle-lhc" href="#" title="<ww:text name="'jira.issuenav.toggle.lhc'" />"><ww:text name="'jira.issuenav.toggle.lhc'" /></a>
            <jira:formatuser user="/user" type="'fullProfile'" id="'edit_portal'"/>
        </div>
        <div class="content-body aui-panel">
            <page:applyDecorator name="jiraform">
                <page:param name="action">EditPortalPage.jspa</page:param>
                <page:param name="cancelURI">ConfigurePortalPages!default.jspa</page:param>
                <page:param name="submitId">update_submit</page:param>
                <page:param name="submitName"><ww:text name="'common.forms.update'"/></page:param>
                <page:param name="width">100%</page:param>
                <page:param name="labelWidth">20%</page:param>
                <page:param name="helpURL">portlets.dashboard_pages</page:param>
                <page:param name="helpURLFragment">#editing_dashboards</page:param>
                <page:param name="title"><ww:text name="'portal.edit.and.share.page'"/></page:param>

                <ui:textfield label="text('common.words.name')" name="'portalPageName'" size="30">
                    <ui:param name="'mandatory'">true</ui:param>
                </ui:textfield>
                <ui:textarea label="text('common.concepts.description')" name="'portalPageDescription'" cols="40" rows="3" />

                <tr>
                    <td class="fieldLabelArea"><ww:text name="'common.favourites.favourite'"/>:</td>
                    <td class="fieldValueArea">
                        <ww:component name="'favourite'" template="favourite-new.jsp">
                            <ww:param name="'enabled'"><ww:property value="./favourite" /></ww:param>
                            <ww:param name="'fieldId'">favourite</ww:param>
                            <ww:param name="'entityType'">PortalPage</ww:param>
                        </ww:component>
                    </td>
                </tr>
                <ww:if test="/showShares == true">
                    <ww:component name="'shares'" label="text('common.sharing.shares')" template="edit-share-types.jsp">
                        <ww:param name="'shareTypeList'" value="/shareTypes"/>
                        <ww:param name="'noJavaScriptMessage'">
                           <ww:text name="'common.sharing.no.share.javascript'"/>
                        </ww:param>
                        <ww:param name="'editEnabled'" value="/editEnabled"/>
                        <ww:param name="'dataString'" value="/jsonString"/>
                        <ww:param name="'submitButtonId'">update_submit</ww:param>
                    </ww:component>
                </ww:if>
                <ui:component name="'pageId'" template="hidden.jsp" theme="'single'" />
            </page:applyDecorator>
        </div>
    </div>
</body>
</html>

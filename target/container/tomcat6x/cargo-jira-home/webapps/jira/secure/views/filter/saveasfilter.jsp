<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<html>
<head>
	<title><ww:text name="'saveasfilter.title'"/></title>
    <content tag="section">find_link</content>
</head>
<body class="page-type-issuenav">
    <header>
        <ww:if test="(/hasAnyErrors == false && /searchResults) || /mode == 'hide'">
            <jsp:include page="/includes/navigator/table/header.jsp"/>
        </ww:if>
        <ww:else>
            <h1>
                <ww:property value="text('navigator.title')"/><ww:if test="searchRequest/name"> &mdash; <ww:property value="searchRequest/name"/></ww:if>
            </h1>
        </ww:else>
    </header>
    <div id="issuenav" class="content-container<ww:if test="/conglomerateCookieValue('jira.toggleblocks.cong.cookie','lhc-state')/contains('#issuenav') == true"> lhc-collapsed</ww:if>">
        <div class="content-related">
            <a class="toggle-lhc" href="#" title="<ww:text name="'jira.issuenav.toggle.lhc'" />"><ww:text name="'jira.issuenav.toggle.lhc'" /></a>
            <jsp:include page="/includes/navigator/summary-pane.jsp" />
        </div>
        <div class="content-body aui-panel">
            <page:applyDecorator name="auiform">
                <page:param name="action">SaveAsFilter.jspa</page:param>
                <page:param name="submitButtonName">saveasfilter_submit</page:param>
                <page:param name="submitButtonText"><ww:text name="'saveasfilter.submit'"/></page:param>
                <page:param name="cancelLinkURI"><ww:url value="'/secure/IssueNavigator.jspa'" atltoken="false"/></page:param>

                <aui:component template="formHeading.jsp" theme="'aui'">
                    <aui:param name="'text'"><ww:text name="'saveasfilter.title'"/></aui:param>
                    <aui:param name="'helpURL'">issue_filters</aui:param>
                    <aui:param name="'helpURLFragment'">#saving_filters</aui:param>
                </aui:component>

                <%--Used for warnings of filter share options--%>
                <div id="share_warning"></div>

                <page:applyDecorator name="auifieldgroup">
                    <aui:textfield id="'filterName'" label="text('common.words.name')" mandatory="true" name="'filterName'" size="'long'" theme="'aui'" />
                </page:applyDecorator>

                <page:applyDecorator name="auifieldgroup">
                    <aui:textarea id="'filterDescription'" label="text('common.concepts.description')" mandatory="false" name="'filterDescription'" rows="4" size="'long'" theme="'aui'" />
                </page:applyDecorator>

                <ww:if test="./searchRequest/useColumns() == false">
                    <page:applyDecorator name="auifieldset">
                        <page:param name="legend"><ww:text name="'saveasfilter.columnOrder'"/></page:param>
                        <aui:select id="'saveColumnLayout'" label="text('saveasfilter.columnOrder')" mandatory="false" name="'saveColumnLayout'" theme="'aui'" template="radiomap.jsp"
                                list="/columnLayoutTypes" listKey="'key'" listValue="'value'">
                            <aui:param name="'description'"><ww:text name="'saveasfilter.columnOrder.desc'"/></aui:param>
                            <aui:param name="'selectedValue'" value="'2'" />
                        </aui:select>
                    </page:applyDecorator>
                </ww:if>

                <page:applyDecorator name="auifieldgroup">
                    <ww:component template="formFieldLabel.jsp" label="text('common.favourites.favourite')" theme="'aui'"/>
                    <ww:component name="'favourite'" template="favourite-new.jsp" theme="'aui'">
                        <ww:param name="'enabled'"><ww:property value="./favourite" /></ww:param>
                        <ww:param name="'fieldId'">favourite</ww:param>
                        <ww:param name="'entityType'">SearchRequest</ww:param>
                    </ww:component>
                </page:applyDecorator>


                <ww:if test="/showShares == true">
                    <ww:component name="'shares'" label="text('common.sharing.shares')" template="edit-share-types.jsp" theme="'aui'">
                        <ww:param name="'shareTypeList'" value="/shareTypes"/>
                        <ww:param name="'editEnabled'" value="/editEnabled"/>
                        <ww:param name="'dataString'" value="/jsonString"/>
                        <ww:param name="'submitButtonId'">saveasfilter_submit</ww:param>
                    </ww:component>
                </ww:if>
            </page:applyDecorator>
        </div>
    </div>
</body>
</html>

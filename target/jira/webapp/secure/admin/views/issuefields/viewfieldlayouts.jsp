<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<html>
<head>
	<title><ww:text name="'admin.issuefields.fieldconfigurations.view.field.configurations'"/></title>
    <meta name="admin.active.section" content="admin_issues_menu/element_options_section/fields_section"/>
    <meta name="admin.active.tab" content="field_configuration"/>
</head>
<body>
    <page:applyDecorator name="jirapanel">
        <page:param name="title"><ww:text name="'admin.issuefields.fieldconfigurations.view.field.configurations'"/></page:param>
        <page:param name="width">100%</page:param>
        <page:param name="helpURL">issuefields</page:param>
        <p><ww:text name="'admin.issuefields.fieldconfigurations.the.table.below'"/> <ww:text name="'admin.issuefields.fieldconfigurations.description'"/></p>
        <p><ww:text name="'admin.issuefields.fieldconfigurations.activation'"><ww:param name="'value0'"><a href="ViewFieldLayoutSchemes.jspa"></ww:param><ww:param name="'value1'"></a></ww:param></ww:text></p>
    </page:applyDecorator>
    <ww:if test="fieldLayoutScheme/size == 0">
        <aui:component template="auimessage.jsp" theme="'aui'">
            <aui:param name="'messageType'">info</aui:param>
            <aui:param name="'messageHtml'"><ww:text name="'admin.issuefields.fieldconfigurations.no.schemes.configured'"/></aui:param>
        </aui:component>
    </ww:if>
    <ww:else>
    <table class="aui aui-table-rowhover">
        <thead>
            <tr>
                <th>
                    <ww:text name="'common.words.name'"/>
                </th>
                <th>
                    <ww:text name="'admin.issuefields.fieldconfigurations.field.configuration.schemes'"/>
                </th>
                <th>
                    <ww:text name="'common.words.operations'"/>
                </th>
            </tr>
        </thead>
        <tbody>
        <ww:iterator value="/fieldLayouts" status="'status'">
        <tr>
            <td>
                <span class="field-name">
                    <ww:if test="./type">
                        <a href="<ww:url page="/secure/admin/ViewIssueFields.jspa" />" title="<ww:text name="'admin.issuefields.fieldconfigurations.edit.field.properties'"/>"><ww:property value="./name"/></a>
                    </ww:if>
                    <ww:else>
                        <a href="<ww:url page="/secure/admin/ConfigureFieldLayout!default.jspa"><ww:param name="'id'" value="./id"/></ww:url>" title="<ww:text name="'admin.issuefields.fieldconfigurations.edit.field.properties'"/>"><ww:property value="./name"/></a>
                    </ww:else>
                </span>
                <p class="field-description fieldDescription">
                    <ww:property value="./description"/>
                </p>
            </td>
            <td>
                <ww:if test="/fieldLayoutSchemes(.)/empty == false">
                    <ul>
                        <ww:iterator value="/fieldLayoutSchemes(.)">
                            <li><a href="<ww:url page="/secure/admin/ConfigureFieldLayoutScheme.jspa"><ww:param name="'id'" value="./id" /></ww:url>"><ww:property value="./name" /></a></li>
                        </ww:iterator>
                    </ul>
                </ww:if>
            </td>
            <td>
                <ul class="operations-list">
                <ww:if test="./type">
                    <li><a id="configure-<ww:property value="./name"/>" href="<ww:url page="/secure/admin/ViewIssueFields.jspa" />" title="<ww:text name="'admin.issuefields.fieldconfigurations.edit.field.properties'"/>"><ww:text name="'admin.common.words.configure'"/></a></li>
                </ww:if>
                <ww:else>
                    <li><a id="configure-<ww:property value="./name"/>" href="<ww:url page="/secure/admin/ConfigureFieldLayout!default.jspa"><ww:param name="'id'" value="./id"/></ww:url>" title="<ww:text name="'admin.issuefields.fieldconfigurations.edit.field.properties'"/>"><ww:text name="'admin.common.words.configure'"/></a></li>
                </ww:else>
                    <li><a id="copy-<ww:property value="./name"/>" href="<ww:url page="/secure/admin/CopyFieldLayout!default.jspa"><ww:param name="'id'" value="./id"/></ww:url>" title="<ww:text name="'admin.issuefields.fieldconfigurations.create.copy.of'"><ww:param name="'value0'"><ww:property value="./name" /></ww:param></ww:text>"><ww:text name="'common.words.copy'"/></a></li>
                <ww:if test="./type == null">
                    <li><a id="edit-<ww:property value="./name"/>" href="<ww:url page="/secure/admin/EditFieldLayout!default.jspa"><ww:param name="'id'" value="./id"/></ww:url>" title="<ww:text name="'admin.issuefields.fieldconfigurations.edit'"><ww:param name="'value0'"><ww:property value="./name" /></ww:param></ww:text>"><ww:text name="'common.words.edit'"/></a></li>
                </ww:if>
                <!-- Field Configuration can only be deleted if it is not associated with a scheme -->
                <ww:if test="./type == null && /fieldLayoutSchemes(.)/empty == true">
                    <li><a id="delete-<ww:property value="./name"/>" href="<ww:url page="/secure/admin/DeleteFieldLayout!default.jspa"><ww:param name="'id'" value="./id"/></ww:url>" title="<ww:text name="'admin.issuefields.fieldconfigurations.delete'"><ww:param name="'value0'"><ww:property value="./name" /></ww:param></ww:text>"><ww:text name="'common.words.delete'"/></a></li>
                </ww:if>
                </ul>
            </td>
        </tr>
        </ww:iterator>
        </tbody>
    </table>
    </ww:else>
    <aui:component template="module.jsp" theme="'aui'">
        <aui:param name="'contentHtml'">
            <page:applyDecorator name="jiraform">
                <page:param name="action">AddFieldLayout.jspa</page:param>
                <page:param name="submitId">add_submit</page:param>
                <page:param name="submitName"><ww:text name="'common.forms.add'"/></page:param>
                <page:param name="title"><ww:text name="'admin.issuefields.fieldconfigurations.add.field.configuration'"/></page:param>
                <page:param name="width">100%</page:param>
                <page:param name="description">
                    <ww:text name="'admin.issuefields.fieldconfigurations.add.field.instructions'">
                        <ww:param name="'value0'"><b></ww:param>
                        <ww:param name="'value1'"></b></ww:param>
                    </ww:text>
                </page:param>
                <ui:textfield label="text('common.words.name')" name="'fieldLayoutName'" size="'30'">
                    <ui:param name="'mandatory'">true</ui:param>
                </ui:textfield>
                <ui:textfield label="text('common.words.description')" name="'fieldLayoutDescription'" size="'60'" />
            </page:applyDecorator>
        </aui:param>
    </aui:component>
</body>
</html>

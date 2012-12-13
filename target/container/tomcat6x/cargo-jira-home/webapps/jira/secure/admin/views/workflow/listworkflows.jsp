<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<html>
<head>
    <meta name="admin.active.section" content="admin_issues_menu/element_options_section/workflows_section"/>
    <meta name="admin.active.tab" content="workflows"/>
	<title><ww:text name="'admin.workflows.view.workflows'"/></title>
</head>
<body>
    <header>
        <nav class="aui-toolbar">
            <div class="toolbar-split toolbar-split-right">
                <ul class="toolbar-group">
                    <li class="toolbar-item">
                        <a id="add-workflow" class="toolbar-trigger trigger-dialog" href="AddNewWorkflow.jspa">
                            <ww:text name="'admin.workflows.add.new.workflow'"/>
                        </a>
                    </li>
                    <ww:if test="/systemAdministrator == true">
                        <li class="toolbar-item">
                            <a id="import-workflow" class="toolbar-trigger trigger-dialog" href="ImportWorkflowFromXml!default.jspa">
                                <ww:text name="'admin.workflows.import.from.xml'"/>
                            </a>
                        </li>
                    </ww:if>
                    <li class="toolbar-item">
                        <aui:component name="'workflow'" template="toolbarHelp.jsp" theme="'aui'">
                            <aui:param name="'cssClass'">toolbar-trigger</aui:param>
                        </aui:component>
                    </li>
                </ul>
            </div>
        </nav>
        <h2><ww:text name="'admin.workflows.view.workflows'"/></h2>
    </header>
    <aui:component template="module.jsp" theme="'aui'">
        <aui:param name="'id'">ViewWorkflows</aui:param>
        <aui:param name="'contentHtml'">
            <ww:property value="/flushedErrorMessages">
                <ww:if test=". && ./empty == false">
                    <aui:component template="auimessage.jsp" theme="'aui'">
                        <aui:param name="'messageType'">error</aui:param>
                        <aui:param name="'messageHtml'">
                            <ww:iterator value=".">
                                <p><ww:property value="."/></p>
                            </ww:iterator>
                        </aui:param>
                    </aui:component>
                </ww:if>
            </ww:property>
            <aui:component template="auimessage.jsp" theme="'aui'">
                <aui:param name="'messageType'">info</aui:param>
                <aui:param name="'messageHtml'">
                    <ww:text name="'admin.workflows.delete.workflow.instruction'"/>
                </aui:param>
            </aui:component>
            <table id="workflows_table" class="aui aui-table-rowhover">
                <thead>
                    <tr>
                        <th>
                            <ww:text name="'common.words.status'"/>
                        </th>
                        <th>
                            <ww:text name="'common.words.name'"/>
                        </th>
                        <th>
                            <ww:text name="'admin.workflows.last.modified'"/>
                        </th>
                        <th>
                            <ww:text name="'admin.menu.schemes.assigned.schemes'"/>
                        </th>
                        <th>
                            <ww:text name="'admin.workflows.steps'"/>
                        </th>
                        <th>
                            <ww:text name="'common.words.operations'"/>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <ww:iterator value="workflows" status="'status'">
                        <ww:if test="./draftWorkflow == true && /parentWorkflowActive(.) == false">
                        <tr style="background-color:#ffe7e7">
                        </ww:if>
                        <ww:else>
                        <tr>
                        </ww:else>
                            <td>
                                <ww:if test="./draftWorkflow == true">
                                    <span class="status-lozenge status-draft" title="<ww:text name="'admin.workflows.editing.description2'"/>"><ww:text name="'common.words.draft'"/></span>
                                </ww:if>
                                <ww:else>
                                    <ww:if test="./active == true">
                                        <span class="status-lozenge status-active" title="<ww:text name="'admin.workflows.active.description2'"/>"><ww:text name="'admin.common.words.active'"/></span>
                                    </ww:if>
                                    <ww:else>
                                        <span class="status-lozenge status-inactive" title="<ww:text name="'admin.workflows.inactive.description2'"/>"><ww:text name="'admin.common.words.inactive'"/></span>
                                    </ww:else>
                                </ww:else>
                            </td>
                            <td>
                                <ww:if test="./draftWorkflow == true">
                                     <img src="<%= request.getContextPath()%>/images/icons/link_out_bot.gif" alt="<ww:text name="'common.words.draft'"/>" />
                                </ww:if>
                                <strong><ww:property value="name"/></strong>
                                <ww:if test="./systemWorkflow == true">
                                    <ww:text name="'admin.workflows.readonly.system.workflow'"/>
                                </ww:if>
                                <ww:if test="default == true">
                                    <span class="status-lozenge status-default" title="<ww:text name="'admin.workflows.default.workflow.description'"/>"><ww:text name="'common.words.default'"/></span>
                                </ww:if>
                                <div class="secondary-text">
                                    <ww:property value="description"/>
                                </div>
                            </td>
                            <td>
                                <ww:if test="./updateAuthorName != null && ./updatedDate != null">
                                    <div class="secondary-text">
                                        <strong><ww:property value="/outlookDate/formatDMY(./updatedDate)"/></strong>
                                        <br/>
                                        <ww:if test="./updateAuthorName == ''">
                                            <ww:text name="'admin.workflows.last.modified.anonymous'"/>
                                        </ww:if>
                                        <ww:else>
                                            <ww:property value="/userFullName(./updateAuthorName)"/>
                                        </ww:else>
                                    </div>
                                </ww:if>
                            </td>
                            <td>
                                <ww:property value="/schemesForWorkflow(.)" id="workflowSchemes"/>
                                <ww:if test="@workflowSchemes && @workflowSchemes/empty == false">
                                    <ul>
                                    <ww:iterator value="@workflowSchemes">
                                        <li><a href="<%= request.getContextPath() %>/secure/admin/EditWorkflowSchemeEntities!default.jspa?schemeId=<ww:property value="long('id')" />"><ww:property value="string('name')" /></a></li>
                                    </ww:iterator>
                                    </ul>
                                </ww:if>
                            </td>
                            <td style="text-align:center;">
                                <a id="steps_<ww:property value="mode"/>_<ww:property value="name"/>" href="<ww:url page="ViewWorkflowSteps.jspa"><ww:param name="'workflowMode'" value="mode" /><ww:param name="'workflowName'" value="name" /></ww:url>" title="<ww:property value="descriptor/steps/size" /> <ww:text name="'admin.workflows.steps'"/>"><ww:property value="descriptor/steps/size" /></a>
                            </td>
                            <td>
                                <ul class="operations-list">
                                    <li><a id="designer_<ww:property value="name"/>" href="<ww:url page="WorkflowDesigner.jspa" atltoken="false"><ww:param name="'wfName'" value="name" /><ww:param name="'workflowMode'" value="mode" /></ww:url>"><ww:text name="'workflow.designer.link'"/></a></li>
                                    <li><a class="trigger-dialog" id="copy_<ww:property value="name"/>" href="<ww:url page="CloneWorkflow!default.jspa"><ww:param name="'workflowMode'" value="mode" /><ww:param name="'workflowName'" value="name" /></ww:url>"><ww:text name="'common.words.copy'"/></a></li>
                                    <li><a id="xml_<ww:property value="name"/>" href="<ww:url page="ViewWorkflowXml.jspa"><ww:param name="'workflowMode'" value="mode" /><ww:param name="'workflowName'" value="name" /></ww:url>"><ww:text name="'admin.common.words.xml'"/></a></li>
                                <ww:if test="./editable == true">
                                    <li><a class="trigger-dialog" id="edit_<ww:property value="mode"/>_<ww:property value="name"/>" href="<ww:url page="EditWorkflow!default.jspa"><ww:param name="'workflowMode'" value="mode" /><ww:param name="'workflowName'" value="name" /></ww:url>"><ww:text name="'common.words.edit'"/></a></li>
                                    <ww:if test="@workflowSchemes/empty == true || draftWorkflow == true">
                                        <li><a class="trigger-dialog" id="del_<ww:property value="name"/>" href="<ww:url page="DeleteWorkflow.jspa"><ww:param name="'workflowMode'" value="mode" /><ww:param name="'workflowName'" value="name" /></ww:url>"><ww:text name="'common.words.delete'"/></a></li>
                                    </ww:if>
                                </ww:if>
                                <ww:if test="./draftWorkflow == true && /parentWorkflowActive(.) == true">
                                    <li><a class="trigger-dialog" id="publishDraft_<ww:property value="name"/>" href="<ww:url page="PublishDraftWorkflow!default.jspa"><ww:param name="'workflowName'" value="name" /><ww:param name="'workflowMode'" value="mode" /></ww:url>"><ww:text name="'common.words.publish'"/></a></li>
                                </ww:if>
                                <ww:if test="./active == true && ./systemWorkflow == false && ./hasDraftWorkflow == false">
                                    <li><a id="createDraft_<ww:property value="name"/>" href="<ww:url page="CreateDraftWorkflow.jspa"><ww:param name="'draftWorkflowName'" value="name" /></ww:url>"><ww:text name="'admin.workflows.create.draft'"/></a></li>
                                </ww:if>
                                </ul>
                            </td>
                        </tr>
                    </ww:iterator>
                </tbody>
            </table>
        </aui:param>
    </aui:component>
</body>
</html>

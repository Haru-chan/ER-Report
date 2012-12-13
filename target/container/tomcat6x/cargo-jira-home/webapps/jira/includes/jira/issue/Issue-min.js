AJS.namespace("JIRA.Issue");(function(){var $keyVal;function getKeyVal(){if(!$keyVal){$keyVal=jQuery("#key-val")}return $keyVal}JIRA.Issue.getSubtaskContent=function(){return JIRA.Issue.getSubtaskModule().find(".mod-content")};JIRA.Issue.getSubtaskModule=function(){return jQuery("#view-subtasks")};JIRA.Issue.reload=function(){window.location.reload()};JIRA.Issue.refreshSubtasks=function(){var deferred=jQuery.Deferred(),$subtasks=JIRA.Issue.getSubtaskContent();if($subtasks.length===0){AJS.reloadViaWindowLocation(window.location.href+"#view-subtasks");return deferred.promise()}else{return jQuery.ajax({url:contextPath+"/secure/ViewSubtasks.jspa?id="+JIRA.Issue.getIssueId(),success:function(html){$subtasks.replaceWith(html);JIRA.trigger("Issue.subtasksRefreshed",[JIRA.Issue.getSubtaskContent()])}})}};JIRA.Issue.highlightSubtasks=function(issues){jQuery.each(issues,function(i,issue){jQuery(".issuerow[data-issuekey='"+issue.issueKey+"']").fadeInBackground()})};JIRA.Issue.getIssueId=function(){var $keyVal=getKeyVal();if($keyVal.length!==0){return $keyVal.attr("rel")}return undefined};JIRA.Issue.getIssueKey=function(){var $keyVal=getKeyVal();if($keyVal.length!==0){return $keyVal.text()}return undefined};JIRA.Issue.issueCreatedMessage=function(issue,isSubtask){var issueText=isSubtask?AJS.I18n.getText("common.words.subtask"):AJS.I18n.getText("common.words.issue");var link='<a class="issue-created-key" href="'+AJS.contextPath()+"/browse/"+issue.issueKey+'">'+issue.issueKey+" - "+AJS.escapeHTML(issue.summary)+"</a>";return AJS.I18n.getText("createissue.issuecreated",issueText,link)}})(AJS.$);AJS.namespace("jira.app.issue",null,JIRA.Issue);
JIRA.ViewIssueTabs=(function(){var AJAX_LOAD_CLASS="ajax-activity-content";var AJAX_LINK_SELECTOR=AJS.format("a.{0}",AJAX_LOAD_CLASS);var issueTabLoadedListeners=[];var $tabContents,$tabProgress;var xhrInProgress;function dispatchIssueTabLoadedEvent(container){AJS.$.each(issueTabLoadedListeners,function(i,fn){fn(container)})}function bindToTabDivs(container){$tabContents=AJS.$(container).find("#issue_actions_container");$tabProgress=AJS.$(container).find("div.issuePanelProgress")}function dispatchIssueTabErrorEvent(smartAjaxResult,activeTabKey){var errorPopup=new JIRA.FormDialog({id:"issue-tab-error-dialog",widthClass:"small",content:JIRA.SmartAjax.buildDialogErrorContent(smartAjaxResult,false)});setActiveTab(activeTabKey);$tabContents.show();errorPopup.show()}function setActiveTab(activeTabKey){AJS.$("#issue-tabs li").each(function(){var $li=AJS.$(this);var tabKey=$li.data("key");var labelHtml=AJS.format("<strong>{0}</strong>",$li.data("label"));if(tabKey==activeTabKey){$li.addClass("active");$li.html(labelHtml)}else{$li.removeClass("active");var id=$li.data("id");var href=$li.data("href");$li.html(AJS.format('<a id="{0}" href="{1}" class="{2}">{3}</a>',id,href,AJAX_LOAD_CLASS,labelHtml))}});enablePjaxOnLinks(AJS.$("#issue-tabs"))}function putTabInLoadingState(activeTabKey){$tabContents.hide();setActiveTab(activeTabKey)}function enablePjaxOnLinks(context){var activeTabKey=AJS.$(context).find("li.active").data("key");AJS.$(context).find(AJAX_LINK_SELECTOR).click(function(event){event.preventDefault();if(xhrInProgress){xhrInProgress.abort()}var $a=AJS.$(this);var containerID="#activitymodule div.mod-content";var loadingTabKey=$a.parent().data("key");putTabInLoadingState(loadingTabKey);var xhr=JIRA.SmartAjax.makeRequest({jqueryAjaxFn:AJS.$.pjax,container:containerID,url:$a.attr("href"),timeout:null,complete:function(xhr,status,smartAjaxResult){if(status!="abort"){xhrInProgress=null;if(!smartAjaxResult.successful){if(smartAjaxResult.status<300||smartAjaxResult.status>=400){dispatchIssueTabErrorEvent(smartAjaxResult,activeTabKey)}return }dispatchIssueTabLoadedEvent(AJS.$(containerID))}}});jQuery(xhr).throbber({target:$tabProgress});xhrInProgress=xhr})}function appendHashCodeToLinks(context){AJS.$(context).find(AJAX_LINK_SELECTOR).each(function(){var $a=AJS.$(this);$a.attr("href",$a.attr("href")+"#issue-tabs")})}function processActivityModuleLinks(context){if(AJS.$.support.pjax){enablePjaxOnLinks(context)}else{appendHashCodeToLinks(context)}}return{onTabReady:function(listener){issueTabLoadedListeners.push(listener)},domReady:function(){this.onTabReady(bindToTabDivs);this.onTabReady(processActivityModuleLinks);dispatchIssueTabLoadedEvent(document)}}})();
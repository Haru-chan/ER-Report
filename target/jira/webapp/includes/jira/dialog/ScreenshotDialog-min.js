JIRA.ScreenshotDialog=function(options){var self=this;this.$trigger=jQuery(options.trigger);this.$trigger.click(function(e){e.preventDefault();self.openWindow()})};JIRA.ScreenshotDialog.prototype.openWindow=function(){if(JIRA.Dialog.current){JIRA.Dialog.current.hide()}if(AJS.InlineLayer.current){AJS.InlineLayer.current.hide()}window.open(this.$trigger.attr("href")+"&decorator=popup","screenshot","width=800,height=700,scrollbars=yes,status=yes")};AJS.namespace("jira.app.attachments.screenshot.ScreenshotWindow",null,JIRA.ScreenshotDialog);
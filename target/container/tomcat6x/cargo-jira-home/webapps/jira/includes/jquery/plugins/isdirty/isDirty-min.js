(function($){var DIRTY_WARNING_EXEMPT="ajs-dirty-warning-exempt";var activeForm=null;var defaultDirtyMessage=AJS.I18n.getText("common.forms.dirty.message");var dirtyMessage=defaultDirtyMessage;$.fn.isDirty=function(){var $fields=this.find("*").andSelf().filter(":input");for(var i=0;i<$fields.length;i++){if(isElementDirty($fields[i])){return true}}return false};$.fn.removeDirtyWarning=function(){$(this.form||this).closest("form").addClass(DIRTY_WARNING_EXEMPT);return this};$(AJS).bind("page-unload.location-change.from-dialog",function(){window.onbeforeunload=function(){}});$(AJS).bind("page-unload.refresh.from-dialog",function(){dirtyMessage=AJS.I18n.getText("common.forms.dirty.message.from.dialog")});function getDirtyMessage(){var msg=dirtyMessage;dirtyMessage=defaultDirtyMessage;return"***\n\n"+msg+"\n\n***"}JIRA.DirtyForm={getDirtyWarning:function(){var $inputs=$("input[type='text'], textarea[name]");for(var i=0,ii=$inputs.length;i<ii;i++){if($inputs[i].form!==activeForm&&isElementDirty($inputs[i])){return getDirtyMessage()}}}};if(!AJS.isSelenium()){window.onbeforeunload=JIRA.DirtyForm.getDirtyWarning}function isElementDirty(element){var $element=$(element),$form=$(element.form),type=element.type;if($form.hasClass(DIRTY_WARNING_EXEMPT)||$element.hasClass(DIRTY_WARNING_EXEMPT)){return false}if($element.is(":hidden")){return false}if(!$element.parent().length){return false}if(type==="hidden"||type==="submit"||type==="button"){return false}if(type==="select-one"||type==="select-multiple"){var options=element.options;for(var i=0;i<options.length;i++){var option=options[i];if(option.selected!==option.defaultSelected){return true}}return false}if(type==="checkbox"||type==="radio"){return element.checked!==element.defaultChecked}return element.value!==element.defaultValue}$(document).delegate("form","submit cancel",function(){activeForm=this});$(document).delegate(".cancel","click",cancelForm);$(function(){$("#cancelButton").bind("mousedown keydown click",cancelForm)});function cancelForm(){$(this.form||this).closest("form").trigger("cancel")}})(AJS.$);
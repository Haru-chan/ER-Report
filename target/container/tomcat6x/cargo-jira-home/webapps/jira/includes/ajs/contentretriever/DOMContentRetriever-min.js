AJS.DOMContentRetriever=AJS.ContentRetriever.extend({init:function(content){this.$content=AJS.$(content)},content:function(callback){if(AJS.$.isFunction(callback)){callback(this.$content)}return this.$content},cache:function(){},isLocked:function(){},startingRequest:function(){},finishedRequest:function(){}});
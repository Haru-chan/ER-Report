AJS.asBooleanOrString=function(value){var lc=value?value.toLowerCase():"";if(lc=="true"){return true}if(lc=="false"){return false}return value};AJS.overrides={};AJS.Meta=jQuery.extend({},AJS.Meta,{set:function(key,value){AJS.overrides[key]=value},get:function(key){if(typeof AJS.overrides[key]!="undefined"){return AJS.overrides[key]}var metaEl=jQuery("meta[name='ajs-"+key+"']");if(!metaEl.length){return undefined}var value=metaEl.attr("content");return AJS.asBooleanOrString(value)},getBoolean:function(key){return this.get(key)===true},getNumber:function(key){return +this.get(key)},getAllAsMap:function(){var map={};jQuery("meta[name^=ajs-]").each(function(){map[this.name.substring(4)]=this.content});return jQuery.extend(map,AJS.overrides)}});
AJS.Descriptor=Class.extend({init:function(properties){if(this._validate(properties)){this.properties=AJS.$.extend(this._getDefaultOptions(),properties)}},allProperties:function(){return this.properties},_validate:function(properties){if(this.REQUIRED_PROPERTIES){AJS.$.each(this.REQUIRED_PROPERTIES,function(name){if(typeof properties[name]==="undefined"){throw new Error("AJS.Descriptor: expected property ["+name+"] but was undefined")}})}return true}});
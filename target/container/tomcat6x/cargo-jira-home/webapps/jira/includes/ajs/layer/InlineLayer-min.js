AJS.InlineLayer=AJS.Control.extend({CLASS_SIGNATURE:"AJS_InlineLayer",SCROLL_HIDE_EVENT:"scroll.hide-dropdown",init:function(options){var instance=this;if(!(options instanceof AJS.InlineLayer.OptionsDescriptor)){this.options=new AJS.InlineLayer.OptionsDescriptor(options)}else{this.options=options}this.offsetTarget(this.options.offsetTarget());this.contentRetriever=this.options.contentRetriever();this.positionController=this.options.positioningController();if(!(this.contentRetriever instanceof AJS.ContentRetriever)){throw new Error("AJS.InlineLayer: Failed construction, Content retriever does not implement interface "+"[AJS.ContentRetrieverInterface]")}this.contentRetriever.startingRequest(function(){instance._showLoading()});this.contentRetriever.finishedRequest(function(){instance._hideLoading()});this.$layer=this._render("layer",this.options.alignment())},content:function(arg){var instance=this;if(AJS.$.isFunction(arg)){this.contentRetriever.content(function(content){instance.$content=content.removeClass("hidden");arg.call(instance)})}else{return this.$content}},offsetTarget:function(offsetTarget){if(offsetTarget){this.$offsetTarget=AJS.$(offsetTarget)}return this.$offsetTarget},contentChange:function(callback){var instance=this;if(AJS.$.isFunction(callback)){if(!this.contentChangeCallback){this.contentChangeCallback=[]}this.contentChangeCallback.push(callback)}else{if(!callback){this.trigger("contentChanged",[this]);this.setWidth(this.options.width());if(this.contentChangeCallback){AJS.$.each(this.contentChangeCallback,function(i,callback){callback(instance)})}}}},onhide:function(callback){var instance=this;if(AJS.$.isFunction(callback)){if(!this.hideCallback){this.hideCallback=[]}this.hideCallback.push(callback)}else{if(!callback&&this.hideCallback){AJS.$.each(this.hideCallback,function(i,callback){callback(instance)})}}},layer:function(layer){if(layer){this.$layer=layer}else{return this.$layer}},placeholder:function(placeholder){if(placeholder){this._throwReadOnlyError("placeholder")}else{return this.$placeholder}},isVisible:function(visible){if(typeof visible!=="undefined"){this._throwReadOnlyError("visible")}return this.visible},scrollableContainer:function(scrollableContainer){if(scrollableContainer){this._throwReadOnlyError("scrollableContainer")}return this.$scrollableContainer},isInitialized:function(initialised){if(initialised){this._throwReadOnlyError("initialized")}return this.initialized},hide:function(){if(!this.isVisible()){return false}this.visible=false;this.layer().removeClass(AJS.ACTIVE_CLASS).hide();this.$offsetTarget.removeClass(AJS.ACTIVE_CLASS);var positionController=this.positionController;setTimeout(function(){positionController.appendToPlaceholder()},0);this._unbindEvents();this.onhide();this.trigger("hideLayer",[this]);AJS.$(document).trigger("hideLayer",[this.CLASS_SIGNATURE,this]);AJS.InlineLayer.current=null},refreshContent:function(callback){var instance=this;this.content(function(){this.layer().empty().append(this.content());if(AJS.$.isFunction(callback)){callback.call(instance)}this.contentChange()})},show:function(){var instance=this;if(this.isVisible()){return }if(!this.isInitialized()){this._lazyInit(function(){instance._show()})}else{if(this.contentRetriever.cache()===false){this.refreshContent(function(){instance._show()})}else{instance._show()}}},setPosition:function(){var positioning;if(!this.isInitialized()||!this.offsetTarget()||this.offsetTarget().length===0){return }if(this.options.alignment()===AJS.RIGHT){positioning=this.positionController.right()}else{if(this.options.alignment()===AJS.LEFT){positioning=this.positionController.left()}else{if(this.options.alignment()===AJS.INTELLIGENT_GUESS){if((this.offsetTarget().offset().left+this.layer().outerWidth()/2)>AJS.$(window).width()/2){positioning=this.positionController.right()}else{positioning=this.positionController.left()}}}}this.trigger("setLayerPosition",positioning);if(AJS.dim.dim){var scrollLeft=AJS.$(window).scrollLeft();if(scrollLeft>0){positioning.left-=scrollLeft}positioning.maxHeight=AJS.$(window).height()-positioning.top-this.options.cushion()}this.layer().css(positioning)},setOverflowAndHeight:function(){if(this.options.properties.maxInlineResultsDisplayed){this.layer().addClass("limited")}},setWidth:function(width,showhorizontalScroll){var contentScrollWidth=this.content().attr("scrollWidth");if(!(this.content().hasClass("error")||this.content().hasClass("warn"))){this.content().css({whiteSpace:"nowrap",overflowX:"",width:"auto"})}if(contentScrollWidth<=width){this.layer().css({width:width,whiteSpace:""})}else{if(showhorizontalScroll||this.options.allowDownsize()){this.layer().css({width:width,overflowX:"auto",whiteSpace:""})}else{this.layer().css({width:contentScrollWidth,overflowX:"hidden",whiteSpace:""})}}},_lazyInit:function(callback){if(this.initializing){return }this.initializing=true;this.refreshContent(function(){var instance=this;this.initializing=false;this.initialized=true;this.layer().insertAfter(this.offsetTarget());if(this._supportsBoxShadow()){this.layer().addClass(AJS.BOX_SHADOW_CLASS)}this.$placeholder=AJS.$("<div class='ajs-layer-placeholder' />").insertAfter(this.offsetTarget());this.$scrollableContainer=this.offsetTarget().closest(this.options.hideOnScroll());this.positionController.set(this.layer(),this.offsetTarget(),this.placeholder());this.positionController.rebuilt(function(layer){instance.layer(layer)});callback()})},_show:function(){if(AJS.InlineLayer.current){AJS.InlineLayer.current.hide()}this.visible=true;this.content().show();this.positionController.appendToBody();this.layer().addClass(AJS.ACTIVE_CLASS);this.$offsetTarget.addClass(AJS.ACTIVE_CLASS);this.layer().show();this.setWidth(this.options.width());this.setPosition();this.setOverflowAndHeight();this._bindEvents();if(!AJS.dim.dim){this.positionController.scrollTo()}AJS.InlineLayer.current=this;this.trigger("showLayer",[this]);AJS.$(document).trigger("showLayer",[this.CLASS_SIGNATURE,this])},_hideLoading:function(){this.$layer.removeClass(AJS.LOADING_CLASS);this.$offsetTarget.removeClass(AJS.LOADING_CLASS)},_showLoading:function(){this.$layer.addClass(AJS.LOADING_CLASS);this.$offsetTarget.addClass(AJS.LOADING_CLASS)},_unbindEvents:function(){this.$scrollableContainer.unbind(this.SCROLL_HIDE_EVENT);this._unassignEvents("container",document);this._unassignEvents("win",window)},_bindEvents:function(){var instance=this;this.$scrollableContainer.one(this.SCROLL_HIDE_EVENT,function(){instance.hide()});this._assignEvents("container",document);this._assignEvents("win",window)},_validateClickToClose:function(e){if(e.target===this.offsetTarget()[0]){return false}else{if(e.target===this.layer()[0]){return false}else{if(this.offsetTarget().has(e.target).length>0){return false}else{if(this.layer().has(e.target).length>0){return false}}}}return true},"keys":{Esc:function(){this.hide()}},_events:{container:{"aui:keydown aui:keypress":function(event){this._handleKeyEvent(event)},click:function(e){if(this._validateClickToClose(e)){this.hide()}}},win:{resize:function(){this.setPosition()},scroll:function(){this.setPosition()}}},_renders:{layer:function(){return AJS.$("<div />").addClass("ajs-layer "+(this.options.styleClass()||""))}}});
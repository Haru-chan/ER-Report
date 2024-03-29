/**
 * A content retrieval class, that provides a common interface to build and access a jQuery wrapped content element via
 * ajax.
 *
 * @constructor AJS.AjaxContentRetriever
 */
AJS.AjaxContentRetriever = AJS.ContentRetriever.extend({

    /**
     * @param {Object | String} options - if string treats it as the url to request. Otherwise object will be the same as
     * jQuery ajax options (you can see there documentation) apart from a few exceptions:
     * ... {Function} formatSuccess - This will be passed the response data after the ajax request and should return
     * ... {Function} formatError - This will be passed the response data after the ajax request an error
     * a jQuery wrapped element that was build from the data.
     * ... {Boolean} cache - If this flag is set to true, only one request will ever take place
     */
    init: function (options) {

        var instance = this;

        this.ajaxOptions = options;

        if (!this.ajaxOptions.requestDelay && this.ajaxOptions.requestDelay !== 0) {
            this.ajaxOptions.requestDelay = 75;
        }
    },

    getAjaxOptions: function () {

        var ajaxOptions,
            instance = this;

        if (typeof this.ajaxOptions === "string") {
            ajaxOptions = {
                url: this.ajaxOptions
            };
        } else if (jQuery.isFunction(this.ajaxOptions)) {
            ajaxOptions = this.ajaxOptions();
        } else {
            ajaxOptions = this.ajaxOptions;
        }

        ajaxOptions.globalThrobber = false;

        ajaxOptions.success = function (data, textStatus, xhr) {
            instance._requestComplete(xhr, textStatus, data, true, null);
        };

        ajaxOptions.error = function (xhr, textStatus) {
            if (xhr.rc) {
                // TODO Consider cleaning this up when we upgrade to AG trunk.
                // Gadgets return their own object with only rc (the status code) guaranteed to exist.
                xhr.status = xhr.rc;
            }
            instance._requestComplete(xhr, textStatus, null, false, null);
        };

        return ajaxOptions;
    },

    /**
     * Retreives/Gets/Sets content.
     * 
     * @method content
     * @param {Function | jQuery} arg
     */
    content: function (arg) {

        if (AJS.$.isFunction(arg)) {

            this.callback = arg;
            this._makeRequest(arg);

        } else if (arg) {

            if (this.callback) {
                this.callback(arg);
                delete this.callback;
            }
        }

        return this.$content;
    },

    /**
     * Starting request, used to set a call starting callbacks
     *
     * @method startingRequest
     * @param {Function} callback
     */
    startingRequest: function (callback) {
        if (callback) {
            this.startingCallback = callback;
        } else if (this.startingCallback) {
            this.locked = true;
            this.startingCallback();
        }
    },


    /**
     * Finished request, call callbac
     *
     * @method finishedRequest
     * @param {Function} callback
     */
    finishedRequest: function (callback) {
        if (callback) {
            this.finishedCallback = callback;
        } else if (this.finishedCallback) {
            this.locked = false;
            this.finishedCallback();
        }
    },

    /**
     * Get/Set caching settings
     *
     * @method cache
     * @return {Boolean}
     */
    cache: function (cache) {
        if (typeof cache !== "undefined") {
            this.getAjaxOptions().cache = cache;
        }
        return this.getAjaxOptions().cache;
    },

    /**
     * Is a request still outstanding. Can another request take place.
     *
     * @method isLocked
     * @return {Boolean}                                                                                   x
     */
    isLocked: function () {
        return this.locked;
    },

    /**
     * Called when request has complete
     *
     * @method _requestComplete
     * @protected
     */
    _requestComplete: function (xhr, statusText, data, successful, errorThrown) {

        if (statusText === "abort") {
            this.locked = false;
            return;
        }

        var $content,
            smartAjaxResult,
            ajaxOptions = this.getAjaxOptions();

        if (JIRA.SmartAjax.SmartAjaxResult) {
            smartAjaxResult = JIRA.SmartAjax.SmartAjaxResult.apply(window, arguments);
        }


        if (successful) {

            if (AJS.$.isFunction(ajaxOptions.formatSuccess)) {
                $content = ajaxOptions.formatSuccess(data);
            } else {
                $content = AJS.$("<div>" + data + "</div>");
            }

        } else {

            if (AJS.$.isFunction(ajaxOptions.formatError)) {
                $content = ajaxOptions.formatError(data);
            } else if (smartAjaxResult) {
                var errorClass = smartAjaxResult.status === 401?'warning':'error';
                $content = AJS.$('<div class="aui-message '+errorClass+'"><span class="aui-icon icon-'+errorClass+'"></span>' + JIRA.SmartAjax.buildSimpleErrorContent(smartAjaxResult) + '</div>');
            }
        }

        this.content($content);

        this.finishedRequest();
    },

    /**
     * Issues request
     *
     * @method _makeRequest
     * @protected
     */
    _makeRequest: function () {

        var instance = this,
            ajaxOptions = this.getAjaxOptions();

        if (this.outstandingRequest) {
            this.outstandingRequest.abort();
            this.outstandingRequest = null;
        }

        clearTimeout(this._queuedRequest);

        if (this.isLocked()) {
            this._queuedRequest = setTimeout(function() {
                instance._makeRequest();
            }, this.ajaxOptions.requestDelay);
        } else {
            doRequest();
        }

        function doRequest() {
            instance.startingRequest();
            instance.outstandingRequest = AJS.$.ajax(instance.getAjaxOptions());
        }
    }

});

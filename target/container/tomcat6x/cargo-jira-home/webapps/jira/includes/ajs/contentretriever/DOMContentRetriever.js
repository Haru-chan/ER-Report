/**
 * A simple content retrival class, that provides a common interface to access to a provided HTML element 
 *
 * @constructor AJS.DOMContentRetriever
 */
AJS.DOMContentRetriever = AJS.ContentRetriever.extend({

    /**
     * @param {HTMLElement | jQuery | String} content - HTML element to access
     */
    init: function (content) {
        this.$content = AJS.$(content);
    },

    /**
     * Gets content via invocation or callback
     *
     * @method content 
     * @param {Function} callback - if provided executes callback with content being the first argument
     */
    content: function (callback) {
        if (AJS.$.isFunction(callback)) {
            callback(this.$content);
        }

        return this.$content;
    },

    // these methods below are only used by asynchronous content retrievers, however we still need to define them.

    /** @method cache */
    cache: function () {},

    /** @method isLocked */
    isLocked: function () {},

    /** @method startingRequest */
    startingRequest: function () {},

    /** @method startingRequest */
    finishedRequest: function () {}
    
});
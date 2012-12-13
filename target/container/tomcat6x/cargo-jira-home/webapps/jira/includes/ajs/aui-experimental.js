/**
 * This file contains stuff that should probably make it's way into AUI at some stage!
 */

/**
 * Returns a boolean if the passed string is "true" or "false", ignoring case, else returns the original string.
 * @param value
 * @since 5.0
 */
AJS.asBooleanOrString = function (value) {
    var lc = value ? value.toLowerCase() : "";

    if (lc == "true")  return true;
    if (lc == "false") return false;

    return value;
};


/**
 * AJS.Meta will be the namespace for accessing dynamic metadata passed from the
 * server to JavaScript via the page HTML.
 *
 * @since 5.0
 */
// A backing map to use if the user sets data.
AJS.overrides = {};

AJS.Meta = jQuery.extend({}, AJS.Meta, {

    /**
     * Sets metadata with a key and value, for use when the state of the page changes after
     * loading from the server
     * @param key
     * @param value
     */
    set: function (key, value) {
        AJS.overrides[key] = value;
    },

    /**
     * Returns a value given a key. If no entry exists with the key, undefined is returned.
     * If the string value is "true" or "false" the respective boolean value is returned.
     *
     * @method get
     * @param key
     * @return {String} or {boolean}
     */
    get: function (key) {
        if (typeof AJS.overrides[key] != "undefined") return AJS.overrides[key];

        var metaEl = jQuery("meta[name='ajs-" + key + "']");
        if (!metaEl.length)
            return undefined;

        var value = metaEl.attr("content");
        return AJS.asBooleanOrString(value);
    },

    /**
     * Returns true if the value for the provided key is equal to "true", else returns false.
     *
     * @method getBoolean
     * @param key
     * @return {boolean}
     */
    getBoolean: function (key) {
        return this.get(key) === true;
    },

    /**
     * Returns a number if the value for the provided key can be converted to one.
     * Good for retrieving content ids to check truthiness (e.g. '0' is truthy but 0 is falsy).
     *
     * @method getNumber
     * @param key
     * @return {number}
     */
    getNumber: function (key) {
        return +this.get(key);
    },

    /**
     * Mainly for use when debugging, returns all Data pairs in a map for eyeballing.
     */
    getAllAsMap: function () {
        var map = {};
        jQuery("meta[name^=ajs-]").each(function () {
            map[this.name.substring(4)] = this.content;
        });
        return jQuery.extend(map, AJS.overrides);
    }

});
/**
 * Persistent storage mechanism for JIRA.Avatar
 *
 * This default store uses a CRUD rest interface. This is probable best described with an example:
 *
 * Invocation:
 * new JIRA.AvatarStore({restUrl: "http://jira.com/rest/api/latest/project/HSP/avatar"});
 * new JIRA.AvatarStore({restUrl: "http://jira.com/rest/api/latest/user/avatar", restParams: {username: "admin"} });
 *
 * REST:
 *
 * Gets all avatars for a project
 * Type: GET
 * URL: http://jira.com/rest/api/latest/project/HSP/avatars
 * Response: {"system":[{"id":10001,"isSystemAvatar":true,"selected":false}], "custom": [{"id":10002,"isSystemAvatar":false,"selected":false}]}
 *
 * Gets all avatars for a user
 * Type: GET
 * URL: http://jira.com/rest/api/latest/user/avatars?username=admin
 * Response: {"system":[{"id":10001,"isSystemAvatar":true,"selected":false}], "custom": [{"id":10002,"isSystemAvatar":false,"selected":false}]}
 *
 * Selects avatar
 * Type: PUT
 * URL: http://jira.com/rest/api/latest/project/HSP/avatar
 * Request: {"id":10001,"isSystemAvatar":true,"selected":false}
 *
 * Deletes avatar
 * Type: DELETE
 * URL: http://jira.com/rest/api/latest/project/HSP/avatar
 * Request: {"id":10001,"isSystemAvatar":true,"selected":false}
 *
 * Upload temporary avatar
 * URL: http://jira.com/rest/api/latest/project/HSP/avatar/temporary
 * Type: Wildcard
 * Request: io stream (for supporting browsers) or multipart
 *
 * Cropping and confirming temporary avatar (converts to real avatar)
 * Type: POST
 * URL: http://jira.com/rest/api/latest/project/HSP/avatar
 * Request: {"cropperOffsetX":"90","cropperOffsetY":"57","cropperWidth":"143"}
 *
 * Note: If you want to use a different storage mechanism, you can implement the same interface as here and pass it to the
 * constructor of your JIRA.AvatarManager
 */
JIRA.AvatarStore = Class.extend({

    /**
     * @constructor
     * @param options
     * ... {String} restUrl - The base url for rest requests (CRUD style, see class description)
     * ... {String} restParams - The optional query parameters to append to the base URL for rest requests (CRUD style, see class description)
     * ... {Number} defaultAvatarId - The id of defualt avatar. The selected avatar if user has not selected one yet.
     */
    init: function (options) {

        if (!options.restUrl) {
            throw new Error("JIRA.AvatarStore.init: You must specify [restUrl], The base url for rest requests (CRUD style, see class description)")
        }

        if (!options.defaultAvatarId) {
            throw new Error("JIRA.AvatarStore.init: You must specify [defaultAvatarId] to the contructor so the store " +
                "knows what to select if you delete the selected one")
        }

        this.restUrl = options.restUrl;
        this.restParams = options.restParams;
        this.avatars = {system: [], custom: []};
    },

    /**
     * Builds the REST URL using the restUrl and optional restParams options.
     *
     * @param options
     * ... {String} appendPath - an optional path component to append to the base URL
     */
    _buildCompleteUrl: function (options) {
        var completeUrl = this.restUrl;

        options = options || {};
        if (options.appendPath) {
            completeUrl += options.appendPath;
        }

        if (this.restParams) {
            var queryParams = '';
            for (var name in this.restParams) {
                queryParams += AJS.format('&{0}={1}', encodeURIComponent(name), encodeURIComponent(this.restParams[name]));
            }

            completeUrl += ('?' + queryParams.substr(1));
        }

        return completeUrl;
    },

    /**
     * Retrieves the Avatar by id.
     *
     * @param avatarId the avatar's id, must not be null.
     * @return the avatar with the given id or null if it doesn't exist.
     */
    getById: function (avatarId) {

        var match;

        jQuery.each(this.avatars.system, function (i, avatar) {
            if (this.getId() === avatarId) {
                match = avatar;
                return false;
            }
        });

        if (!match) {
            jQuery.each(this.avatars.custom, function (i, avatar) {
                if (this.getId() === avatarId) {
                    match = avatar;
                    return false;
                }
            });
        }

        return match;
    },

    /**
     * Update client side storage
     *
     * @param avatar
     */
    _selectAvatar: function (avatar) {

        var selected = this.getSelectedAvatar();

        if (selected) {
            selected.setUnSelected();
        }
        avatar.setSelected();
    },

    /**
     * Selects avatar, this will become the displayed avatar for the given type (ie project)
     *
     * @param {JIRA.Avatar} avatar
     * @param {Object} options
     * ... {Function(JIRA.Avatar)} success - ajax callback
     * ... {Function(XHR, testStatus, JIRA.SmartAjax.smartAjaxResult)} error - ajax callback
     */
    selectAvatar: function (avatar, options) {

        var instance = this;

        if (!avatar) {
            throw new Error("JIRA.AvatarStore.selectAvatar: Cannot select Avatar that does not exist")
        }

        JIRA.SmartAjax.makeRequest({
            type: "PUT",
            contentType: "application/json",
            dataType: "json",
            url: this._buildCompleteUrl(),
            data: JSON.stringify(avatar.toJSON()),
            success: function () {
                instance._selectAvatar(avatar);
                if (options.success) {
                    options.success.call(this, avatar);
                }
            },
            error: options.error
        });
    },

    /**
     * Removes avatar in client side store
     *
     * @param {JIRA.Avatar} avatar
     */
    _destory: function (avatar) {

        var index = jQuery.inArray(avatar, this.avatars.custom);

        if (index !== -1) {
            this.avatars.custom.splice(index, 1);
        } else {
            throw new Error("JIRA.AvatarStore._destroy: Cannot remove avatar [" + avatar.getId() + "], "
                    + "it might be a system avatar (readonly) or does not exist.");
        }
    },

    /**
     * Permanently removes the avatar from the system.
     *
     * @param {JIRA.Avatar} avatar - must not be null.
     * @param {Object} options
     * ... {Function(JIRA.Avatar)} success - ajax callback
     * ... {Function(XHR, testStatus, JIRA.SmartAjax.smartAjaxResult)} error - ajax callback
     */
    destroy: function (avatar, options) {

        var instance = this;

        options = options || {};

        if (!avatar) {
            throw new Error("JIRA.AvatarStore.destroy: Cannot delete Avatar that does not exist")
        }

        JIRA.SmartAjax.makeRequest({
            type: "DELETE",
            url: this.getRestUrlForAvatar(avatar),
            success: function () {
                instance._destory(avatar);
                if (avatar.isSelected()) {
                    instance.selectAvatar(instance.getById(instance.defaultAvatarId), options);
                } else if (options.success) {
                    options.success.apply(this, arguments);
                }
            },
            error: options.error
        });
    },

    /**
     * Gets selected avatar, the displayed avatar for the given type (ie project)
     *
     * @return {JIRA.Avatar}
     */
    getSelectedAvatar: function () {

        for (var i = 0; i < this.avatars.custom.length; i++) {
            if (this.avatars.custom[i].isSelected()) {
                return this.avatars.custom[i];
            }
        }

        for (i = 0; i < this.avatars.system.length; i++) {
            if (this.avatars.system[i].isSelected()) {
                return this.avatars.system[i];
            }
        }
    },

    /**
     * Updates avatar in our client side store
     *
     * @param {JIRA.Avatar} avatar
     */
    _update: function (avatar) {

        var instance = this;

        if (this.getById(avatar.getId())) {
            jQuery.each(this.avatars.custom, function (i) {
                if (this.getId() === avatar.getId()) {
                    instance.avatars.custom[i] = avatar;
                }
            });
        }
        else {
            throw new Error("JIRA.AvatarStore._update: Cannot update avatar [" + avatar.getId() + "], "
                    + "it might be a system avatar (readonly) or does not exist.");
        }
    },

    /**
     * Updates an avatar's properties to match those in the given avatar. The avatar
     * too change is identified by the id of the given avatar.
     *
     * @param {JIRA.Avatar} avatar - the avatar to update, must not be null.
     * @param {Object} options
     * ... {Function(JIRA.Avatar)} success - ajax callback
     * ... {Function(XHR, testStatus, JIRA.SmartAjax.smartAjaxResult)} error - ajax callback
     */
    update: function (avatar, options) {

        var instance = this;

        options = options || {};

        JIRA.SmartAjax.makeRequest({
                    type: "PUT",
                    url: this.getRestUrlForAvatar(avatar),
                    error: options.error,
                    success: function () {
                        instance._update(avatar);
                        if (options.success) {
                            options.success.apply(this, arguments);
                        }
                    }
                });
    },

    /**
     * Adds avatar to our client side store
     *
     * @param avatar
     */
    _add: function (avatar) {
        if (avatar.isSystemAvatar()) {
            this.avatars.system.push(avatar);
        }
        else {
            this.avatars.custom.push(avatar);
        }
    },

    /**
     * Creates an avatar with the properties of the given avatar.
     *
     * @param {Object} instructions
     * ... {Number} cropperOffsetX
     * ... {Number} cropperOffsetY
     * ... {Number} cropperWidth
     *
     * @param {Object} options
     * ... {Function(JIRA.Avatar)} success - ajax callback
     * ... {Function(XHR, testStatus, JIRA.SmartAjax.smartAjaxResult)} error - ajax callback
     */
    createAvatarFromTemporary: function (instructions, options) {

        var instance = this;

        options = options || {};

        JIRA.SmartAjax.makeRequest({
            type: "POST",
            url: this._buildCompleteUrl(),
            data: JSON.stringify(instructions),
            contentType: "application/json",
            dataType: "json",
            success: function (data) {

                var avatar = JIRA.Avatar.createCustomAvatar(data);
                instance._add(avatar);

                if (options.success) {
                    options.success.call(this, data);
                }
            },
            error: options.error
        });
    },

    /**
     *
     * Creates temporary avatar on server
     *
     * @param {HTMLElement} fileInput
     * @param {Object} options
     * ... {Function} success
     * ... {Function} error
     */
    createTemporaryAvatar: function (fileInput, options) {
        // add the restParams as option
        options = AJS.$.extend(true, {}, options, { params: this.restParams });

        JIRA.AvatarUtil.uploadTemporaryAvatar(this.restUrl + "/temporary", fileInput, options);
    },

    /**
     * Resets store with the Avatars created from the supplied JSON
     *
     * @param JSON avatar descriptors
     */
    _refresh: function (avatars) {

        var instance = this;

        instance.avatars.system = [];
        instance.avatars.custom = [];

        jQuery.each(avatars.system, function (i, descriptor) {
            instance.avatars.system.push(JIRA.Avatar.createSystemAvatar(descriptor));
        });

        jQuery.each(avatars.custom, function (i, descriptor) {
            instance.avatars.custom.push(JIRA.Avatar.createCustomAvatar(descriptor));
        });
    },

    /**
     * Goes back to the server and retrievs all avatars
     *
     * @param {Object} options
     * ... {Function} success
     * ... {Function} error
     */
    refresh: function (options) {

        var instance = this;

        options = options || {};

        JIRA.SmartAjax.makeRequest({
            url: this._buildCompleteUrl({ appendPath: "s" }),
            error: options.error,
            success: function (avatars) {
                instance._refresh(avatars);
                if (options.success) {
                    options.success.apply(this, arguments);
                }
            }
        });
    },

    /**
     * Gets all avatars, custom and system
     *
     * @return {Object}
     * ... {Array<JIRA.Avatar>} system
     * ... {Array<JIRA.Avatar>} custom
     */
    getAllAvatars: function () {
        return this.avatars;
    },

    /**
     * Provides an array of all system avatars.
     *
     * @return the system avatars, never null.
     */
    getAllSystemAvatars: function () {
        return this.avatars.system;
    },

    /**
     * Provides an array of all system avatars.
     *
     * @return the custom avatars.
     */
    getAllCustomAvatars: function () {
        return this.avatars.custom;
    },

    /**
     * Gets rest url to update a single avatar
     *
     * @param avatar
     */
    getRestUrlForAvatar: function (avatar) {
        return this._buildCompleteUrl({ appendPath: "/" + avatar.getId() });
    }
});

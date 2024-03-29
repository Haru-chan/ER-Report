/**
 * Creates/Renders avatar picker
 *
 * @class JIRA.AvatarPicker
 */
JIRA.AvatarPicker = AJS.Control.extend({

    /**
     * @constructor
     * @param {Object} options
     * ... {JIRA.AvatarManager or something that implements same interface} avatarManager
     * ... {JIRA.AvatarPicker.Avatar or something that implements same interface} avatarRenderer
     * ... {JIRA.Avatar.LARGE, JIRA.Avatar.MEDIUM, JIRA.Avatar.SMALL} size
     */
    init: function (options) {
        this.element = jQuery('<div id="jira-avatar-picker" />'); // the container element for the avatar picker
        this.avatarManager = options.avatarManager;
        this.avatarRenderer = options.avatarRenderer;
        this.imageEditor = options.imageEditor;
        this.size = options.size;
        this.selectCallback = options.select;
    },

    /**
     * Renders avatar picker
     *
     * @param {Function(jQueryElement)} - a callback function that will be called when rendering is complete, the first
     * agument of this function will be the contents of the avatar picker. You can then append this element to wherever you
     * want the picker displayed
     */
    render: function (ready) {

        var instance = this;

        // we need to go to the server and get all the avatars first
        this.avatarManager.refreshStore({

            success: function () {

                instance.element.html(JIRA.Templates.AvatarPicker.picker({
                    avatars: instance.avatarManager.getAllAvatarsRenderData(instance.size)
                }));

                instance._assignEvents("selectAvatar", instance.element.find(".jira-avatar img"));
                instance._assignEvents("deleteAvatar", instance.element.find(".jira-delete-avatar"));
                instance._assignEvents("uploader", instance.element.find("#jira-avatar-uploader"));

                // we are finished, call with picker contents
                ready(instance.element);
            },
            error: function (xhr, error, textStatus, smartAjaxResult) {
                instance.appendErrorContent(instance.element, smartAjaxResult);
                ready(instance.element);
            }
        });
    },

    /**
     *
     * Gets the most useful error response from a smartAjaxResponse and appends it to the picker
     *
     * @param el
     * @param smartAjaxResult
     */
    appendErrorContent: function (el, smartAjaxResult) {
        try {
            var errors = JSON.parse(smartAjaxResult.data);

            if (errors && errors.errorMessages) {
                jQuery.each(errors.errorMessages, function (i, message) {
                    AJS.messages.error(el, {
                        body: AJS.escapeHTML(message),
                        closeable: false,
                        shadowed: false
                    });
                });
            } else {
                el.append(JIRA.SmartAjax.buildDialogErrorContent(smartAjaxResult, true));
            }
        } catch (e) {
            el.append(JIRA.SmartAjax.buildDialogErrorContent(smartAjaxResult, true));
        }
    },

    /**
     * Saves temporary avatar and invokes cropper
     *
     * @param {HTMLElement} field
     */
    uploadTempAvatar: function (field) {

        var instance = this;

        this.avatarManager.createTemporaryAvatar(field, {

            success: function (data) {

                if (data.id) {
                    // We have an avatar and don't need to crop
                    instance.render(function () {
                        instance.selectAvatar(data.id);
                    });
                } else {
                    field.val("");
                    // go to parent to find it as in dialogs we pull it out of the container element
                    instance.element.parent().parent()
                            .find(".jira-avatar-upload-form").hide();

                    instance.element.hide();
                    instance.element.parent().append(instance.imageEditor.render(data));

                    instance.imageEditor.edit({
                        confirm: function (instructions) {
                            instance.avatarManager.createAvatarFromTemporary(instructions, {
                                success: function (data) {
                                    instance.render(function () {
                                        instance.selectAvatar(data.id);
                                    });
                                }
                            });
                        },
                        cancel: function () {
                            instance.imageEditor.element.remove();
                            instance.element.show();
                            instance.element.parent().parent()
                                .find(".jira-avatar-upload-form").show();
                        }
                    });
                }
            },
            error: function () {
                console.log(arguments);
            }
        });
    },

    /**
     * Gets avatar HTML element based on it's database id
     *
     * @param {String} id
     * @return {jQuery}
     */
    getAvatarElById: function (id) {
        return this.element.find(".jira-avatar[data-id='" + id + "']");
    },

    /**
     * Selects avatar
     *
     * @param {String} id - avatar id
     */
    selectAvatar: function (id) {

        var avatar,
            instance = this;

        avatar = this.avatarManager.getById(id);

        this.avatarManager.selectAvatar(this.avatarManager.getById(id), {
            error: function () {
            },
            success: function () {

                instance.getAvatarElById(id).remove();

                if (instance.selectCallback) {
                    instance.selectCallback.call(instance, avatar,
                            instance.avatarManager.getAvatarSrc(avatar, instance.size));
                }
            }
        });
    },

    /**
     * Deletes avatar, shows confirmation before hand
     *
     * @param {String} id - avatar id
     */
    deleteAvatar: function (id) {

        var instance = this;

        if (confirm(AJS.I18n.getText("avatarpicker.delete.avatar"))) {
            this.avatarManager.destroy(this.avatarManager.getById(id), {
                error: function () {

                },
                success: function () {

                    var selectedAvatar = instance.avatarManager.getSelectedAvatar(), 
                        $avatar = instance.getAvatarElById(id);

                    $avatar.fadeOut(function () {
                        $avatar.remove();
                    });

                    // if the avatar we have deleted is the selected avatar, then we want to set the selected avatar to be
                    // the default. This is done automagically in AvatarStore.
                    if (selectedAvatar.getId() !== id) {

                        instance.getAvatarElById(selectedAvatar.getId()).addClass("jira-selected-avatar");

                        instance.selectCallback.call(instance, selectedAvatar,
                                instance.avatarManager.getAvatarSrc(selectedAvatar, instance.size), true)
                    }
                }
            });
        }
    },

    _events: {
        uploader: {
            change: function (e, el) {
                this.uploadTempAvatar(el);
            }
        },
        deleteAvatar: {
            click: function (e, el) {
                this.deleteAvatar(el.attr("data-id"));
            }
        },
        selectAvatar: {
            click: function (e, el) {
                // Don't select avatar if we click an overlay, such as delete icon
                if (e.target === el[0]) {
                    this.selectAvatar(el.attr("data-id"));
                }
            }
        }
    }
});

/**
 * Handles cropping of avatar
 *
 * @class JIRA.AvatarPicker.ImageEditor
 *
 */
JIRA.AvatarPicker.ImageEditor = AJS.Control.extend({

    /**
     * Renders cropper
     *
     * @param {Object} data
     * ... {Number} cropperOffsetX
     * ... {Number} cropperOffsetY
     * ... {Number} cropperWidth
     */
    render: function (data) {
        this.element = jQuery("<div />").html(JIRA.Templates.AvatarPicker.imageEditor(data));
        return this.element;
    },

    /**
     * Initializes cropper
     *
     * @param {Object} options
     * ... {Function} confirm
     * ... {Function} cancel
     */
    edit: function (options) {

        var instance = this,
                avator = this.element.find(".avataror");

        options = options || {};

        avator.bind("AvatarImageLoaded", positionDialogInCenter);

        avator.find("img").load(function () {
            avator.avataror({
                previewElement: instance.element.find(".jira-avatar-copper-form"),
                parent: instance.element
            });
        });

        jQuery("#avataror").submit(function (e) {

            e.preventDefault();

            if (options.confirm) {
                options.confirm({
                    cropperOffsetX: jQuery("#avatar-offsetX").val(),
                    cropperOffsetY: jQuery("#avatar-offsetY").val(),
                    cropperWidth: jQuery("#avatar-width").val()
                });
            }
        })
        .find(".cancel").click(function (e) {

            if (options.cancel) {
                options.cancel();
            }

            positionDialogInCenter();

            e.preventDefault();
        });
    }

});

function positionDialogInCenter() {
    if (JIRA.Dialog.current) {
        // When in dialog, adds scrollbars if the image is too big
        JIRA.Dialog.current._positionInCenter();
    }
}

/**
 * Creates project avatar picker
 *
 * @param options
 * ... {String} projectKey
 *
 * @return JIRA.AvatarPicker
 */
JIRA.AvatarPicker.createProjectAvatarPicker = function (options) {
    return new JIRA.AvatarPicker({
        avatarManager: JIRA.AvatarManager.createProjectAvatarManager({
            projectKey: options.projectKey,
            projectId: options.projectId,
            defaultAvatarId: options.defaultAvatarId
        }),
        imageEditor: new JIRA.AvatarPicker.ImageEditor(),
        size: JIRA.Avatar.LARGE,
        select: options.select
    });
};

/**
 * Creates user avatar picker
 *
 * @param options
 * ... {String} username
 *
 * @return JIRA.AvatarPicker
 */
JIRA.AvatarPicker.createUserAvatarPicker = function (options) {
    return new JIRA.AvatarPicker({
        avatarManager: JIRA.AvatarManager.createUserAvatarManager({
            username: options.username,
            defaultAvatarId: options.defaultAvatarId
        }),
        imageEditor: new JIRA.AvatarPicker.ImageEditor(),
        size: JIRA.Avatar.LARGE,
        select: options.select
    });
};

/**
 * Creates a project avatar picker dialog
 *
 * @param {Object} options
 * ...{HTMLElement, String} trigger - element that when clicked will bring up dialog
 * ... {String} projectKey
 * ... {String} projectId
 */
JIRA.createProjectAvatarPickerDialog = function (options) {
    var projectAvatarDialog = new JIRA.FormDialog({
        trigger: options.trigger,
        id: "project-avatar-picker",
        width: 560,
        content: function (ready) {

            var avatarPicker,
                $dialogWrapper;

            $dialogWrapper = jQuery("<div />");

            jQuery("<h2 />").text(AJS.I18n.getText('avatarpicker.project.title'))
                    .appendTo($dialogWrapper);


            avatarPicker = JIRA.AvatarPicker.createProjectAvatarPicker({
                projectKey: options.projectKey,
                projectId: options.projectId,
                defaultAvatarId: options.defaultAvatarId,
                select: function (avatar, src, implicit) {
                    if (options.select) {
                        options.select.apply(this, arguments);
                    }
                    if (!implicit) {
                        projectAvatarDialog.hide();
                    }
                }
            });

            avatarPicker.render(function (content) {
                $dialogWrapper.append(content);
                ready($dialogWrapper);
            });
        }
    });

    projectAvatarDialog._focusFirstField = function () {};
};


/**
 * Creates a project avatar picker dialog
 *
 * @param {Object} options
 * ...{HTMLElement, String} trigger - element that when clicked will bring up dialog
 * ... {String} projectKey
 * ... {String} projectId
 */
JIRA.createUserAvatarPickerDialog = function (options) {

    var userAvatarDialog = new JIRA.FormDialog({
        trigger: options.trigger,
        id: "user-avatar-picker",
        width: 560,
        content: function (ready) {

            var avatarPicker,
                $dialogWrapper;

            $dialogWrapper = jQuery("<div />");

            jQuery("<h2 />").text(AJS.I18n.getText('avatarpicker.user.title'))
                    .appendTo($dialogWrapper);


            avatarPicker = JIRA.AvatarPicker.createUserAvatarPicker({
                username: options.username,
                defaultAvatarId: options.defaultAvatarId,
                select: function (avatar, src, implicit) {

                    if (options.select) {
                        options.select.apply(this, arguments);
                    }

                    jQuery(".avatar-image").attr("src", src);

                    if (!implicit) {
                        userAvatarDialog.hide();
                    }
                }
            });

            avatarPicker.render(function (content) {
                $dialogWrapper.append(content);
                ready($dialogWrapper);
            });
        }
    });

    userAvatarDialog._focusFirstField = function () {};
}


// initialize user picker dialog
jQuery(function () {
    JIRA.createUserAvatarPickerDialog({
        trigger: "#user_avatar_image",
        username: jQuery("#avatar-owner-id").text(),
        defaultAvatarId: jQuery("#default-avatar-id").text()
    });
});

(function () {


    function initProjectAvatarPicker(ctx) {
         var triggerImg = jQuery("#project_avatar_image", ctx);
        JIRA.createProjectAvatarPickerDialog({
            trigger: triggerImg,
            projectId: jQuery(ctx).find("#avatar-owner-id").text(),
            projectKey: jQuery(ctx).find("#avatar-owner-key").text(),
            defaultAvatarId: jQuery(ctx).find("#default-avatar-id").text(),
            select: function (avatar, src) {
                triggerImg.attr("src", src);
            }
        });
    }

    JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, function (e, context) {
        initProjectAvatarPicker(context);
    });

})();
(function ($) {

    function createSingleUserPickers(ctx) {

        var restPath = "/rest/api/1.0/users/picker";

        $(".js-default-user-picker", ctx).each(function () {
            var $this = $(this);
            if ($this.data("aui-ss")) return;

            var data = {showAvatar: true};

            new AJS.SingleSelect({
                element: $this,
                showDropdownButton: !!$this.attr('data-show-dropdown-button'),
                removeOnUnSelect: true,
                submitInputVal: true,
                overlabel: AJS.I18n.getText("user.picker.ajax.short.desc"),
                errorMessage: AJS.I18n.getText("admin.errors.invalid.user"),
                ajaxOptions: {
                    url: contextPath + restPath,
                    query: true, // keep going back to the sever for each keystroke
                    minQueryLength: 1,
                    data: data,
                    formatResponse: function (response) {

                        var ret = [];

                        $(response).each(function(i, suggestions) {

                            var groupDescriptor = new AJS.GroupDescriptor({
                                weight: i, // order or groups in suggestions dropdown
                                id: "user-suggestions",
                                replace: true,
                                label: suggestions.footer // Heading of group
                            });


                            $(suggestions.users).each(function() {
                                groupDescriptor.addItem(new AJS.ItemDescriptor({
                                    value: this.name, // value of item added to select
                                    label: this.displayName, // title of lozenge
                                    html: this.html,
                                    allowDuplicate: false,
                                    icon: this.avatarUrl
                                }));
                            });

                            ret.push(groupDescriptor);
                        });

                        return ret;
                    }
                }
            });
        });
    }

    JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, function (e, context) {
        createSingleUserPickers(context);
    });

})(AJS.$);




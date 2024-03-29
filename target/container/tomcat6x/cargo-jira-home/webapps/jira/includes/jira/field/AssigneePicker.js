/**
 * A single-select list for selecting Assignees. Assignees in the list are in two groups:
 *
 * - Suggestions: local data, consisting of recent assignees for the issue and current
 *                user, plus the reporter
 * - Search: AJAX data, found from all user assignable for the current project
 *
 * @constructor JIRA.AssigneePicker
 * @extends AJS.SingleSelect
 */
JIRA.AssigneePicker = AJS.SingleSelect.extend({

    init: function (options) {

        var element = options.element;

        // Returns the data sent to the server for the AJAX search
        function data(query) {
            return {
                username: query,
                projectKeys: AJS.params.projectKeys,
                issueKey:AJS.params.assigneeEditIssueKey,
                maxResults:10
            };
        }

        function formatResponse(response) {

            var ret = [];

            if (response.length) {
                // Search results
                var groupDescriptor = new AJS.GroupDescriptor({
                    weight: 1,          // index of group in dropdown
                    id: "assignee-group-search",
                    uniqueItemScope: 'container',
                    replace: true,     // Allow subsequent calls to replace model items
                    label: AJS.I18n.getText("assignee.picker.group.search")
                });

                for (var i = 0, len = response.length; i < len; i++) {
                    var user = response[i];

                    var username = user.name;
                    var displayName = user.displayName;
                    var emailAddress = user.emailAddress;
                    var label = displayName + ' - ' + emailAddress + ' (' + username + ')';

                    groupDescriptor.addItem(new AJS.ItemDescriptor({
                        value: username,
                        fieldText: displayName,
                        label: label,
                        allowDuplicate: false,
                        icon: user.avatarUrls['16x16']
                    }));
                }
                ret.push(groupDescriptor);
            }

            return ret;
        }

        AJS.$.extend(options, {
            showDropdownButton: !!element.attr('data-show-dropdown-button'),
            errorMessage: AJS.I18n.getText("assignee.picker.invalid.user"),
            localDataGroupId: 'assignee-group-suggested',
            serverDataGroupId: 'assignee-group-search',
            ajaxOptions: {
                url: function() {
                    //reset the assigneeEditIssueKey param, so that when we go from an quickedit dialog to a quick create dialog for
                    //example the value isn't set!
                    AJS.params.assigneeEditIssueKey = undefined;
                    AJS.populateParameters();

                    var path = AJS.params.assigneeEditIssueKey ? 'search' : 'multiProjectSearch';
                    return contextPath + "/rest/api/latest/user/assignable/" + path;
                },
                query: true,                // keep going back to the server for each keystroke
                minQueryLength: 1,
                noQueryNoRequest: true,     // don't make a server request if no query string
                data: data,
                formatResponse: formatResponse
            }
        });

        this._super(options);
    },

    getAjaxOptions: function() {
        var ajaxOptions = this._super();
        if(typeof ajaxOptions.url === 'function') {
            //first time this runs lets evaluate the function and set the URL to be what the function returns.
            //doing so over and over would be expensive.
            this.options.ajaxOptions.url = ajaxOptions.url();
            ajaxOptions.url = this.options.ajaxOptions.url;
        }

        return ajaxOptions;
    },

    /**
     * Handle the case where the entry was deleted - on blur, set the Assignee to 'Automatic'.
     */
    handleFreeInput: function() {
        var value = AJS.$.trim(this.$field.val());
        if (!value && this.$container.hasClass("aui-ss-editing")) {
            value = '-1';
            this.$field.val(value);
        }
        this._super(value);
    },

    /**
     * Assignee Picker is a special case as we have <option>s that are prepopulated and ones that are requested from the
     * server. Our super class will remove all of our <option>s whenever we make a new request as it is expecting that
     * because we go to the server all our <option>s will be populated from the server also. This is not the case
     * overriding this method fixes this issue. If we do not override we get JRADEV-8626.
     */
    cleanUpModel: function () {}

});
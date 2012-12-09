AJS.test.require("jira.webresources:avatar-picker");

test("buildCompleteUrl should work for URLs with or without query params", function() {
    var projAvatarStore = new JIRA.AvatarStore({
        restUrl: "http://localhost:8090/jira/rest/api/latest/project/HSP-1",
        defaultAvatarId: 1000
    });
    equal(projAvatarStore._buildCompleteUrl(), "http://localhost:8090/jira/rest/api/latest/project/HSP-1", "URL for project avatar");

    var userAvatarStore = new JIRA.AvatarStore({
        restUrl: "http://localhost:8090/jira/rest/api/latest/user",
        restParams: { username: "fred" },
        defaultAvatarId: 1000
    });
    equal(userAvatarStore._buildCompleteUrl(), "http://localhost:8090/jira/rest/api/latest/user?username=fred", "URL for user avatar");
});
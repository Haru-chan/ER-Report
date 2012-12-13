(function($) {

    test("Mention regular expressions", function() {

        function match(text) {
            return JIRA.Mention.Matcher.getUserNameFromCurrentWord(text, text.length);
        }
        ok(!match("@"), "matching @");
        equal(match("@a"), "a", "matching @a");

        ok(!match("["), "matching [");
        ok(!match("[a"), "matching [a");
        ok(!match("[@"), "matching [@");
        equal(match("[@a"), "a", "matching [@a");
        equal(match("[@~"), "~", "matching [@~");
        equal(match("[@~a"), "~a", "matching [@~a");
        ok(!match("[~"), "matching [~");
        equal(match("[~a"), "a", "matching [~a");
        ok(!match("[~@"), "matching [~@");
        equal(match("[~@a"), "a", "matching [~@a");

        equal(match("test@a"), "a", "matching test@a");
        equal(match("test[@a"), "a", "matching test[@a");
        equal(match("test[@~a"), "~a", "matching test[@~a");
        equal(match("test[~a"), "a", "matching test[~a");
        equal(match("test[~@a"), "a", "matching test[~@a");

        equal(match("a test@a"), "a", "matching a test@a");
        equal(match("a test[@a"), "a", "matching a test[@a");
        equal(match("a test[@~a"), "~a", "matching a test[@~a");
        equal(match("a test[~a"), "a", "matching a test[~a");
        equal(match("a test[~@a"), "a", "matching a test[~@a");
    });
})(AJS.$);

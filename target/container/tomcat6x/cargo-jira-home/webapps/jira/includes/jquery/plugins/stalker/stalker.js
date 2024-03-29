/**
 * When scrolled past, attaches specified element to the top of the screen.
 *
 * <pre>
 * <strong>Usage:</strong>
 * jQuery("#stalker").stalker();
 * </pre>
 */
jQuery.fn.stalker = function (){

    var $win = jQuery(window), /* jQuery wrapped window */
        $doc = jQuery(document), /* jQuery wrapped document */
        $stalkerContent, /* We use this element to determine the size of the stalker placeholder */
        $stalker, /* Element that will follow user scroll (Stalk) */
        $transitionElems, /* Elements preceding stalker */
        offsetY, /* offset top position of stalker */
        placeholder, /* A div inserted as placeholder for stalker */
        lastScrollPosY, /* Position last scrolled to */
        stalkerHeight, /* Height of stalker */
        isInitialized, /* Flag if control is initialized (onscroll) */
        selector = this.selector; /* Selector for stalker */

    function getScrollTop(scrollPos) {
        //JRADEV-7168: Fix issues on OSX lion with scrolling past the top of the page
        return Math.max(0, jQuery(window).scrollTop(scrollPos));
    }

    function isSupported() {
        if (jQuery.browser.msie && jQuery.browser.version < 7) {
            return false;
        }
        return true;
    }

    // JRA-23650: IE 7&8 can't render bold text with anti-aliasing when an opacity filter is applied to the parent element, so header fade-out needs to be turned off
    function supportsOpacityTransition() {
        return !jQuery.browser.msie || (jQuery.browser.msie && jQuery.browser.version > 8);
    }

    function getInactiveProperties () {
        return {
            position: "fixed",
            top: offsetY - getScrollTop()
        };
    }

    function initialize() {

        $stalker = jQuery(selector);

        if ($stalker.length === 0) {
            return;
        }

        offsetY = $stalker.offset().top;

        $stalkerContent = $stalker.find(".stalker-content");
        $transitionElems = AJS.$('#header');

        // need to set overflow to hidden for correct height in IE.

        function setStalkerHeight () {
            $stalker.css("overflow", "hidden");
            stalkerHeight = $stalker.outerHeight();
            $stalker.css("overflow", "");
        }

        // create a placeholder as our stalker bar is now fixed
        function createPlaceholder () {

            placeholder = jQuery("<div />")
                .addClass("stalker-placeholder")
                .css({visibility:"hidden", height: stalkerHeight})
                .insertBefore($stalker);
        }

        function setPlaceholderHeight () {
            placeholder.height($stalkerContent.outerHeight());
        }
        
        setStalkerHeight();
        createPlaceholder();
        setPlaceholderHeight();

        // set calculated fixed (or absolute) position
        $stalker.css(getInactiveProperties());

        // custom event to reset stalker placeholde r height
        $stalker.bind("stalkerHeightUpdated", setPlaceholderHeight);
        $stalker.bind("positionChanged", setStalkerPosition);

        isInitialized = true;
    }

    function offsetPageScrolling() {

        function setScrollPostion(scrollTarget) {
            var docHeight = jQuery.getDocHeight(),
                scrollPos;
            if (scrollTarget >= 0 && scrollTarget <= docHeight) {
                scrollPos = scrollTarget;
            } else if (scrollTarget >= getScrollTop()) {
                scrollPos = docHeight;
            } else if (scrollTarget < 0) {
                scrollPos = 0;
            }
            getScrollTop(scrollPos);
        }

        function pageUp() {

            if (!isInitialized) {
                initialize();
            }

            var scrollTarget = getScrollTop() - jQuery(window).height();

            setScrollPostion(scrollTarget + stalkerHeight);
        }

        function pageDown() {



            if (!isInitialized) {
                initialize();
            }

            var scrollTarget = getScrollTop() + jQuery(window).height();

            setScrollPostion(scrollTarget - stalkerHeight);
        }

        $doc.bind("keydown", function(event) {
            // Don't change the behaviour of key events when a form element has focus.
            if (jQuery(event.target).is("input,select,textarea,button")) {
                return;
            }

            var handler;

            switch (event.keyCode) {
                case AJS.$.ui.keyCode.SPACE:
                    handler = (event.shiftKey) ? pageUp : pageDown;
                    break;
                case AJS.$.ui.keyCode.PAGE_UP:
                    handler = pageUp;
                    break;
                case AJS.$.ui.keyCode.PAGE_DOWN:
                    handler = pageDown;
                    break;
                default:
                    // Don't preventDefault()
                    return;
            }

            // Only scroll the window when the window is scrollable, i.e. not showing a popup dialog.
            if (jQuery("body").css("overflow") !== "hidden") {
                handler();
            }

            event.preventDefault();
        });
    }

    function containDropdownsInWindow () {
        $doc.bind("showLayer", function (e, type, obj) {

            var stalkerOffset,
                targetHeight;

            if (!isInitialized) {
               initialize();
            }

            if (type === "dropdown" && obj.$.parents(selector).length !== -1) {
                stalkerOffset = ($stalker.hasClass("detached") || !$stalker.offset() ? 0 : $stalker.offset().top);
                targetHeight = jQuery(window).height() - $stalker.height() - stalkerOffset;
                if (targetHeight <= parseInt(obj.$.attr("scrollHeight"), 10)) {
                    JIRA.containDropdown.containHeight(obj, targetHeight);
                } else {
                    JIRA.containDropdown.releaseContainment(obj);
                }
                obj.reset();

            }
        });
    }

    if (!isSupported()) {
        return;
    }

    // IE miscalculates $stalker.offset() if this method is called before window.onload
    // but after the user scrolls the window, so we need to wait until the page loads
    // before calling setup().
    if (jQuery.browser.msie) {
        jQuery(setup);
        jQuery(setStalkerPosition);
    } else {
        setup();
    }

    function setup() {
        offsetPageScrolling();
        containDropdownsInWindow();

        // we may need to update the height of the stalker placeholder, a click event could have caused changes to stalker
        // height. This should probably be on all events but leaving at click for now for performance reasons.
        $doc.click(function (e) {
            if (jQuery(e.target).parents(selector).length !== 0 && !isInitialized) {
                initialize();
            }
        });

        $doc.bind("showLayer", function(e, type, obj) {
            if (obj && $transitionElems && supportsOpacityTransition()) {
                // Restore full opacity to $transitionElems if a layer is shown closeby -- e.g., when a navbar
                // dropdown is opened. Note: On Studio, this is needed to ensure the layer itself has full opacity.
                // We have the information needed for some layer types, but need to use heuristics for other cases.
                var $offsetTarget = obj.$offsetTarget || obj.trigger;
                if ($offsetTarget && $offsetTarget[0]) {
                    for (var i = 0; i < $transitionElems.length; i++) {
                        if ($transitionElems[i] === $offsetTarget[0] || jQuery.contains($transitionElems[i], $offsetTarget[0])) {
                            $transitionElems.css("opacity", "");
                            break;
                        }
                    }
                } else if (obj.id === "create_issue_popup") {
                    $transitionElems.css("opacity", "");
                }
            }
            // firefox needs to reset the stalker position
            if (jQuery.browser.mozilla && type === "popup") {
                setStalkerPosition();
            }
        });

        $win.scroll(setStalkerPosition);

        $win.resize(function () {
            if ($stalker) {
                $stalker.trigger("stalkerHeightUpdated");
            }
        });
    }

    function setStalkerPosition () {
        function getOpacitySetting() {
            var opacityTarget = 1 - getScrollTop() / offsetY;
            if (opacityTarget > 1) {
                return "";
            } else if (opacityTarget < 0) {
                return 0;
            } else {
                return opacityTarget;
            }
        }

        if (!isInitialized) {
            initialize();
        }

        if (supportsOpacityTransition() && $transitionElems) {
            $transitionElems.css("opacity", getOpacitySetting());
        }
        
        if (offsetY <= getScrollTop()){
            if (!$stalker.hasClass("detached")) {
                $stalker.css({top:0, position: "fixed"})
                    .addClass("detached");
            }
        } else {
            $stalker.css(getInactiveProperties())
                .removeClass("detached");
        }
        lastScrollPosY = getScrollTop();
    }

    return this;
};

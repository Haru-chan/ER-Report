// Inspired by base2 and Prototype
(function() {

    begetObject = function (obj) {
        var f = function() {
        };
        f.prototype = obj;
        return new f();
    };


    var initializing = false, fnTest = /xyz/.test(function() {
        xyz;
    }) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.Class = function() {
    };

    // Create a new Class that inherits from this class
    Class.extend = function() {

        var prop;

        var _super = this.prototype;

        if (arguments.length > 1) {

            var interfaces = AJS.$.makeArray(arguments);

            prop = interfaces.pop();

            var completeInterface;

            AJS.$.each(interfaces, function (i, inter) {
                if (completeInterface) {
                    completeInterface = completeInterface.extend(inter);
                } else {
                    completeInterface = inter;
                }
            });

            return completeInterface.extend(this.prototype).extend(prop);

        } else {
            prop = arguments[0];
        }

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function

            if (prototype[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name])) {
                prototype[name] = (function(name, fn) {
                    return function() {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]);
            } else if (typeof _super[name] === "object") {
                var newObj = begetObject(prop[name]);

                AJS.$.each(_super[name], function (name, obj) {
                    if (!newObj[name]) {
                        newObj[name] = obj;
                    } else if (typeof newObj[name] === "object") {
                        var newSubObj = begetObject(newObj[name]);
                        AJS.$.each(obj, function (subName, subObj) {
                            if (!newSubObj[subName]) {
                                newSubObj[subName] = subObj;
                            }
                        });
                        newObj[name] = newSubObj;
                    }
                });

                prototype[name] = newObj;
            } else {
                prototype[name] = prop[name];
            }
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if (!initializing && this.init)
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.fn = Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();

// additional methods on the base Class.

/**
 * Bindes event on instance
 *
 * @param {String} evt - Event Name
 * @param {Array} args - Args to pass to event handlers
 */
Class.prototype.bind = function (evt, func) {
    jQuery(this).bind(evt, func);
    return this;
};

/**
 * Used to fire custom events on instance.
 *
 * @method trigger
 * @param {String} event -- The name of the event to trigger.
 */
Class.prototype.trigger = function(event) {
    var instance = jQuery(this),
        args = Array().slice.call(arguments, 1)
    event = new jQuery.Event(event);
    args.unshift(event);
    instance.trigger.apply(instance, args);
    return !event.isDefaultPrevented();
};

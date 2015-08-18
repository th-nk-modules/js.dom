/**
* DOM helpers module
* @module dom
* @global
*/

var hasClassList = !!document.documentElement.classList;

var containsClass = function(elm, className) {
    if (hasClassList) {
        containsClass = function(elm, className) {
            return elm.classList.contains(className);
        }
    } else {
        containsClass = function(elm, className) {
            if (!elm || !elm.className) {
                return false;
            }
            var re = new RegExp('(^|\\s)' + className + '(\\s|$)');
            return elm.className.match(re);
        }
    }
    return containsClass(elm, className);
};

var addClass = function(elm, className) {
    if (hasClassList) {
        addClass = function(elm, className) {

            if (className.indexOf(' ') > 0){
                var names = className.split(' ');
                for (var i = 0, il = names.length; i<il; i++){
                    elm.classList.add(names[i]);
                }
            }
            else {
                elm.classList.add(className);
            }
        }
    } else {
        addClass = function(elm, className) {
            if (!elm) {
                return false;
            }
            if (!containsClass(elm, className)) {
                elm.className += (elm.className ? ' ' : '') + className;
            }
        }
    }
    addClass(elm, className);
};

var removeClass = function(elm, className) {
    if (hasClassList) {
        removeClass = function(elm, className) {
            elm.classList.remove(className);
        }
    } else {
        removeClass = function(elm, className) {
            if (!elm || !elm.className) {
                return false;
            }
            var regexp = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
            elm.className = elm.className.replace(regexp, '$2');
        }
    }
    removeClass(elm, className);
};

var toggleClass = function(elm, className) {
    if (hasClassList) {
        toggleClass = function(elm, className) {
            return elm.classList.toggle(className);
        }
    } else {
        toggleClass = function(elm, className) {
            if (containsClass(elm, className))
            {
                removeClass(elm, className);
                return false;
            } else {
                addClass(elm, className);
                return true;
            }
        }
    }
    return toggleClass(elm, className);
};

var remove = function(elm) {
    elm.parentNode.removeChild(elm);
};

var scrollPosition = function() {
    var doc = document.documentElement;
    return {
        top: (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0),
        left: (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
    }
};

var createDOM = function(str,location) {
    var temp = document.createElement('div');
    temp.innerHTML = str;
    var children;

    if (!location){
        children = temp;
    }
    else {
        children = temp.children;
        arr.each(location,function(str,i,name) {
            children = (i == location.length-1) ? children[str] : children[str].children;
        });
    }

    return children;
};

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
                        eventListenerSupported = window.addEventListener;
var observeDOM = function(elm, callback) {
    if ( MutationObserver ){
        var obs = new MutationObserver(function(mutations, observer) {
            if ( mutations[0].addedNodes.length || mutations[0].removedNodes.length ){
                callback();
            }
        });
        obs.observe( elm, { childList:true, subtree:true });
    }
    else if ( eventListenerSupported ){
        elm.addEventListener('DOMNodeInserted', callback, false);
        elm.addEventListener('DOMNodeRemoved', callback, false);
    }
};

module.exports = {
    /**
     * Check for classlist
     * @memberOf module:dom#
     * @function
     */
    hasClassList:hasClassList,
    /**
     * Adds class name to element
     * @memberOf module:dom#
     * @param {object} elm
     * @param {string} className
     * @function
     */
    addClass:addClass,
    /**
     * Removes class name from element
     * @memberOf module:dom#
     * @param {object} elm
     * @param {string} className
     * @function
     */
    removeClass:removeClass,
    /**
     * Checks if class name on element exists
     * @memberOf module:dom#
     * @param {object} elm
     * @param {string} className
     * @function
     */
    hasClass:containsClass,
    /**
     * Toggles class names
     * @memberOf module:dom#
     * @param {object} elm
     * @param {string} className
     * @function
     */
    toggleClass:toggleClass,
    /**
     * Removes a dom node
     * @memberOf module:dom#
     * @param {object} elm
     * @function
     */
    remove:remove,
    /**
     * Gets current window scroll position
     * @memberOf module:dom#
     * @function
     */
    scrollPosition:scrollPosition,
    /**
     * Creates temporary dom node for ajax response
     * @memberOf module:dom#
     * @param {string} str
     * @param {array} location
     * @function
     */
    create:createDOM,
    /**
     * Checks for dom node changes
     * @memberOf module:dom#
     * @param {object} elm
     * @param {function} callback
     * @function
     */
    observe:observeDOM,
};

define("common", [], function() {
  var addClass, addClasses, animationEndEventName, createElement, evalInnerHtmlJavascript, getCookie, hasClass, initialize, removeClass, self, transitionEndEventName;
  initialize = function() {
    return true;
  };
  hasClass = function(el, className) {
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(el.className);
  };
  addClass = function(elem, className) {
    if (!hasClass(elem, className)) {
      return elem.className = (elem.className + ' ' + className).trim();
    }
  };
  addClasses = function(el, array) {
    var ael, _i, _len;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      ael = array[_i];
      addClass(el, ael);
    }
    return true;
  };
  removeClass = function(elem, className) {
    var newClass;
    newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
      while (newClass.indexOf(' ' + className + ' ') >= 0) {
        newClass = newClass.replace(' ' + className + ' ', ' ');
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
    return true;
  };
  getCookie = function(name) {
    var c, ca, key, res, _i, _len;
    key = namr + '=';
    ca = document.cookie.split(';');
    for (_i = 0, _len = ca.length; _i < _len; _i++) {
      c = ca[_i];
      if (c.indexOf(key) === 0) {
        res = c.substring(key.length, c.length);
        return res;
      }
    }
    return true;
  };
  createElement = function(tag, opt) {
    var el;
    el = document.createElement(tag);
    if (opt) {
      if (opt.cName) {
        el.className = opt.cName;
      }
      if (opt.inner) {
        el.innerHTML = opt.inner;
      }
      if (opt.disabled) {
        el.disabled = true;
      }
      if (opt.appendTo) {
        opt.appendTo.appendChild(el);
      }
    }
    return el;
  };
  transitionEndEventName = function() {
    var el, t, transitions;
    el = document.createElement('div');
    transitions = {
      'transition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
      'OTransition': 'otransitionend',
      'MozTransition': 'transitionend',
      'MsTransition': 'mstransitionend'
    };
    for (t in transitions) {
      if (transitions.hasOwnProperty(t) && el.style[t] !== void 0) {
        return transitions[t];
      }
    }
    return null;
  };
  animationEndEventName = function() {
    var a, animations, el;
    el = document.createElement('div');
    animations = {
      'animation': 'animationend',
      'WebkitAnimation': 'webkitAnimationEnd',
      'MozAnimation': 'animationend',
      'OAnimation': 'oAnimationEnd',
      'msAnimation': 'MSAnimationEnd'
    };
    for (a in animations) {
      if (animations.hasOwnProperty(a) && el.style[a] !== void 0) {
        return animations[a];
      }
    }
    return null;
  };
  evalInnerHtmlJavascript = function(elem) {
    var code, js, script, scripts, _i, _len;
    scripts = elem.querySelectorAll('script');
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      code = script.innerHTML;
      js = document.createElement('script');
      if (script.src !== '') {
        js.src = script.src;
      } else {
        js.text = code;
      }
      script.parentNode.replaceChild(js, script);
    }
    return true;
  };
  return self = {
    initialize: initialize,
    hasClass: hasClass,
    addClass: addClass,
    addClasses: addClasses,
    removeClass: removeClass,
    getCookie: getCookie,
    createElement: createElement,
    transitionEndEventName: transitionEndEventName,
    animationEndEventName: animationEndEventName,
    evalInnerHtmlJavascript: evalInnerHtmlJavascript
  };
});

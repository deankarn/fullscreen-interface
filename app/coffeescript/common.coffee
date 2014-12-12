define "common", [], () ->

    initialize = () ->
        true

    hasClass = (el, className) ->
        return new RegExp('(\\s|^)' + className + '(\\s|$)').test(el.className) ;

    addClass = (elem, className) ->
        elem.className = (elem.className + ' ' + className).trim() if not hasClass elem, className

    addClasses = (el, array) ->
        addClass el, ael for ael in array
        true

    removeClass = (elem, className) ->
        newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
        if hasClass elem, className
            while newClass.indexOf(' ' + className + ' ') >= 0
                newClass = newClass.replace(' ' + className + ' ', ' ')
            elem.className = newClass.replace(/^\s+|\s+$/g, '') ;
        true

    getCookie = (name) ->
        key = namr + '='
        ca = document.cookie.split(';') ;

        for c in ca
            if c.indexOf(key) == 0
                res = c.substring(key.length, c.length) ;

                return res;

        true

    createElement = (tag, opt) ->
        el = document.createElement(tag)

        if( opt )
            el.className = opt.cName if opt.cName
            el.innerHTML = opt.inner if opt.inner
            el.disabled = true if opt.disabled
            opt.appendTo.appendChild(el) if opt.appendTo

        el;

    transitionEndEventName = () ->
        el = document.createElement 'div'
        transitions = {
            'transition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd',
            'OTransition':'otransitionend',
            'MozTransition':'transitionend',
            'MsTransition':'mstransitionend'
        }

        for t of transitions
            if transitions.hasOwnProperty(t) && el.style[t] != undefined
                return transitions[t]
        return null

    animationEndEventName = () ->
        el = document.createElement 'div'

        animations = {
            'animation' : 'animationend',
            'WebkitAnimation' : 'webkitAnimationEnd',
            'MozAnimation':'animationend',
            'OAnimation' : 'oAnimationEnd',
            'msAnimation' : 'MSAnimationEnd',
        }

        for a of animations
            if animations.hasOwnProperty(a) && el.style[a] != undefined
                return animations[a]
        return null

    evalInnerHtmlJavascript = (elem) ->

        # scripts = elem.querySelectorAll('script[type="text/javascript"]')
        scripts = elem.querySelectorAll('script')
        # don't use getElementsByTagName, it's a live list and if the script is
        # removed the length property is updated
        # scripts = elem.getElementsByTagName('script')

        for script in scripts
            code = script.innerHTML
            js = document.createElement('script')
            if script.src != ''
                js.src = script.src
            else
                js.text = code

            script.parentNode.replaceChild js, script

        return true

    self = {
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
    } ;

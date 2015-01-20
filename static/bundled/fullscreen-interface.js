define("fullscreen-interface", ["common"], function(common) {

  /*
  		Data Attributes - on field list li tag
  		data-hide-continue - hides the continue button on this field, one of the controls on the screen triggers the continue,
  							 forcing an option to be selected and most likely used with data-input-trigger.
  		data-input-trigger - it tries to subscribe any elements such as a radio button group to fire the continue upon selection.
  		data-dependant     - indicates that this field is dependant upon a previous field in the list, affects whether the navdot are disabled or not.
  		data-validation-id - this is the id that the validation logic will try and match your validation rule.
  		data-skip          - this will indicate to skip to the next field as an option has negated the need for this field. Added from external code.
  		data-no-trigger    - this will disallow triggering upon ENTER to the next field.
   */
  var FullscreenInterface;
  return FullscreenInterface = (function() {
    'use strict';
    var animEndEventName, support;

    animEndEventName = common.animationEndEventName();

    support = {
      animations: animEndEventName === null ? false : true
    };

    function FullscreenInterface(el, options) {
      this.el = el;
      this.extend(this.options, options);
      this._init();
    }

    FullscreenInterface.prototype.extend = function(a, b) {
      var key;
      for (key in b) {
        if (b.hasOwnProperty(key)) {
          a[key] = b[key];
        }
      }
      return a;
    };

    FullscreenInterface.prototype.options = {
      triggerNextOnEnter: true,
      ctrlNavProgress: true,
      ctrlNavDots: true,
      ctrlNavNumbers: true,
      ctrlBackText: 'Back',
      ctrlNextText: 'Next',
      ctrlContinueText: 'Continue',
      ctrlContinueSubtext: 'or press ENTER',
      onBusy: null,
      onBusyComplete: null,
      onCompete: null,
      validators: {}
    };

    FullscreenInterface.prototype._init = function() {
      this.formEl = this.el.querySelector('.fi-inner-ct');
      this.fieldsList = this.formEl.querySelector('ol.fi-field-list');
      this.currentIdx = 0;
      this.fields = [].slice.call(this.fieldsList.children);
      this.fieldsCount = this.fields.length;
      this.currentField = this.fields[this.currentIdx];
      common.addClass(this.currentField, 'fi-current-field');
      this._registerControls();
      this._initEvents();
      this._focusOnCurrentFieldInput();
      return true;
    };

    FullscreenInterface.prototype._registerControls = function() {
      var dots, i, _i, _ref;
      this.ctrls = common.createElement('div', {
        cName: 'fi-controls',
        appendTo: this.el
      });
      this.ctrlContinue = common.createElement('button', {
        cName: 'fi-continue',
        inner: this.options.ctrlContinueText,
        appendTo: this.ctrls
      });
      this.ctrlContinue.setAttribute('data-subtext', this.options.ctrlContinueSubtext);
      if (!this.currentField.hasAttribute('data-hide-continue')) {
        this._showCtrl(this.ctrlContinue);
      }
      this.ctrlBack = common.createElement('button', {
        cName: 'fi-back',
        inner: this.options.ctrlBackText,
        appendTo: this.ctrls
      });
      this.ctrlNext = common.createElement('button', {
        cName: 'fi-next',
        inner: this.options.ctrlNextText,
        appendTo: this.ctrls
      });
      if (this.options.ctrlNavDots) {
        this.ctrlNav = common.createElement('nav', {
          cName: 'fi-nav-dots',
          appendTo: this.ctrls
        });
        dots = '';
        for (i = _i = 0, _ref = this.fieldsCount; _i < _ref; i = _i += 1) {
          dots += i === this.currentIdx ? '<button class="fi-dot-current"></button>' : '<button disabled></button>';
        }
        this.ctrlNav.innerHTML = dots;
        this._showCtrl(this.ctrlNav);
        this.ctrlNavDots = [].slice.call(this.ctrlNav.children);
        this.currentNavDot = this.ctrlNavDots[0];
      }
      if (this.options.ctrlNavNumbers) {
        this.ctrlNavNumberCt = common.createElement('span', {
          cName: 'fi-numbers',
          appendTo: this.ctrls
        });
        this.currentNavNumber = common.createElement('span', {
          cName: 'fi-number-current',
          inner: Number(this.currentIdx + 1),
          appendTo: this.ctrlNavNumberCt
        });
        this.totalNavNumber = common.createElement('span', {
          cName: 'fi-number-total',
          inner: this.fieldsCount,
          appendTo: this.ctrlNavNumberCt
        });
        if (this.fieldsCount > 9) {
          common.addClass(this.ctrlNavNumberCt, 'double-digits');
        }
        this._showCtrl(this.ctrlNavNumberCt);
      }
      if (this.options.ctrlNavProgress) {
        this.ctrlProgress = common.createElement('div', {
          cName: 'fi-progress',
          appendTo: this.ctrls
        });
        this._showCtrl(this.ctrlProgress);
      }
      this.msgError = common.createElement('span', {
        cName: 'fi-message-error',
        appendTo: this.el
      });
      this.msgSuccess = common.createElement('span', {
        cName: 'fi-message-success',
        appendTo: this.el
      });
      return true;
    };

    FullscreenInterface.prototype._showCtrl = function(ctrl) {
      common.addClass(ctrl, 'fi-show');
      return true;
    };

    FullscreenInterface.prototype._hideCtrl = function(ctrl) {
      common.removeClass(ctrl, 'fi-show');
      return true;
    };

    FullscreenInterface.prototype._initEvents = function() {
      var self;
      self = this;
      this.ctrlContinue.addEventListener('click', function(e) {
        self._nextField();
        return true;
      });
      if (this.options.ctrlNavDots) {
        this.ctrlNavDots.forEach(function(dot, pos) {
          dot.addEventListener('click', function(e) {
            self._showField(pos);
            return true;
          });
          return true;
        });
      }
      this.fields.forEach(function(fld) {
        var input, type;
        if (!fld.hasAttribute("data-input-trigger")) {
          return;
        }
        input = fld.querySelector('input') || fld.querySelector('select') || fld.querySelector('textarea');
        switch (input.tagName.toLowerCase()) {
          case 'select':
            input.addEventListener('change', function() {
              self._nextField();
              return true;
            });
            break;
          case "input":
            type = input.type.toLowerCase();
            switch (type) {
              case 'radio':
              case 'checkbox':
                [].slice.call(fld.querySelectorAll("input[type='" + type + "']")).forEach(function(inp) {
                  inp.addEventListener('change', function(ev) {
                    self._nextField();
                    return true;
                  });
                  return true;
                });
                break;
              case 'text':
              case 'password':
                input.addEventListener('change', function() {
                  self._nextField();
                  return true;
                });
                break;
              case 'button':
                input.addEventListener('click', function() {
                  self._nextField();
                  return true;
                });
            }
            break;
          case 'textarea':
            input.addEventListener('change', function() {
              self._nextField();
              return true;
            });
        }
        return true;
      });
      if (this.options.triggerNextOnEnter) {
        document.addEventListener('keydown', function(e) {
          var keyCode;
          if (!self.isLastStep && !(e.target.tagName.toLowerCase() === 'textarea') && !self.currentField.hasAttribute('data-no-trigger')) {
            keyCode = e.keyCode || e.which;
            if (keyCode === 13) {
              e.preventDefault();
              self._nextField();
              false;
            }
          }
          return true;
        });
      }
      return true;
    };

    FullscreenInterface.prototype._resetControlVisibility = function(show) {
      if (show) {
        if (this.options.ctrlNavDots) {
          this._showCtrl(this.ctrlNav);
        }
        if (this.options.ctrlNavProgress) {
          this._showCtrl(this.ctrlProgress);
        }
        if (this.options.ctrlNavNumbers) {
          this._showCtrl(this.ctrlNavNumberCt);
        }
      } else {
        this._hideCtrl(this.ctrlNav);
        this._hideCtrl(this.ctrlProgress);
        this._hideCtrl(this.ctrlNavNumberCt);
      }
      return void 0;
    };

    FullscreenInterface.prototype._nextField = function(pos) {
      var self;
      if (this.isBusy || this.isAnimating) {
        return;
      }
      this.isBusy = this.isAnimating = true;
      this.nextIdx = pos;
      this.isMovingBack = this.nextIdx !== void 0 && pos < this.fields.indexOf(this.currentField);
      this.isLastStep = this.currentIdx === this.fieldsCount - 1 && !this.isMovingBack ? true : false;
      if (this.nextIdx === void 0) {
        this.nextIdx = this.currentIdx + 1;
      }
      this._clearError();
      this._clearSuccess();
      self = this;
      this._validate(function(success) {
        var fld, i, innerself, newIdx, onEndAnimationFn, _i, _j, _ref, _ref1, _ref2;
        if (!success) {
          self.isBusy = self.isAnimating = false;
          return;
        }
        self._hideCtrl(self.ctrlBack);
        self._hideCtrl(self.ctrlNext);
        innerself = self;
        if (self.isLastStep) {
          self._resetControlVisibility(false);
          self._hideCtrl(self.ctrlContinue);
          common.removeClass(self.currentField, 'fi-current-field');
          if (self.options.onBusy) {
            self.options.onBusy();
          }
          if (self.options.onComplete) {
            self.options.onComplete(function(results, extra) {
              if (results.error) {
                if (extra) {
                  innerself.ctrlBack.onclick = extra;
                } else {
                  self.ctrlBack.onclick = function() {
                    innerself._nextField(0);
                    innerself._resetControlVisibility(true);
                    innerself._showCtrl(innerself.ctrlContinue);
                    return true;
                  };
                }
                innerself._showError(results.message);
                innerself._showCtrl(innerself.ctrlBack);
              } else {
                if (extra) {
                  innerself.ctrlNext.onclick = extra;
                }
                innerself._showSuccess(results.message);
                innerself._showCtrl(innerself.ctrlNext);
              }
              if (innerself.options.onBusyComplete) {
                innerself.options.onBusyComplete();
              }
              innerself.isBusy = innerself.isAnimating = false;
              return true;
            });
          }
          return true;
        } else {
          common.removeClass(self.currentField, 'fi-current-field');
          common.addClass(self.currentField, 'fi-hide');
          self.nextField = self.fields[self.nextIdx];
          if (self.nextField.hasAttribute('data-skip')) {
            newIdx = 0;
            if (self.isMovingBack) {
              for (i = _i = _ref = self.nextIdx; _i > -1; i = _i += -1) {
                fld = self.fields[i];
                if (fld.hasAttribute('data-skip')) {
                  continue;
                } else {
                  newIdx = i;
                  break;
                }
              }
            } else {
              newIdx = self.fieldsCount - 1;
              for (i = _j = _ref1 = self.nextIdx, _ref2 = self.fieldsCount; _j < _ref2; i = _j += 1) {
                fld = self.fields[i];
                if (fld.hasAttribute('data-skip')) {
                  continue;
                } else {
                  newIdx = i;
                  break;
                }
              }
            }
            self.nextIdx = newIdx;
            self.nextField = self.fields[self.nextIdx];
          }
          self.nextNavDot = self.ctrlNavDots[self.nextIdx];
          self._updateNav();
          self._updateFieldNumber();
          self._progress();
          common.addClasses(self.nextField, ['fi-current-field', 'fi-show']);
          self._focusOnNextFieldInput();
          if (self.nextField.hasAttribute('data-hide-continue')) {
            common.removeClass(self.ctrlContinue, 'fi-show');
          } else {
            common.addClass(self.ctrlContinue, 'fi-show');
          }
          if (self.isMovingBack) {
            self._resetControlVisibility(true);
            common.addClass(self.el, 'fi-show-prev');
          } else {
            common.addClass(self.el, 'fi-show-next');
          }
          onEndAnimationFn = function(e) {
            if (support.animations) {
              this.removeEventListener(animEndEventName, onEndAnimationFn);
            }
            common.removeClass(innerself.currentField, 'fi-hide');
            common.removeClass(innerself.nextField, 'fi-show');
            if (innerself.isMovingBack) {
              common.removeClass(innerself.el, 'fi-show-prev');
            } else {
              common.removeClass(innerself.el, 'fi-show-next');
            }
            if (innerself.options.ctrlNavNumbers) {
              innerself.currentNavNumber.innerHTML = innerself.nextNavNumber.innerHTML;
              innerself.ctrlNavNumberCt.removeChild(innerself.nextNavNumber);
            }
            innerself.currentIdx = innerself.nextIdx;
            innerself.currentField = innerself.nextField;
            innerself.currentNavDot = innerself.nextNavDot;
            innerself.isBusy = innerself.isAnimating = false;
            return true;
          };
          window.scrollTo(0, 0);
          if (support.animations) {
            self.nextField.addEventListener(animEndEventName, onEndAnimationFn);
          } else {
            onEndAnimationFn();
          }
          return true;
        }
      });
      return true;
    };

    FullscreenInterface.prototype._focusOnCurrentFieldInput = function(el) {
      this._focusOnFieldInput(this.currentField, el);
      return true;
    };

    FullscreenInterface.prototype._focusOnNextFieldInput = function(el) {
      this._focusOnFieldInput(this.nextField, el);
      return true;
    };

    FullscreenInterface.prototype._focusOnFieldInput = function(fld, el) {
      var type;
      if (el === void 0) {
        el = fld.querySelector('input[type="text"]') || fld.querySelector('input[type="password"]') || fld.querySelector('input[type="radio"]') || fld.querySelector('input[type="checkbox"]') || fld.querySelector('select') || fld.querySelector('textarea');
      }
      if (!el) {
        return;
      }
      switch (el.tagName.toLowerCase()) {
        case 'select':
          el.focus();
          break;
        case "input":
          type = el.type.toLowerCase();
          switch (type) {
            case 'radio':
            case 'checkbox':
            case 'button':
              el.focus();
              break;
            case 'text':
            case 'password':
              el.select();
          }
          break;
        case 'textarea':
          el.select();
      }
      return true;
    };

    FullscreenInterface.prototype._showField = function(pos) {
      if (pos === this.current || pos < 0 || pos > this.fieldsCount - 1) {
        return false;
      }
      this._nextField(pos);
      return true;
    };

    FullscreenInterface.prototype._updateFieldNumber = function() {
      if (this.options.ctrlNavNumbers) {
        this.nextNavNumber = document.createElement('span');
        this.nextNavNumber.className = 'fi-number-new';
        this.nextNavNumber.innerHTML = Number(this.nextIdx + 1);
        this.ctrlNavNumberCt.appendChild(this.nextNavNumber);
      }
      return true;
    };

    FullscreenInterface.prototype._progress = function() {
      if (this.options.ctrlNavProgress) {
        this.ctrlProgress.style.width = this.nextIdx * (100 / this.fieldsCount) + '%';
      }
      return true;
    };

    FullscreenInterface.prototype._updateNav = function() {
      var i, lastDataDependantIdx, _i, _j, _ref, _ref1, _ref2;
      if (this.options.ctrlNavDots) {
        common.removeClass(this.currentNavDot, 'fi-dot-current');
        common.addClass(this.nextNavDot, 'fi-dot-current');
        this.nextNavDot.disabled = false;
        lastDataDependantIdx = void 0;
        if (this.isMovingBack) {
          for (i = _i = _ref = this.fieldsCount - 1, _ref1 = this.nextIdx; _i > _ref1; i = _i += -1) {
            if (this.fields[i].hasAttribute('data-dependant')) {
              lastDataDependantIdx = i;
            }
          }
          if (lastDataDependantIdx !== void 0) {
            for (i = _j = _ref2 = this.fieldsCount - 1; _j > lastDataDependantIdx; i = _j += -1) {
              this.ctrlNavDots[i].disabled = true;
            }
          }
        }
      }
      return true;
    };

    FullscreenInterface.prototype._showCtrl = function(ctrl) {
      if (ctrl != null) {
        common.addClass(ctrl, 'fi-show');
      }
      return true;
    };

    FullscreenInterface.prototype._hideCtrl = function(ctrl) {
      if (ctrl != null) {
        common.removeClass(ctrl, 'fi-show');
      }
      return true;
    };

    FullscreenInterface.prototype._validate = function(callback) {
      var id, results, self, validator;
      if (!this.currentField || this.currentField === void 0) {
        callback(false);
        return false;
      }
      if (this.isMovingBack) {
        callback(true);
        return true;
      }
      id = this.currentField.getAttribute("data-validation-id");
      if (!id || id === void 0) {
        callback(true);
        return true;
      }
      validator = this.options.validators[id];
      if (validator === void 0) {
        this._showError('Field contains a validation ID but no validator was passed to the form!!!');
        callback(false);
        return false;
      }
      self = this;
      results = validator(this.currentField, function(results) {
        if (results.error) {
          self._showError(results.message);
          callback(false);
          self._focusOnCurrentFieldInput();
          return false;
        } else {
          callback(true);
          return true;
        }
      });
      return true;
    };

    FullscreenInterface.prototype._showSuccess = function(message) {
      this.msgSuccess.innerHTML = message;
      common.evalInnerHtmlJavascript(this.msgSuccess);
      this._showCtrl(this.msgSuccess);
      return true;
    };

    FullscreenInterface.prototype._showError = function(message) {
      this.msgError.innerHTML = message;
      common.evalInnerHtmlJavascript(this.msgError);
      this._showCtrl(this.msgError);
      return true;
    };

    FullscreenInterface.prototype._clearError = function() {
      this._hideCtrl(this.msgError);
      return true;
    };

    FullscreenInterface.prototype._clearSuccess = function() {
      this._hideCtrl(this.msgSuccess);
      return true;
    };

    return FullscreenInterface;

  })();
});

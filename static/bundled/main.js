define("main", ["fullscreen-interface"], function(fi) {
  var form, initialize, self, _completeForm, _initializeFullscreenForm, _nextScreen, _validateFirstName;
  form = null;
  initialize = function() {
    _initializeFullscreenForm();
    return true;
  };
  _nextScreen = function() {
    return alert('move to next screen');
  };
  true;
  _completeForm = function(callback) {
    var btn, data, results, thereWasAValidEndpoint, url, xhr;
    results = {};
    thereWasAValidEndpoint = false;
    if (thereWasAValidEndpoint) {
      form = document.getElementById('my-form');
      url = form.action;
      data = new FormData(form);
      xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        var json;
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            json = JSON.parse(xhr.responseText);
            results.error = json.error;
            results.message = json.message;
          } else {
            results.error = true;
            results.message = xhr.responseText;
          }
          if (results.error) {
            return callback(results);
          } else {
            return callback(results, _nextScreen);
          }
        }
      };
      xhr.open('POST', url, true);
      xhr.send(data);
    } else {
      results.error = false;
      results.message = '<span>Successfully Added User<button id="my-button">Back</button></span>';
    }
    callback(results, _nextScreen);
    btn = document.getElementById('my-button');
    btn.onclick = function(e) {
      e.preventDefault();
      form._nextField(0);
      return true;
    };
    return true;
  };
  _validateFirstName = function(li, callback) {
    var fname, results, val;
    results = {};
    fname = document.getElementById('fname');
    val = fname.value;
    if ((val != null) && val.length > 0) {
      results.error = false;
    } else {
      results.error = true;
      results.message = 'First Name is Required';
    }
    callback(results);
    return true;
  };
  _initializeFullscreenForm = function() {
    var ct, rules;
    ct = document.getElementById('main-ct');
    rules = {
      "fname": _validateFirstName
    };
    form = new fi(ct, {
      onComplete: _completeForm,
      validators: rules
    });
    return true;
  };
  initialize();
  return self = {};
});

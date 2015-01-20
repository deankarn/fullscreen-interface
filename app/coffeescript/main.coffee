define "main", ["fullscreen-interface"], (fi) ->

	form = null

	initialize = () ->
		_initializeFullscreenForm()
		true

	_nextScreen = () ->
		# url = '/dashboard'
		# window.location.replace url
        alert 'move to next screen'
		true

	_completeForm = (callback) ->

		results = {}

		thereWasAValidEndpoint = false

		if thereWasAValidEndpoint
			form = document.getElementById 'my-form'
			url = form.action
			data = new FormData form
			xhr = new XMLHttpRequest()

			xhr.onreadystatechange = () ->
				if xhr.readyState == 4
					if xhr.status == 200
						json = JSON.parse xhr.responseText

						results.error = json.error
						results.message = json.message
					else
						results.error = true
						results.message = xhr.responseText

					if results.error
						# we could pass a function back here that would, for example
						# take you to a specific field because of the error.....
						callback results
					else
						callback results, _nextScreen

			xhr.open 'POST', url, true
			xhr.send data
		else
            results.error = false
			# NOTE: This does not have to be HTML
            results.message = '<span>Successfully Added User<button id="my-button">Back</button></span>'
			callback results, _nextScreen
			btn = document.getElementById 'my-button'
			btn.onclick = (e) ->
				e.preventDefault()
				form._nextField 0
				true
		true

	_validateFirstName = (li, callback) ->

		results = {}
		fname = document.getElementById 'fname'
		val = fname.value

		if val? and val.length > 0
			results.error = false
		else
			results.error = true
			results.message = 'First Name is Required'

		callback results

		true

	_initializeFullscreenForm = () ->
		ct = document.getElementById 'main-ct'

		rules = {
			"fname": _validateFirstName
		}

		form = new fi ct,
		{
			triggerNextOnEnter : false,
			onComplete: _completeForm,
			validators: rules
		}
		true

	initialize()

	self = {
		# initialize: initialize
	}

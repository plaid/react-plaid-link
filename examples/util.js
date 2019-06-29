'use strict';

// Makes a basic AJAX request with the given options
var makeRequest = function(options) {
  var defaultOptions = {
    contentType: 'application/json',
    method: 'post',
    onTimeout: function() {},
    onError: function() {},
    onLoad: function() {},
    parameters: {},
    url: '',
  };
  var requestOptions = Object.assign({}, defaultOptions, options);
  var request = new XMLHttpRequest();
  request.open(requestOptions.method, requestOptions.url);
  request.setRequestHeader('Content-Type', requestOptions.contentType);
  request.send(JSON.stringify(requestOptions.parameters));
  request.onreadystatechange = function(event) {
    void event;
    if (request.readyState === XMLHttpRequest.DONE) {
      var responseBody;
      try {
        responseBody = JSON.parse(request.responseText);
      } catch (err) {
        responseBody = {};
      }
      var status = request.status;
      if (status < 500) {
        requestOptions.onLoad(status, responseBody);
      } else {
        requestOptions.onError(status, {});
      }
    }
  };
  return request;
};

export default makeRequest;

'use strict';

let changeColor = document.getElementById('fetchBtn');

changeColor.onclick = function(element) {
  var message = {};
  message.type = "runContentScript";
  chrome.runtime.sendMessage(message);
};

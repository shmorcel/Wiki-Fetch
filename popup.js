'use strict';

let changeColor = document.getElementById('fetchBtn');

changeColor.onclick = function(element) {
  chrome.storage.local.set({'fetch_flag': true});
  chrome.storage.local.set({'count': 0});
  chrome.storage.local.set({'links': []});
  chrome.storage.local.set({'num_of_pages': 3});
  setTimeout(function(){chrome.tabs.reload()}, 500);
};

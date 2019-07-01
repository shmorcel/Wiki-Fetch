'use strict';

var fetchBtn = document.getElementById('fetchBtn');
var numOfPagesTxt = document.getElementById('numOfPagesTxt');

// logic for enabling the fetch button
numOfPagesTxt.onkeyup = function() {
  if (this.value == "" || parseInt(this.value) < 1)
    document.getElementById('fetchBtn').disabled = true;
  else
    document.getElementById('fetchBtn').disabled = false  
}
// logic for enabling the fetch button
numOfPagesTxt.onchange = function() {
  if (this.value == "" || parseInt(this.value) < 1)
    document.getElementById('fetchBtn').disabled = true;
  else
    document.getElementById('fetchBtn').disabled = false  
}

// event to initialize the fetch process 
fetchBtn.onclick = function(element) {
  chrome.storage.local.set({'fetch_flag': true}, function (){
    chrome.storage.local.set({'num_of_pages': document.getElementById('numOfPagesTxt').value}, function (){
      chrome.storage.local.set({'count': 0}, function(){
        chrome.storage.local.set({'links': ["init-link-to-be-removed"]}, function() {
          chrome.tabs.reload()
        });
      });
    });
  });
};

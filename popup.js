'use strict';

var fetchBtn = document.getElementById('fetchBtn');
var numOfPagesTxt = document.getElementById('numOfPagesTxt');

numOfPagesTxt.onkeyup = function() {
  if (this.value == "")
    document.getElementById('fetchBtn').disabled = true;
  else
    document.getElementById('fetchBtn').disabled = false  
}

fetchBtn.onclick = function(element) {
  chrome.storage.local.set({'fetch_flag': true}, function (){
    chrome.storage.local.set({'num_of_pages': document.getElementById('numOfPagesTxt').value}, function (){
      chrome.storage.local.set({'count': 0});
      chrome.storage.local.set({'links': []});
      chrome.tabs.reload()
    });
  });
};

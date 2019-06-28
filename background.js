'use strict';

chrome.runtime.onInstalled.addListener(function() {
  // chrome.storage.local.set({remove_number: false}, undefined);
  chrome.storage.local.set({'count': 0});
  chrome.storage.local.set({'links': []});
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { urlMatches: 'wikipedia\.org\/wiki\/*'}, //[^(?:Main_Page)]' },
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.runtime.onMessage.addListener(
  function(message, callback) {
    if (message.type == "runContentScript"){
      chrome.storage.local.set({'count': 0});
      chrome.storage.local.set({'links': []});
      chrome.tabs.executeScript({
        file: 'contentScript.js'
      });
    } else if (message.type == "download") {
      var blob = new Blob([message.body], {type: "text/plain"});
      var url = URL.createObjectURL(blob);
      // download the blob as a text file into Downloads
      chrome.downloads.download({
        url: url, // The object URL can be used as download URL
        filename: message.title + ".txt" 
      });
    } else if (message.type == "update_tab") {
      var number_of_pages = 10;
      chrome.storage.local.get(['count'], function(result) {
        var count = result.count;
        if (count < number_of_pages) {
          chrome.storage.local.get(['links'], function(result) {
            setTimeout(function(){
              chrome.tabs.update({url: result.links[count]})
            }, 1000);
            setTimeout(function(){
              chrome.tabs.executeScript({
                file: 'contentScript.js'
              });
            }, 2000);
          });
        }
        chrome.storage.local.set({'count': count + 1});
      });
    }
  }
);

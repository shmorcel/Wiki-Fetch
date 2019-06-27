'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({'remove_number': false}, undefined);
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
      console.log("Content script initiated.");
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
    }
  }
);

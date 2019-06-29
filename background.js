'use strict';

chrome.runtime.onInstalled.addListener(function() {
  // chrome.storage.local.set({remove_number: false}, undefined);
  chrome.storage.local.set({'count': 0});
  chrome.storage.local.set({'num_of_pages': 10});
  chrome.storage.local.set({'links': []});
  chrome.storage.local.set({'fetch_flag': false});
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
    if (message.type == "download") {
      var output = message.body;
      var blob = new Blob([output], {type: "text/plain;charset=utf-8"});
      var url = URL.createObjectURL(blob);
      // download the blob as a text file into Downloads
      chrome.downloads.download({
        url: url, // The object URL can be used as download URL
        filename: message.title + ".txt" 
      });
    } else if (message.type == "update_tab") {
      chrome.storage.local.get(['num_of_pages'], function(result) {
        var num_of_pages = result.num_of_pages;
        chrome.storage.local.get(['count'], function(result) {
          var count = result.count;
          if (count < (num_of_pages - 1)) { // if the number of pages wasn't reached yet
            chrome.storage.local.get(['links'], function(result) {
              chrome.tabs.update({url: result.links[count]})
            });
          } else { // stop traversing through the pages
            chrome.storage.local.set({'fetch_flag': false});
          }
          chrome.storage.local.set({'count': count + 1});
        });
      });
    }
  }
);

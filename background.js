'use strict';

// when the extension is installed...
chrome.runtime.onInstalled.addListener(function() {
  // add rule to enabled the page action button for wikipedia pages only
  chrome.storage.local.set({'traversal': 'BFS'});
  console.log("Traversal is BFS.");
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

// event handlers for message passing (from context files)
chrome.runtime.onMessage.addListener(
  function(message, callback) {
    if (message.type == "download") {
      // build the text file from the message
      var output = message.body;
      var blob = new Blob([output], {type: "text/plain;charset=utf-8"});
      var url = URL.createObjectURL(blob);
      // download the blob as a text file into Downloads
      chrome.downloads.download({
        url: url, // the url of the blob
        filename: message.title + ".txt" 
      });
    } else if (message.type == "update_tab") {
      // go to another wikipedia page
      chrome.storage.local.get(['num_of_pages'], function(result) {
        var num_of_pages = result.num_of_pages;
        chrome.storage.local.get(['count'], function(result) {
          var count = result.count;
          if (count < (num_of_pages - 1)) { // if the number of pages wasn't reached yet
            chrome.storage.local.get(['links'], function(result) {
              //chrome.tabs.update({url: result.links[count]})
              chrome.tabs.update({url: result.links[0]})
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

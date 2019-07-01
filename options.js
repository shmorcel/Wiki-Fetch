'use strict';

var BFSRad = document.getElementById('BFSRad');
var DFSRad = document.getElementById('DFSRad');

// events to update options 
BFSRad.onclick = function(element) {
  chrome.storage.local.set({'traversal': 'BFS'}, function (){alert("BFS traversal is set.")});
};
DFSRad.onclick = function(element) {
  chrome.storage.local.set({'traversal': 'DFS'}, function (){alert("DFS traversal is set.")});
};

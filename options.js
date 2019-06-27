'use strict';

// needs some tweeking before it can work.
// don't forget to enable the options in the manifest.

let page = document.getElementById('buttonDiv');
var label = document.getElementById('labelId');

function constructOptions() {
  var numbersRemovalCheckBox = document.createElement('input');
  numbersRemovalCheckBox.type = 'checkbox';
  numbersRemovalCheckBox.id = 'button_removal';
  // update the checkbox state from the storage
  chrome.storage.sync.get('remove_number', function(data) {
    numbersRemovalCheckBox.checked = data;
    if (data.key == true){
      label.innerHTML = "Number removal enabled.";
    } else {
      label.innerHTML = "Number removal disabled.";
    }
  });
  numbersRemovalCheckBox.addEventListener('change', function() {
    var old_value = true;
    // grab the old value from the storage
    chrome.storage.sync.get('remove_number', function(data) {
      old_value = data.value;
      alert("value:");
      alert(old_value);
    });
    chrome.storage.sync.set({'remove_number': !old_value}, function() { 
      alert(!old_value);
      if(!old_value == true) { // new value is true
        label.innerHTML = "Number removal enabled.";
      } else {
        label.innerHTML = "Number removal disabled.";
      }
    });
  });
  page.appendChild(numbersRemovalCheckBox);
}
constructOptions();

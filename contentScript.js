prepare_text = function (text) {
  // check if the length is good enough
  var passes = (text.length > 1);
  if (!passes) {
    return null;
  }
  // process the text before returning it
    // remove the citations
    var citation_finder = /\[\d*\]/g;
    text = text.replace(citation_finder, "");
    // the range removal has to happen before the number removal
    var range_finder = /([\d*].[\d*]|[\d*])–([\d*].[\d*]|[\d*])/g;
    text = text.replace(range_finder, "");
    var number_finder = /([\d*].[\d*]|[\d*])/g;
    text = text.replace(number_finder, "");
    var percentage_finder = /%/g;
    text = text.replace(percentage_finder, "");
  //return the processed text
  return text;
}

prepare_title = function (text){
  // process the text before returning it
  var post_fix_finder = /\s-\sWikipedia/g
  text = text.replace(post_fix_finder, "_wikipedia");
  var space_finder = /\s{1,}/g;
  text = text.replace(space_finder, "_");
  //return the processed text
  return text;
}

var textContentBody = document.getElementsByClassName("mw-parser-output")[0];
var textTitle = document.title;
textTitle = prepare_title(textTitle);
var children = textContentBody.children;
var whole_text = ""
for (i = 0; i < children.length; i++) {
  // make sure it's not a title for External Links
  if (i+1 < children.length && children[i+1].tagName == "UL" && children[i].children[0].tagName == "B") {
    continue;
  };
  var show = 0;
  // it's a Paragraph
  if (children[i].tagName == "P" && children[i].className != "mw-empty-elt") {
    child = children[i];
    show = 1;
  }
  // it's a Paragraph in a block-quote
  if (children[i].tagName == "BLOCKQUOTE") {
    child = children[i].children[0];  
    show = 1;
  }
  if (show == 1) {
    var text = children[i].innerText || children[i].textContent;
    text_to_append = prepare_text(text);
    if (text_to_append != null)
      whole_text += text_to_append;
      whole_text += "\n";
  }
}
var message = {};
message.type = "download";
message.body = whole_text;
message.title = textTitle;
chrome.runtime.sendMessage(message);


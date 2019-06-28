deaccentuate = function(text){
  // codepage 1252 or "Latin 1 Windows" to ASCII
  var A_finder = /[ÀÁÂÃÄÅ]/g;
  text = text.replace(A_finder, 'A'); 
  var C_finder = /Ç/g; 
  text = text.replace(C_finder, 'C'); 
  var E_finder = /[ÈÉÊË]/g;
  text = text.replace(E_finder, 'E'); 
  var I_finder = /[ÌÍÎÏ]/g;
  text = text.replace(I_finder, 'I'); 
  var N_finder = /Ñ/g;
  text = text.replace(N_finder, 'N'); 
  var O_finder = /[ÒÓÔÕÖØ]/g; 
  text = text.replace(O_finder, 'O'); 
  var U_finder = /[ÙÚÛÜ]/g;
  text = text.replace(U_finder, 'U'); 
  var Y_finder = /[ÝŸ]/g;
  text = text.replace(Y_finder, 'Y'); 

  var D_finder = /Ð/g; 
  text = text.replace(D_finder, 'D'); 

  var a_finder = /[ªàáâãäå]/g; 
  text = text.replace(a_finder, 'a'); 
  var c_finder = /ç/g;
  text = text.replace(c_finder, 'c'); 
  var e_finder = /[èéêë]/g;
  text = text.replace(e_finder, 'e'); 
  var i_finder = /[ìíîï]/g;
  text = text.replace(i_finder, 'i'); 
  var n_finder = /ñ/g;
  text = text.replace(n_finder, 'n'); 
  var o_finder = /[ºòóôõöø]/g;
  text = text.replace(o_finder, 'o'); 
  var u_finder = /[ùúûü]/g;
  text = text.replace(u_finder, 'u'); 
  var y_finder = /[ýÿ]/g;
  text = text.replace(y_finder, 'u'); 

  var f_finder = /ƒ/g;
  text = text.replace(f_finder, "f");
  var S_finder = /Š/g; 
  text = text.replace(S_finder, "S");
  var Z_finder = /Ž/g;
  text = text.replace(Z_finder, "Z"); 
  var s_finder = /[ßš]/g; 
  text = text.replace(s_finder, 's'); 
  var z_finder = /ž/g; 
  text = text.replace(z_finder, 'z'); 
  
  var Ae_finder = /Æ/g;
  text = text.replace(Ae_finder, 'Ae'); 
  var ae_finder = /æ/g;
  text = text.replace(ae_finder, 'ae'); 
  var Oe_finder = /Œ/g;
  text = text.replace(Oe_finder, "Oe");
  var oe_finder = /œ/g;
  text = text.replace(oe_finder, 'oe'); 

  var no_break_space_finder = /\u00A0/g; // No-break Space
  text = text.replace(no_break_space_finder, ' '); 
  var question_mark_finder = /¿/g;
  text = text.replace(question_mark_finder, '?'); 
  var exclamation_mark_finder = /¡/g; 
  text = text.replace(exclamation_mark_finder, '!'); 
  var en_dash_finder = /–/g;
  text = text.replace(en_dash_finder, '--'); 
  var em_dash_finder = /—/g;
  text = text.replace(em_dash_finder, '---'); 
  var single_quotations_finder = /[‘’]/g;
  text = text.replace(single_quotations_finder, "'"); 
  var double_quotations_finder = /[“”]/g; 
  text = text.replace(double_quotations_finder, '"'); 
  var ellipsis_finder = /…/g;
  text = text.replace(ellipsis_finder, "...");

  //return the processed text
  return text;
}

prepare_text = function (text) {
  // process the text before returning it
    // convert characters to their ASCII counterpart from ANSI
    text = deaccentuate(text);

    // to remove code parts and artifacts
    var curly_brakets_finder = /{.*}/g;
    text = text.replace(curly_brakets_finder, "");

    // remove the citations
    var citation_finder = /\[\d*\]/g;
    text = text.replace(citation_finder, "");

    // remove numbers
    var range_finder = /(\d+(\.|,)\d+|\d+)(\-+)(\d+(\.|,)\d+|\d+)/g;
    text = text.replace(range_finder, "");
      // the range removal has to happen before the number removal
    var number_finder = /(\d+(\.|,)\d+|\d+)/g;
    text = text.replace(number_finder, "");

    // final filter (what needs to show)
    var anything_else_finder = /[^a-zA-Z(),.;:"'?!\s]+/g;
    text = text.replace(anything_else_finder, "");

    // moving to one byte... when written in UTF-8
      // remove non-ASCII characters
    var non_ASCII_representable_finder = /[^\x00-\x7F]/g;
    text = text.replace(non_ASCII_representable_finder, "");

  // check if the length is good enough
  var passes = (text.length > 5);
  if (!passes) {
    return null;
  }
  //return the processed text
  return text;
}

prepare_title = function (text){
  // process the text before returning it
    // convert characters to their ASCII counterpart from ANSI
    text = deaccentuate(text);

    var post_fix_finder = /\s-\sWikipedia/g
    text = text.replace(post_fix_finder, "_wikipedia");

    var space_finder = /\s{1,}/g;
    text = text.replace(space_finder, "_");

    // remove some unwanted characters
    var file_name_to_avoid_characters_finder = /[/\\:*?"<>|]/g;
    text = text.replace(file_name_to_avoid_characters_finder, "");

    // moving to one byte... when written in UTF-8
    var non_ASCII_representable_finder = /[^\x00-\x7F]/g;
    text = text.replace(non_ASCII_representable_finder, "");

  //return the processed text
  return text;
}

grab_page = function () {
  var textContentBody = document.getElementsByClassName("mw-parser-output")[0];
  var textTitle = document.title;
  textTitle = prepare_title(textTitle);
  var children = textContentBody.children;
  var whole_text = ""
  var i = 0
  for (i = 0; i < children.length; i++) {
    // make sure it's not a title for External Links
    if (i+1 < children.length && 
      children[i+1].tagName == "UL" && 
      children[i].children[0] != undefined && 
      children[i].children.length == 1 && 
      children[i].children[0].tagName == "B") {
      continue;
    }
    // make sure it's not a paragraph with a span inside (for math equations and all)
    if (children[i].tagName == "P" && children[i].querySelectorAll("span").length > 0)
      continue;
    
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
}

get_link_from_current_page = function (){
  var textContentBody = document.getElementsByClassName("mw-parser-output")[0];
  var paragraphs = textContentBody.querySelectorAll("p");
  var links = [];
  for (i = 0; i < paragraphs.length; i++){
    for (k = 0; k < paragraphs[i].children.length; k++){
      if (paragraphs[i].children[k].tagName == "A")
        links.push(paragraphs[i].children[k].href);
    }
  }
  return links;
}

main_script = function () {
  var time_interval = 1000;
  setTimeout(function(){ grab_page() }, time_interval);
  setTimeout(function(){ 
    var links = get_link_from_current_page();
    chrome.storage.local.get(['links'], function(result) {
      chrome.storage.local.set({'links': result.links.concat(links)});
    });
    message = {};
    message.type = "update_tab";
    chrome.runtime.sendMessage(message);
  }, 2 * time_interval);
}
main_script();

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
  // get all the text from the page's body.
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
    
    var grab = 0; // a flag to signal inclusion
    // it's a Paragraph
    if (children[i].tagName == "P" && children[i].className != "mw-empty-elt") {
      child = children[i];
      grab = 1;
    }
    // it's a Paragraph in a block-quote
    if (children[i].tagName == "BLOCKQUOTE") {
      child = children[i].children[0];  
      grab = 1;
    }
    if (grab == 1) { // we grab the text inside
      var text = children[i].innerText || children[i].textContent;
      text_to_append = prepare_text(text);
      if (text_to_append != null) {
        whole_text += text_to_append;
        whole_text += "\n";
        // or whole_text += String.fromCharCode(10).concat(String.fromCharCode(13)); 
        // linefeed and carriage return
      }
    }
  }
  // download the extracted text-body
  var message = {};
  message.type = "download";
  message.body = whole_text;
  message.title = textTitle;
  chrome.runtime.sendMessage(message);
}

get_link_from_current_page = function (){
  // get all the links from the page's body.
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

update_tab = function (){
  var message = {};
  message.type = "update_tab";
  chrome.runtime.sendMessage(message);
}

main_script = function () {
  // the main function of the injected code.
  chrome.storage.local.get(['fetch_flag'], function(result) { 
    if (result.fetch_flag == true){
      // if the Fetch! button is pressed
      var time_interval = 1000;
      grab_page();
      chrome.storage.local.get(['num_of_pages'], function(result) {
        var num_of_pages = result.num_of_pages;
        chrome.storage.local.get(['count'], function(result) { 
          var count = result.count;
          chrome.storage.local.get(['traversal'], function(result) {
            var traversal = result.traversal;
            chrome.storage.local.get(['links'], function(result) { 
              if (traversal == 'BFS'){
                var new_list = result.links;
                if (count + result.links.length < num_of_pages + 5) 
                  /* the plus 1 is a padding for safety (the logic is tiresome) */{ 
                  // if the number of links is smaller than will ever be needed then add new links
                  var links = get_link_from_current_page();
                  new_list = result.links.concat(links);
                }
                new_list.splice(0,1);
                chrome.storage.local.set({'links': new_list}, function(){
                  // change the url to the next one scheduled
                  update_tab();
                }); 
              } else if (traversal == 'DFS'){ 
                // assumption: no stubs will be met. 
                var links = get_link_from_current_page();
                var new_list = links.splice(0,1); // DFS
                chrome.storage.local.set({'links': new_list}, function(){
                  // change the url to the next one scheduled
                  update_tab();
                });
              }
            });
          });
        });
      });
    }
  });
}
// run the script
main_script();

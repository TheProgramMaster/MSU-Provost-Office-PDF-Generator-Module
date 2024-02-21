//jshint esversion:8

const PDFDocument = require('pdfkit');
let doc = new PDFDocument({});

doc.registerFont("Heading", "./fonts/FreightSansBold.otf");
doc.registerFont("Emphasize", "./fonts/FreightSansMedium.otf");
doc.registerFont("Body", "./fonts/FreightSansBook.ttf");
doc.registerFont("Italic", "./fonts/FreightTextBoldItalic.otf");

// module.exports.htmlToPDFKit = htmlToPDFKit;
module.exports.processHTMLString = processHTMLString;


function processHTMLString(htmlString) {
  htmlString = htmlString.replace(/&nbsp;/g, ' ');
  htmlString = htmlString.replace(/(?=<span)(.*?)(?:>)/g, '');
  htmlString = htmlString.replace(/<\/span>/g, '');
  htmlString = htmlString.replace(/&amp;/g, '&');
  htmlString = htmlString.replace(/\<p\>\<br\>\<\/p\>/g, '<p> </p>');
  htmlString = htmlString.replace(/\<li class="ql-indent-1">/g, '<li>');

  let linesObjArray = [];

  for(let i = 0; i < htmlString.length; ) {

    //start a new line object
    let h = htmlString.indexOf("<", i);
    if(h < 0) {
      h = 0;
    }

    let lineTag = getOpeningTag(htmlString, i);
    let lineString = getLineString(htmlString, lineTag, i);

    //Handling ordered list
    if(lineTag === "ol") {
      let listCount = lineString.split("<li>").length;

      for(let j = 0; j < lineString.length; ) {
        for(let listCounter = 1; listCounter < listCount; listCounter++) {
          let listString = getLineString(lineString, "li", j);
          let listObj = {};

            //Handling plain lines
          if(listString.indexOf("<") < 0){

            listObj[lineTag+"_"] = `${listCounter}.\t ${listString}`;
            listObj["last_" + j] = "";
            linesObjArray.push(listObj);

            j = getNextLinePos(lineString, "li", j);

            if(j < 0) {
                j = listString.length;
              }
            continue;
          }

          // Handling lines with additional tags, i.e. em, strong, u.
          let k = 0;
          let firstText = listString.substring(k, listString.indexOf("<"));
          listObj[lineTag + "_"] = `${listCounter}.\t ${firstText}`;
          k = listString.indexOf("<");
          do {
            let key = getOpeningTag(listString, k);
            let value = getInnerText(listString, k);
            listObj[key + "_" + k] = value;

            k = nextTag(listString, k);

            if(k < 0) {
              k = listString.length;
            }

            if(listString[k + 1] === "/") {
              k = listString.indexOf(">", k) + 1;
              //is this the last inside tag?
              let nextInsideTag = listString.indexOf("<", k);
              if(nextInsideTag > 0) {
                value = listString.substring(k, listString.indexOf("<", k));
                listObj["inBetweenText_" + k] = value;
                k = listString.indexOf("<", k);

              } else {
                k = listString.length;
              }
              continue;
            }
          }
          while(k < listString.length);

          let from = listString.lastIndexOf(">") + 1;
          let to = listString.length;
          let lastText = listString.substr(from, to);
          listObj["last_"] = lastText;

          linesObjArray.push(listObj);

          j = getNextLinePos(lineString, "li", j);

          if(j < 0) {
            j = listString.length;
          }
        }
      }

      if(getNextLinePos(htmlString, lineTag, i)) {
        i = getNextLinePos(htmlString, lineTag, i);
      } else {
        i = htmlString.length;
      }
      continue;
    }

    //Handling unordered list
    if(lineTag === "ul") {
      for(let j = 0; j < lineString.length; ) {
        let listString = getLineString(lineString, "li", j);
        let listObj = {};

        //Handling plain lines
        if(listString.indexOf("<") < 0){
          listObj[lineTag+"_"] = listString;
          listObj["last_"] = "";
          linesObjArray.push(listObj);

          j = getNextLinePos(lineString, "li", j);

          if(j < 0) {
              j = listString.length;
            }
          continue;
        }

        // Handling lines with additional tags, i.e. em, strong, u.
        let k = 0;
        let firstText = listString.substring(k, listString.indexOf("<"));
        listObj[lineTag+"_"] = firstText;
        k = listString.indexOf("<");
        do {
          let key = getOpeningTag(listString, k);
          let value = getInnerText(listString, k);
          listObj[key+"_"+k] = value;

          k = nextTag(listString, k);

          if(k < 0) {
            k = listString.length;
          }

          if(listString[k + 1] === "/") {
            k = listString.indexOf(">", k) + 1;
            //is this the last inside tag?
            let nextInsideTag1 = listString.indexOf("<", k);
            if(nextInsideTag1 > 0) {
              value = listString.substring(k, listString.indexOf("<", k));
              listObj["inBetweenText_" + k] = value;
              k = listString.indexOf("<", k);

            } else {
              k = listString.length;
            }
            continue;
          }
        }
        while(k < listString.length);

        let from = listString.lastIndexOf(">") + 1;
        let to = listString.length;
        let lastText = listString.substr(from, to);
        listObj["last_"] = lastText;

        linesObjArray.push(listObj);

        j = getNextLinePos(lineString, "li", j);

        if(j < 0) {
            j = listString.length;
          }

      }

      if(getNextLinePos(htmlString, lineTag, i)) {
        i = getNextLinePos(htmlString, lineTag, i);
      } else {
        i = htmlString.length;
      }
      continue;
    }


    let lineObj = {};

    //Handling <br>
    if(lineString === "<br>") {
      lineObj.p_ = "";
      lineObj["last_"] = "";
      linesObjArray.push(lineObj);
      // if(getNextLinePos(htmlString, lineTag, i)) {
      //   i = getNextLinePos(htmlString, lineTag, i);
      // } else {
      //   i = htmlString.length;
      // }
      i = getNextLinePos(htmlString, lineTag, i) || htmlString.length;
      continue;
    }

    //plain text
    if(lineString.indexOf("<") < 0) {
      lineObj[lineTag+"_"] = lineString;
      lineObj["last_"] = "";
      linesObjArray.push(lineObj);

      // if(getNextLinePos(htmlString, lineTag, i)) {
      //   i = getNextLinePos(htmlString, lineTag, i);
      // } else {
      //   i = htmlString.length;
      // }

      i = getNextLinePos(htmlString, lineTag, i) || htmlString.length;
      continue;
    }

    let j = 0;
    let firstText = lineString.substring(j, lineString.indexOf("<"));
    lineObj[lineTag+"_"] = firstText;
    j = lineString.indexOf("<");
    do {
      let key = getOpeningTag(lineString, j);
      let value = getInnerText(lineString, j);
      lineObj[key + "_" + j] = value;
      // console.log("lineObj: ", lineObj);

      if(nextTag(lineString, j) > 0) {
        j = nextTag(lineString, j);
      } else {
        break;
      }

      if(lineString[j + 1] === "/") {
        j = lineString.indexOf(">", j) + 1;
        //is this the last inside tag?
        let nextInsideTag2 = lineString.indexOf("<", j);
        if(nextInsideTag2 > 0) {
          value = lineString.substring(j, lineString.indexOf("<", j));
          lineObj["inBetweenText_" + j] = value;
          j = lineString.indexOf("<", j);

        } else {
          j = lineString.length;
        }
        continue;
      }
    }
    while(j < lineString.length);

    let from = lineString.lastIndexOf(">") + 1;
    let to = lineString.length;
    let lastText = lineString.substr(from, to);
    lineObj["last_"] = lastText;

    linesObjArray.push(lineObj);

    // if(getNextLinePos(htmlString, lineTag, i)) {
    //   i = getNextLinePos(htmlString, lineTag, i);
    // } else {
    //   i = htmlString.length;
    // }
    i = getNextLinePos(htmlString, lineTag, i) || htmlString.length;
  }
  
  return linesObjArray;
}

// Helper functions

function getLineString(htmlStr, openTag, startPos) {
  let closingTag = "</" + openTag + ">";
  let to = htmlStr.indexOf(closingTag, startPos);
  let from = htmlStr.indexOf(">", startPos) + 1;
  let lineString = htmlStr.substring(from, to);
  return lineString;
}

function getNextLinePos(htmlStr, openTag, startPos) {
  let closingTag = "</" + openTag + ">";
  let closingTagLength = closingTag.length;
  let nextLinePos = htmlStr.indexOf(closingTag, startPos) + closingTagLength;
  return nextLinePos;
}

function getOpeningTag(htmlStr, startPos) {
  let firstSpace = htmlStr.indexOf(" ",startPos);
  let firstClosingBracket = htmlStr.indexOf(">", startPos);
  let endPos = firstSpace < firstClosingBracket ? firstSpace : firstClosingBracket;
  let getOpeningTag = htmlStr.substring(startPos + 1, endPos)

  return getOpeningTag;
}

// function getNextClosingTag(htmlStr, startPos) {
//   let from = htmlStr.indexOf("</", startPos);
//   let to = htmlStr.indexOf(">", from);
//   return htmlStr.substring(from + 2, to);
// }

function getInnerText(htmlStr, startPos) {
  let text = htmlStr.substring(htmlStr.indexOf(">", startPos) + 1, htmlStr.indexOf("<", startPos + 1));
  if(text) {
    return text;
  }
  return "";
}

function nextTag(htmlStr, startPos) {
  return htmlStr.indexOf("<", htmlStr.indexOf(">", startPos));
}

// function getLastText(htmlStr, i) {
//   let start = htmlStr.lastIndexOf(">", i) + 1;
//   return htmlStr.substring(start, i);
// }
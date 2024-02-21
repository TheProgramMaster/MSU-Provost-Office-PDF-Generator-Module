//jshint esversion:8

const {appFileSchema} = require('../schema');
const {applicationSchema} = require('../schema');
const {facultySchema} = require('../schema');
// const {appCommentSchema} = require('../schema');
const {appRoleSchema} = require('../schema');
const {appRecommendationSchema} = require('../schema');
const {appVoteSchema} = require('../schema');
const {ShortDate} = require("../helpers/helperfunctions");
const mongoose = require('mongoose');
// const fs = require("fs-extra");
const PDFDocument = require('pdfkit');
//const getStream  = require('get-stream');
const path = require('path');
const file = path.join(__dirname, '/uploads/output.pdf');
const processHTMLString = require('../htmlToPDFKit');


module.exports = function(app) {
  
  app.post("/buildTenureRoleReport", async function(req, res) {

    // let appToReview = {};

    const applicationID=req.body.applicationID;
    // const applicationID = 'T2020M00002285';
    const role = req.body.role;
    const AppFile = mongoose.model('AppFile', appFileSchema);
    const Application = mongoose.model('Application', applicationSchema);
    const Faculty = mongoose.model('Faculty', facultySchema);
    // const AppComment = mongoose.model('AppComment', appCommentSchema);
    const AppRole = mongoose.model('AppRole', appRoleSchema);
    const AppRecommendation = mongoose.model('AppRecommendation', appRecommendationSchema);
    const AppVote = mongoose.model('AppVote', appVoteSchema);


    var application = await Application.findOne({applicationID: applicationID}, function(err, application) {return application;}).lean();
    var applicant = await Faculty.findOne({mNumber: application.mNumber}, function(err, applicant) {return applicant;}).lean();
    var files = await AppFile.find({applicationID: applicationID}, function(err, file) {return file;}).lean();
    //var comments = await AppComment.find({applicationID: applicationID, role: role}, function(err, comments){return comments;}).lean();
    // var reviewer= await Faculty.findOne({mNumber: rMNumber}, function(err, applicant){return applicant;}).lean();
    var chairsCriteria = {
      applicationID: applicationID,
      role: role,
      subRole: "Chair",
    };
    // console.log('####',chairsCriteria)
    // console.log("🚀 ~ file: BuildTenureRoleReport.js ~ line 48 ~ app.post ~ chairsCriteria", chairsCriteria)
    var chair= await AppRole.findOne(chairsCriteria);
    var recommendations = await AppRecommendation.find({applicationID: applicationID, role: role}, function(err, recommendation) {return recommendation;}).lean();
    // var departmentVoteCount = await AppVote.countDocuments({applicationID: applicationID, role: "Department", vote:{ $in: ['Yes', 'No'] }});
    // var collegeVoteCount = await AppVote.countDocuments({applicationID: applicationID, role: "College", vote:{ $in: ['Yes', 'No'] }});
    // var departmentYes= await AppVote.countDocuments({applicationID: applicationID, role: "Department", vote: "Yes"});
    // var collegeYes= await AppVote.countDocuments({applicationID: applicationID, role: "College", vote: "Yes"});
    var chairVote = await AppVote.find({applicationID: applicationID, role: "Chair"}, function(err, vote) {return vote;}).lean();
    var deanVote = await AppVote.find({applicationID: applicationID, role: "Dean"}, function(err, vote) {return vote;}).lean();
    var provostVote = await AppVote.find({applicationID: applicationID, role: "Provost"}, function(err, vote) {return vote;}).lean();
    var collegeVotes = await AppVote.find({applicationID: applicationID, role: "College"}, function(err, vote) {return vote;}).lean();
    // var departmentVotes = await AppVote.find({applicationID: applicationID, role: "Department"}, function(err, vote) {return vote;}).lean();
    let departmentVotes = await AppRole.find({applicationID: applicationID, role: "Department"}).sort({lastName: 1});

    let finalRecommendations = {};

    for(var i=0; i< application.applicationEvents.length;i++)
    {
      finalRecommendations[application.applicationEvents[i].eventName]= application.applicationEvents[i].recommendation;
    }


    //var votePerReviewer= await AppVote.find({applicationID: applicationID, role: role, rMNumber: rMNumber}, function(err, vote){return vote;}).lean();



    // let appID = applicationID;
    //appToReview.rMNumber = rMNumber;
    // appToReview.rName = reviewer.firstName + " " + reviewer.lastName;
    //appToReview.role = role;
    let firstName = applicant.firstName;
    let lastName = applicant.lastName;
    let mNumber = applicant.mNumber;
    let college = applicant.collegeDesc;
    let department = applicant.departmentDesc;
    let appType = application.application;
    let reduction = applicant.reduction;
    let extension = applicant.extension;
    let rescission = applicant.rescission;
    let priorService = application.priorService;
    let dateAppointment = applicant.dateAppointment;
    let degree = applicant.degree;
    let degreeYear = applicant.degreeYear;
    let rank = applicant.rank;
    let appFiles = files;
    let tenure = applicant.tenure;
    //let comments = comments;
    // let subRole=appRole.subRole;
    let appRecommendations = recommendations;
    // let vote = votes;
    // let votePerReviewer= votePerReviewer;
    // const pdf= async ()=> {

    let doc = new PDFDocument({
      autoFirstPage: false
    });
    // doc.pipe(fs.createWriteStream('./js/post/uploads/output.pdf'));
    doc.pipe(res);

    doc.info.Title = "Tenure Application for";
    doc.info.Author = "Murray State University TAPP System";
    doc.registerFont("Heading", "./fonts/FreightSansBold.otf");
    doc.registerFont("Emphasize", "./fonts/FreightSansMedium.otf");
    doc.registerFont("Body", "./fonts/FreightSansBook.ttf");
    doc.registerFont("Italic", "./fonts/FreightTextBoldItalic.otf");

    //// FIRST PAGE
    doc.addPage({
      margin: 36
    });
    //adding checkerboard pattern for visualization and measurement
    // for (let row = 0; row < 68; row++) {
    //   for (let col = 0; col < 88; col++) {
    //     const color = (col % 2) - (row % 2) ? "#eee" : "#cce6ff";
    //     doc.rect(row * 9, col * 9, 9, 9)
    //       .fill(color);
    //   }
    // }
    
    // for (let col = 0; col < 612; col += 36) {
    //   doc.font("Body")
    //     .fontSize(8)
    //     .fillColor([0, 33, 68])
    //     .text(col, col, 12);
    // }
    // for (let row = 0; row < 792; row+=36) {
    //   doc.font("Body")
    //      .fontSize(8)
    //      .fillColor([0, 33, 68])
    //      .text(row, 12, row);
    // }

    /// Header
    doc.image("./public/img/primary_navy_prov.png", 39, 36, {
      height: 54
    });
    doc.moveTo(250, 36)
      .lineTo(250, 92)
      .lineWidth(0.5)
      .stroke();

    doc.font("Heading")
      .fontSize(32)
      .fillColor([0, 33, 68])
      .text(`${appType} Application`, 266, 32)
      .fontSize(24)
      .text("Recommendations Summary");

    //Applicant Info Section

    let startX = 36;
    let startY_1 = 126;
    let lineSpacing_1 = 21;
    let columnWidth = 267;
    let msuDate = new Date(dateAppointment);
    let month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    let line = 0;
    doc.font("Emphasize")
      .fontSize(14)
      .text(`Name: `, startX + 3, startY_1 + (line * lineSpacing_1), {
        continued: true
      })
      .font("Body")
      .text(`${firstName} ${lastName}`);
    doc.font("Emphasize")
      .fontSize(14)
      .text(`Rank: `, startX + 3 + columnWidth, startY_1 + (line * lineSpacing_1), {
        continued: true
      })
      .font("Body")
      .text(`${rank}`);
    line += 1;
    doc.font("Emphasize")
      .fontSize(14)
      .text(`College: `, startX + 3, startY_1 + (line * lineSpacing_1), {
        width: columnWidth,
        continued: true
      })
      .font("Body")
      .text(`${college}`);
    doc.font("Emphasize")
      .fontSize(14)
      .text(`Department: `, startX + 3 + columnWidth, startY_1 + (line * lineSpacing_1), {
        width: columnWidth,
        continued: true
      })
      .font("Body")
      .text(`${department}`);
    line += 1;
    doc.font("Emphasize")
      .fontSize(14)
      .text(`Highest Degree/Year Received: `, startX + 3, startY_1 + (line * lineSpacing_1) + 18, {
        continued: true
      })
      .font("Body")
      .text(`${degree}/${degreeYear}`);
    doc.font("Emphasize")
      .fontSize(14)
      .text(`MSU Appointment: `, startX + 3 + columnWidth, startY_1 + (line * lineSpacing_1) + 18, {
        continued: true
      })
      .font("Body")
      .text(`${month[msuDate.getMonth()]} ${msuDate.getFullYear()}`);

    // doc.moveTo(36, 206)
    //   .lineTo(576, 206)
    //   .lineWidth(0.5)
    //   .stroke();

    line += 2;
    doc.font("Emphasize")
      .fontSize(14)
      .text(`Extension/Reduction/Rescission: `, startX + 3, startY_1 + (line * lineSpacing_1), {
        continued: true
      })
      .font("Body")
      .text(`${extension}/${reduction}/${rescission} year(s)`);

    doc.moveTo(36, 238)
      .lineTo(576, 238)
      .lineWidth(0.5)
      .stroke();

    //Recommendation SECTION
    let startY_2 = startY_1 + 134;
    let lineSpacing_2 = 30;
    let pageWidth = 540;

    let textRev=[{rev: "Reviewers", rec: "Tenure Recommendations"}];
// console.log('>>>>>>>>>',chair)
    // chairs.forEach(chair => {
      switch (chair.role){
        case "Department":
          textRev.push({seq: 1, rev: "Departmental Committee, Chair: " + chair.firstName + " " + chair.lastName, rec:finalRecommendations.Department});
          break;
        case "Chair":
          textRev.push({seq: 2, rev: "Department Chair: " + chair.firstName + " " + chair.lastName, rec:finalRecommendations.Chair});
          break;
        case "College":
          textRev.push({seq: 3, rev: "Collegiate Committee, Chair: " + chair.firstName + " " + chair.lastName, rec:finalRecommendations.College});
          break;
        case "Dean":
          textRev.push({seq: 4, rev: "Dean: " + chair.firstName + " " + chair.lastName, rec:finalRecommendations.Dean});
          break;
        case "Provost":
          textRev.push({seq: 5, rev: "Provost: " + chair.firstName + " " + chair.lastName, rec:finalRecommendations.Provost});
          break;
      }
    // });

    textRev.push({rev: "", rec: ""});



    textRev = sort_by_key(textRev, 'seq');

    for (let l = 0; l < textRev.length; l++) {
      doc.moveTo(startX, startY_2  + (l * lineSpacing_2))
        .lineTo(startX + pageWidth, startY_2 + (l * lineSpacing_2))
        .lineWidth(0.5)
        .stroke();

      doc.font("Body")
        .fillColor([0, 33, 68])
        .fontSize(14)
        .text(textRev[l].rev, startX + 9, startY_2  + (l * lineSpacing_2) + 10);

      switch (textRev[l].rec) {
        case "Tenure Recommendations":
          doc.fillColor([0, 33, 68]);
          break;
        case "Recommended":
          doc.fillColor("green");
          break;
        case "Not recommended":
          doc.fillColor("red");
          break;
        case "Tie vote":
          doc.fillColor("blue");
          break;
      }

      doc.font("Body")
        .fontSize(14)
        .text(textRev[l].rec, startX + 385, startY_2  + (l * lineSpacing_2) + 10);
    }

    //Table header shading
    doc.rect(startX, startY_2, pageWidth, lineSpacing_2)
      .fillOpacity(0.1)
      .fill([0, 33, 68]);

    //Table vertical lines
    doc.moveTo(startX, startY_2)
      .lineTo(startX, startY_2 + ((textRev.length - 1) * lineSpacing_2))
      .lineWidth(0.5)
      .stroke();

    doc.moveTo(startX + 378, startY_2)
      .lineTo(startX + 378, startY_2 + ((textRev.length - 1) * lineSpacing_2))
      .lineWidth(0.5)
      .stroke();

    doc.moveTo(startX + pageWidth, startY_2)
      .lineTo(startX + pageWidth, startY_2 + ((textRev.length - 1) * lineSpacing_2))
      .lineWidth(0.5)
      .stroke();

    //University SECTION
    // let startY_3 = startY_2 + 198;
    // let boxWidth = 261;
    // let boxHeight = 108;

    // doc.rect(startX, startY_3, boxWidth, boxHeight)
    //   .stroke();

    // doc.moveTo(startX + 3, startY_3 + boxHeight - 23)
    //   .lineTo(startX + boxWidth - 3, startY_3 + boxHeight - 23)
    //   .lineWidth(0.5)
    //   .stroke();

    // doc.font("Body")
    //   .fillColor([0, 33, 68])
    //   .fillOpacity(1)
    //   .fontSize(14)
    //   .text("Reviewed by University Tenure Committee",
    //     startX + 4, startY_3 + 3,
    //     {width: boxWidth}
    //   )
    //   .text("Chair",
    //     startX + 4, startY_3 + boxHeight - 18
    //   )
    //   .text("Date",
    //     startX + 180, startY_3 + boxHeight - 18
    //   );

    // doc.rect(startX + boxWidth + 18, startY_3, boxWidth, boxHeight)
    //   .stroke();

    // doc.moveTo(startX + boxWidth + 18 + 3, startY_3 + boxHeight - 23)
    //   .lineTo(startX + boxWidth + boxWidth + 18 - 3, startY_3 + boxHeight - 23)
    //   .lineWidth(0.5)
    //   .stroke();

    // doc.font("Body")
    //   .fillColor([0, 33, 68])
    //   .fillOpacity(1)
    //   .fontSize(14)
    //   .text("Approved \t\t\t\t\t\t\ Disapproved",
    //     startX + boxWidth + 18 + 4, startY_3 + 3,
    //     {
    //       width: boxWidth,
    //       align: "center"
    //     }
    //   )
    //   .text("President",
    //     startX + boxWidth + 18 + 4, startY_3 + boxHeight - 18
    //   )
    //   .text("Date",
    //     startX + boxWidth + 18 + 180, startY_3 + boxHeight - 18
    //   );

    // doc.font("Italic")
    //   .fillColor([0, 33, 68])
    //   .text("Tenure granted by action of the Board of Regents of Murray State University.",
    //     startX, startY_3 + boxHeight + 18, {
    //       width: pageWidth,
    //       align: "center",
    //       lineGap: 9
    //     })
    //   .text("Term Effective ________________", {
    //     width: pageWidth,
    //     align: "center"
    //   });

    // doc.moveTo(startX, startY_3 + boxHeight + 72)
    //   .lineTo(startX + pageWidth, startY_3 + boxHeight + 72)
    //   .lineWidth(0.5)
    //   .stroke();

    // doc.font("Body")
    //   .text("Other action:", startX, startY_3 + boxHeight + 81);

      recommendations.forEach(recommendation=>{
        switch (recommendation.section){
          case "Teaching": recommendation.seq = 1;
          break;
          case "Research": recommendation.seq = 2;
          break;
          case "Service": recommendation.seq = 3;
          break;
          case "University": recommendation.seq = 4;
          break;
        }
      });

      recommendations = sort_by_key(recommendations, 'seq');

      function sort_by_key(array, key) {
        return array.sort(function(a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
      }



    ///// Recommendation PAGES
    recommendations.forEach(function(recommendation, i) {
      doc.addPage({
        margin: 36
      });

      let startY_4 = 108;



      /// Header
      doc.image("./public/img/primary_navy_prov.png", 39, 36, {
        height: 54
      });
      doc.moveTo(250, 36)
        .lineTo(250, 92)
        .lineWidth(0.5)
        .stroke();

      doc.font("Heading")
        .fontSize(24)
        .fillColor([0, 33, 68])
        .text(`${appType} Application`, 266, 32)
        .fontSize(18)
        .text(`${recommendation.role} Recommendation`);

      doc.font("Body")
        .fontSize(14)
        .text(`Applicant: ${firstName} ${lastName}`);

      switch(recommendation.section) {
        case "Teaching":
          doc.font("Heading")
            .fontSize(18)
            .text("I. \tTeaching Excellence", startX + 3, startY_4);
          break;
        case "Research":
          doc.font("Heading")
            .fontSize(18)
            .text("II. \tResearch and Creative Activities", startX, 108);
          break;
        case "Service":
          doc.font("Heading")
            .fontSize(18)
            .text("III. \tUniversity Service and Professional Activities", startX, 108);
          break;
        case "University":
          doc.font("Heading")
            .fontSize(18)
            .text("IV. \tNeeds of The University", startX, 108);
          break;
      }

      doc.text("", startX + 9, 136);

      htmlToPDFKit(recommendation.recommendation);

      function htmlToPDFKit(htmlString) {
        // htmlString = htmlString.replace(/&nbsp;/g, ' ');
        // htmlString = htmlString.replace(/(?=<span)(.*?)(?:>)/g, '');
        // htmlString = htmlString.replace(/<\/span>/g, '');
        // htmlString = htmlString.replace(/&amp;/g, '&');
        // htmlString = htmlString.replace(/\<p\>\<br\>\<\/p\>/g, '<p> </p>');
        let linesArray = processHTMLString.processHTMLString(htmlString);

        linesArray.forEach(element=>{
          let counter = 0;
          for (let key in element) {
            counter =             counter++
            // console.log('keeeeeeeeeeeeeeeeeeeeeeeeeeeee',key)
            let actualKey = key.substr(0,key.indexOf("_"))
            // console.log('actualKeyactualKey',actualKey)
            switch(actualKey){
            case "h1": h1(element[key]);
                        break;
            case "h2": h2(element[key]);
                        break;
            case "h3": h3(element[key]);
                        break;
            case "p":  p(element[key]);
                        break;
            case "img":  img(element[key]);
            break;
            case "ol": ol(element[key]);
                        break;
            case "ul": ul(element[key]);
                        break;
            case "em": em(element[key]);
                        break;
            case "u":  u(element[key]);
                        break;
            case "strong": strong(element[key]);
                        break;
            case "inBetweenText": inBetweenText(element[key]);
                        break;
            case "last": last(element[key]);
                        break;
            }
          }
        });

      }

      function h1(text) {
        return doc.font("Heading")
          .fontSize(24)
          .text(text, {
            height: 36,
            continued: true
          });
      }

      function h2(text) {
        return doc.font("Heading")
          .fontSize(18)
          .text(text, {
            continued: true
          });
      }

      function h3(text) {
        return doc.font("Heading")
          .fontSize(14)
          .text(text, {
            continued: true
          });
      }

      function p(text) {
        return doc.font("Body")
          .fontSize(12)
          .moveDown()
          .text(text, {
          continued: true
        });
      }
      function img(text) {
        const base64Uri = text.substring(10,text.length-3)
        // console.log('@@@@',base64Uri.length)
        var base64Data = base64Uri.replace(/^data:image\/png;base64,/, "");
require("fs").writeFile("out.png", base64Uri, 'base64', function(err) {
  console.log(err);
});
        // return doc.image(base64Uri,100,100)
        // return doc.image(Buffer.from(base64Uri)); // this will decode your base64 to a new buffer
      }

      function ol(text) {
        return doc.font("Body")
        .fontSize(12)
        .text(text, {
          indent: 18,
          continued: true
        });
      }

      function ul(text) {
        return doc.font("Body")
        .fontSize(12)
        .text("•\t" + text, {
          indent: 18,
          continued: true
        });
      }

      function em(text) {
        return doc.text(text, {oblique: true, continued: true});
      }

      function u(text) {
        return doc.text(text, {underline: true, continued: true});
      }

      function strong(text) {
        return doc.text(text, {fill: true, stroke: true, continued: true});
      }

      function inBetweenText(text) {
        return doc.text(text, {oblique: false, underline: false, stroke: false, continued: true});
      }

      function last(text) {
        return doc.text(text, {oblique: false, underline: false, stroke: false, continued: false})
          .moveDown();
      }

      //TODO 
      //Expanding the Coloring and styling to font
      //Look into different sizes of font for h4 and h5 of text
      //Add images so that users can embed images onto the document
      //Ensure these modifications are reflected in modifications to htmlToPDFKit.js file.
      //Potentially look at better ways than htmlToPDFKIt.js file to translate HTML to PDF using Quill/PDFKit
      

      //Notes: looking into pdf-puppeteer of nodejs

      //Go step-by-step - Build Submit button and connect it to textarea first,
      //then work on returning HTML string from Quill textarea from there

      //Node.js allows us to work between front-end and back-end, so, we should be able to return
      //HTML string between the two.


      //// SIGNATURE/VOTE INFORMATION SECTION
      // let nameWidth;
      // let voteWidth;
      switch(recommendation.role) {
        case "Department":
          doc.font("Emphasize")
            .fontSize(14)
            .text(`Departmental Committee`, doc.x, doc.y + 24, {lineGap: 12});

          doc.moveTo(doc.x, doc.y - 12)
            .lineTo(576, doc.y - 12)
            .lineWidth(0.5)
            .stroke();

          doc.font("Body")
            .fontSize(12)
            .text("Name", {
              columns: 2,
              columnGap: 18,
              lineGap: 6,
              height: 118,
              width: 522,
              align: "left",
              fill: true,
              stroke: true,
              continued: true
            })
            // .text("Vote", 166 - doc.widthOfString("Name"), doc.y, {continued: true})
            // .text("Date", 226 - doc.widthOfString("Name") - doc.widthOfString("Vote"));
            .text("Date", 166 - doc.widthOfString("Name"));

          // let nameWidth;
          // let voteWidth;
          departmentVotes.forEach((reviewer) => {
            let reviewerName = `${reviewer.firstName} ${reviewer.lastName}`;
            let dateVote = reviewer.dateVote ? ShortDate(reviewer.dateVote) : "N/A"
            let nameWidth = doc.widthOfString(reviewerName);
            // voteWidth = doc.widthOfString(reviewer.vote);
            doc.font("Body")
              .text(reviewerName, {lineGap: 6, continued: true})
              // .text(reviewer.vote, 166 - nameWidth, doc.y, {continued: true})
              // .text(ShortDate(reviewer.dateVote), 226 - nameWidth - voteWidth, doc.y);
              .text(dateVote, 166 - nameWidth, doc.y);
          });
          break;

        case "Chair":
          doc.font("Body")
            .fontSize(12)
            .text(`${chairVote[0].rName} \t \t \t ${ShortDate(chairVote[0].dateVote)}`, 324, 720, {lineBreak: false})
            // .text(`${chairVote[0].rName} \t \t \t ${ShortDate(chairVote[0].dateVote)}`, doc.x, doc.y + 24, {lineGap: 12})
            .moveTo(324, 732)
            .lineTo(540, 732)
            .lineWidth(0.25)
            .stroke()
            .text("Department Chair", 324, 738, {lineBreak: false});
          break;

        case "College":
          doc.font("Emphasize")
            .fontSize(14)
            .text(`Collegiate Committee`, doc.x, doc.y + 24, {lineGap: 12});

          doc.moveTo(doc.x, doc.y - 12)
            .lineTo(576, doc.y - 12)
            .lineWidth(0.5)
            .stroke();

          doc.font("Body")
            .fontSize(12)
            .text("Name", {
              columns: 2,
              columnGap: 15,
              lineGap: 6,
              height: 14,
              width: 252,
              align: "left",
              fill: true,
              stroke: true,
              continued: true
            })
            // .text("Vote", 166 - doc.widthOfString("Name"), doc.y, {continued: true})
            // .text("Date", 226 - doc.widthOfString("Name") - doc.widthOfString("Vote"));
            .text("Date", 166 - doc.widthOfString("Name"));


          let collNameWidth;
          let collVoteWidth;
          collegeVotes.forEach((reviewer) => {
            collNameWidth = doc.widthOfString(reviewer.rName);
            collVoteWidth = doc.widthOfString(reviewer.vote);
            doc.font("Body")
              .text(reviewer.rName, {lineGap: 6, continued: true})
              // .text(reviewer.vote, 166 - nameWidth, doc.y, {continued: true})
              // .text(ShortDate(reviewer.dateVote), 226 - nameWidth - voteWidth, doc.y);
              .text(ShortDate(reviewer.dateVote), 166 - collNameWidth, doc.y);
          });
          break;

        case "Dean":
          // if(Object.keys(deanVote).length === 0 && deanVote.constructor === Object){
            doc.font("Body")
              .fontSize(12)
              .moveTo(324, 720)
              .text(`${deanVote[0].rName}  \t \t \t  ${ShortDate(deanVote[0].dateVote)}`, 324, 720)
              .moveTo(324, 732)
              .lineTo(540, 732)
              .lineWidth(0.25)
              .stroke()
              .text("Dean", 324, 738);
          // }
          break;

        case "Provost":
          doc.font("Body")
            .fontSize(12)
            .moveTo(324, 720)
            .text(`${provostVote[0].rName} \t \t \t ${ShortDate(provostVote[0].dateVote)}`, 324, 720)
            .moveTo(324, 732)
            .lineTo(540, 732)
            .lineWidth(0.25)
            .stroke()
            .text("Provost", 324, 738);
          break;
      }

    });

    doc.end();

  });
  
};
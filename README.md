# MSU-Provost-Office-PDF-Generator-Module
     
## Description

     This is the submission project of team 10 of Dr. Jason Owen's CSC 530 Senior Capstone course for the Spring academic
     semester of 2024 at Murray State University. For my team's submission for this project, my team worked on an  
     extension to a pre-existing Quill What You See if What You Get (WYSIWYG) module.
     Our client included the Murray State University's Provost Office.

## Our Contribution to Previous Work

     Our work builds on pre-existing code by allowing end-users to implement added styles in their input application.
     Namely, end-users may now underline, bold, italicize, and strike-through text given to Quill input field.

### PDF Generator Capability

     In addition to added style capaiblities, end-users have the ability to generate Public Display Files (PDF) from user 
     input data. Ideally, this generated output data is to be utilized for consumption and recording purposes of the Murray
     State University Provost Office.

### Embedded Images Capabilities

     Users may also embed images into given Quill editor. Images may also be resized vertically through quill-reactjs module.

## End-User Execution Instructions

     Our project may be executed by executing the following steps in sequence:

     1. Download the zip folder of the main branch of this repository.
     2. Decompress and download all relevant files from .zip folder download.
     3. Navigate to geeks-for-geeks directory of this folder through command-line-interface.
     4. Navigate to src directory.
     5. Execute web-application of this project by executing "npm start" in the command-line interface editor.
     6. Make use of Quill WYSIWYG editor on resulting webpage application resulting from execution of this project.

## Modules Included in Development of Our Project

     In developing our project, we made use of the following modules in Open Source Software (OSS)

### html2canvas

     This module allows us to take a "screenshot" of the current text of the Quill WYSIWYG editor as it exists at the moment 
     our end-user wishes to geneate a PDF from their input text to the editor. In doing so, we are able to create the resulting
     downloaded PDF file the user immediately downloads to their local machine to read at their perusal.

### jspdf

     This module is used to generate a PDF from our screenshot taken previously using the html2canvas module.

### quill-image-resize-module-react

     This module builds on top of our Quill module by allowing us to resize embedded images through end-user manipulation.
     This module is implement through React.js, as we utilized React.js as the framework of choice to serve on the 
     front-end of our software application.

### Quill

     Of course, we included the main Quill module. This module allows us to instantiate Quill WYSIWYG editors within
     our webpage application.

### ReactQuill

     This module allows us to use Quill methods from the Quill editor through the React.js framework on the front-end
     of our project.

## Future Work

1. Database Integration:
  - Purpose: Enables users to manage, store, and retrieve documents directly from the editor.
  - Benefits: Improves organization and accessibility, enhancing the overall user experience.

2. Expanded Download Options:
  - Formats: Supports downloads in DOC, TXT, and more to meet diverse needs.
  - Customization: Allows detailed customization of document formatting and layout before export.

3. Enhanced Collaboration Tools:
  - Real-Time Editing: Facilitates simultaneous document editing by multiple users.
  - Commenting and Review: Provides integrated commenting tools for feedback and smooth revisions.

### Express.js Implementation

     As this project currently stands, we were not able to implement express.js to route user date through local servers.
     This project could, in the future, do so in a reactive manner to get and post necessary data in our Quill WYSIWYG editor.

### MongoDB Capabilities

     Our project currently is not connected to a SQL database of any form. Future work could implement this capability,
     either through MongoDB, or any other database feature, to store student data or any other form of input data to our
     Quill WYSIWYG editor in said database on local servers.

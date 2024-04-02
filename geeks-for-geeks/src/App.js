import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module-react';

function App() {
  const [value, setValue] = useState('');
  Quill.register('modules/imageResize',ImageResize);
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      [{ 'color': [] }],
      [{ 'background': [] }]
    ],
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize','DisplaySize']
    },
  };

  const generatePDF = () => {
    const quillEditor = document.querySelector('.ql-editor');
    html2canvas(quillEditor, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 1); // Use JPEG format with quality 1

      /*const doc = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: [4,2]
      });*/
      const doc = new jsPDF('p','pt','a4');
      const width = quillEditor.clientWidth;
      const height = quillEditor.clientHeight;
      doc.addImage(imgData, 'JPEG', 10, 10, width, height); // Adjust the position and size as needed
      doc.save('my-document.pdf'); // Save the PDF with a filename
    });
  };

  const handleChange = (content) => {
    setValue(content);
  };

  return (
    <div className="App">
      <div>
        <ReactQuill modules={modules} theme="snow" value={value} onChange={handleChange} />
      </div>

      <form id="pdfForm">
        <button
          type="button"
          className="btn-submit"
          disabled={value === ''}
          onClick={generatePDF}
          style={value === '' || value === '<p><br></p>' ? styles.disabledButton : styles.enabledButton}
        >
          Generate PDF
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    margin: 'auto',
    padding: '20px',
    width: 400,
  },
  heading: {
    fontSize: '34px',
    marginBottom: '10px',
    color: "green",
    borderBottom: "3px solid green",
    paddingBottom: 20,
    borderRadius: "8px",
  },
  disabledButton: {
    backgroundColor: 'gray',
    color: 'white',
    cursor: 'not-allowed',
    margin: 10,
    padding: 15,
    borderRadius: "8px",
    border: "none",
    boxShadow: "0px 0px 10px 0px grey",
  },
  enabledButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    margin: 10,
    padding: 15,
    borderRadius: "8px",
    border: "none",
    boxShadow: "0px 0px 10px 0px grey",
  },
};

export default App;

import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ImageResize from 'quill-image-resize-module-react';
import Quill from 'quill';

function App() {
  const [value, setValue] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
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
      modules: ['Resize','DisplaySize'],
    },
  };

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setUploadedImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleDeleteImage = () => {
    setUploadedImage(null);
  };

  const generatePDF = () => {
    const quillEditor = document.querySelector('.ql-editor');
    html2canvas(quillEditor, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 1); // Use JPEG format with quality 1

      const doc = new jsPDF();
      doc.addImage(imgData, 'JPEG', 10, 10, doc.clientWidth, doc.clientHeight); // Adjust the position and size as needed
      doc.save('my-document.pdf'); // Save the PDF with a filename
    });
  };

  const handleChange = (content) => {
    setValue(content);
  };

  return (
    <div className="App">
      
      <div>
      
        {uploadedImage && (
          <div>
            <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />
            <button onClick={handleDeleteImage}>Delete Image</button>
          </div>
        )}
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

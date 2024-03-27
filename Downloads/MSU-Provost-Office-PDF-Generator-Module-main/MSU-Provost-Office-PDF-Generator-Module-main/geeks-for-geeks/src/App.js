import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import ReactQuill from 'react-quill';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

//<script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>

function App() {
  const [value, setValue] = useState('');
  Quill.register('modules/imageResize',ImageResize);
    const modules = {
        toolbar : [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            [{'color' : []}],
            [{'background' : []}]
            

        ],
        imageResize: {
          parchment: Quill.import('parchment'),
          module: ['Resize','DisplaySize'],
        },
    }
    const handleChange = (content) => {
        setValue(content);
    };
  return (
    <div className="App">
       <div>
            <ReactQuill  modules = {modules} theme="snow" value={value} onChange={handleChange}       
/>
        </div>
  
      <form id="pdfForm">
      <button type="submit" 
          class="btn-submit" 
          disabled={value==''}
          style={value=='' || value=='<p><br></p>' ? styles.disabledButton : styles.enabledButton}
          >Generate PDF</button>    </form>
    </div>


  );
}
const styles = {
  container: {
    textAlign: 'center',
    margin: 'auto',
    padding: '20px',
    width:400,
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

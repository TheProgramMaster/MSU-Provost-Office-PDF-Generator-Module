import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
//<script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>

function App() {
  const [value, setValue] = useState('');
    
    const modules = {
        toolbar : [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            [{'color' : []}],
            [{'background' : []}]
            

        ],
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
      <button type="submit" class="btn-submit">Generate PDF</button>
    </form>
    </div>


  );
}

export default App;

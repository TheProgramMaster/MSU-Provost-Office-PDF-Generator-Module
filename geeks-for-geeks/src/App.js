import logo from './logo.svg';
import Quill from "quill";
import './App.css';
import {useState} from 'react';
function AddLibrary(urlOfTheLibrary){
  const script = document.createElement("script");
  script.src = urlOfTheLibrary;
  script.async = true;
  document.body.appendChild(script);
}

function App() {
  const [userInput, setUserInput] = useState('');
  const handleMessageChange = event => {
    setUserInput(event.target.value);
  }
  return(
   <div class="container">
    <h2>Generate PDF from Web Form</h2>
    <div class="toolbar">
      <select id="fontFamily">
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
      </select>
      <select id="fontSize">
        <option value="10px">Small</option>
        <option value="14px">Normal</option>
        <option value="18px">Large</option>
      </select>
    </div>
    <form id="pdfForm">
      <div class="form-group">
        <textarea 
        id="userInput" 
        name="userInput"
        value={userInput}
        class="editor" 
        placeholder="Enter Text: "
        onChange={handleMessageChange}></textarea>
      </div>
      <button 
      type="submit" 
      class="btn-submit" 
      onClick={handleClick}
      disabled={!userInput} 
      >
        Generate PDF
      </button>
    </form>
    {AddLibrary("https://cdn.quilljs.com/1.3.6/quill.js")}
   </div>
  );
}

function handleClick(){
  alert("Submit button has been clicked.");
}

let quill = new Quill('#editor-container');

export default App;

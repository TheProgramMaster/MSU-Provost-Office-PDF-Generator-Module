import logo from './logo.svg';
import Quill from "quill";
import './App.css';
import {useState, useRef} from 'react';
//import processHTMLString from 'htmlToPDFKit';
function AddLibrary(urlOfTheLibrary){
  const script = document.createElement("script");
  script.src = urlOfTheLibrary;
  script.async = true;
  document.body.appendChild(script);
}

function App() {
  const [userInput, setUserInput] = useState('');
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const disableButton = () => {
    setButtonDisabled(true);
    alert("Button has been disabled!");
  };
  const enableButton = () => {
    setButtonDisabled(false);
    alert("Button has been enabled!");
  }
  const handleClick = event => {
    //outputString = processHTMLString(userInput);
    const quill = new Quill('#userInput',{
      theme: 'snow'
    });
    alert("Quill instance declared!");
  }
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
      style={!userInput ? styles.disabledButton: styles.enabledButton}
      disabled={!userInput} 
      onClick={handleClick}
      >
        Generate PDF
      </button>
    </form>
    {AddLibrary("https://cdn.quilljs.com/1.3.6/quill.js")}
   </div>
  );
}

//function handleClick(){
//  alert(userInput);
//}

//let quill = new Quill('#editor-container');
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
    display: "block",
    width: "100px",
    padding: "10px",
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    borderRadius: "5px",
    border: "none",
    boxShadow: "0px 0px 10px 0px grey",
    transition: "background-color 0.3s ease",
  },
};
export default App;


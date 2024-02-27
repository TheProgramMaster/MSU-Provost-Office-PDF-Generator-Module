import logo from './logo.svg';
import './App.css';
import Editor from './Editor/Editor';

function App() {
  return (
    <div className="App">
        <Editor />
  
      <form id="pdfForm">
      <button type="submit" class="btn-submit">Generate PDF</button>
    </form>
    </div>


  );
}

export default App;

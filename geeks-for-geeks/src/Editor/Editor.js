import React, {useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Editor = () => {
    const [value, setValue] = useState('');
    const modules = {
        toolbar : [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image']
            

        ],
    }
    const handleChange = (content, delta, source, editor) => {
        setValue(content);
    };
   

    return (
        <div>
            <ReactQuill  modules = {modules} theme="snow" value={value} onChange={handleChange}       
/>
        </div>

    )

}

export default Editor
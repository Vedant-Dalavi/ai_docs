/* eslint-disable no-unused-vars */
import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from './TranslationContext';
function TranslationForm() {
    const [text, setText] = useState("English"); // Controlled input
    const [file, setFile] = useState(null); // File input should be controlled separately
    const [option, setOption] = useState("translate")
    const navigate = useNavigate(); // Use useNavigate hook for navigation
    const { setTranslation } = useTranslation(); // Get setTranslation from context

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // File input should use 'files' property
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('pdfFile', file);
        formData.append('language', text);


        let response;

        if (option == "translate") {
            console.log("translate api")
            response = await axios.post('http://localhost:3000/api/translate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("response", response);
            if (response.status === 200) {

                setTranslation(response.data.data); // Update context state
                navigate("/translation"); // Navigate to translation page        } else {
            }


        } else if (option == "summarize") {
            console.log("summarize api")

            response = await axios.post('http://localhost:3000/api/summarize', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log("response", response);
            if (response.status === 200) {

                setTranslation(response.data.data); // Update context state
                navigate("/translation"); // Navigate to translation page        } else {
            }
        } else if (option == "legal") {
            console.log("legal api")

            response = await axios.post('http://localhost:3000/api/legal', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log("response", response);
            if (response.status === 200) {
                if (response.data.data == "true\n") {
                    alert("This is a legal document");
                } else {
                    alert("This is not a legal document");

                }
            }
        }



    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                {/* Controlled text input */}
                <input
                    type="text"
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Enter text"
                />

                <label>Select an option:</label>
                <select value={option} onChange={(e) => setOption(e.target.value)}>
                    <option value="translate">Translate</option>
                    <option value="summarize">Summarize</option>
                    <option value="legal">Check Legal</option>
                    <option value="option3">Option 4</option>
                </select>

                {/* Correct way to handle file input */}
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".txt,.pdf,.docx"
                />

                <button type="submit">Submit</button>
            </form>
        </>
    )
}

export default TranslationForm





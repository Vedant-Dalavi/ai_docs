import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import Translation from "../components/Translation";
import axios from "axios";
import Btn from "../components/common/Btn";
import History from "../components/History";

const Dashboard = () => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [generate, setGenerate] = useState(false);
    const [language, setLanguage] = useState("English")
    const [translation, setTranslation] = useState("");
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false)

    const user = JSON.parse(localStorage.getItem("user"))

    // Function to handle file drop
    const onDrop = useCallback((acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]); // Store the first file
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: ".docx, .pdf, .jpg, .png", // Allowed file types
        multiple: false, // Allow only one file
    });


    const handleTranslate = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setGenerate(false)
            alert("Please upload a file first!");
            return;
        }


        if (!language) {
            alert("Please select a language!");
            return;
        }

        if (language.length < 4) {
            alert("Please select a valid language!");
            return;
        }

        console.log("translate api")

        try {
            setLoading(true)
            const formData = new FormData();
            formData.append('pdfFile', selectedFile);
            formData.append('language', language);
            formData.append("_id", user._id)
            console.log("user", user)
            console.log("formData", formData)
            const response = await axios.post('http://localhost:3000/api/translate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("response", response);
            if (response.status === 200) {
                setTranslation(response.data.data)
                user.history = [...user.history, response.data.history]
                localStorage.setItem("user", JSON.stringify(user))
            }
            setLoading(false)
        } catch (err) {
            alert(err)
            setLoading(false)
        }



    }

    const handleSummarize = async () => {
        if (!selectedFile) {
            setGenerate(false)
            alert("Please upload a file first!");
            return;
        }


        try {
            setLoading(true)
            const formData = new FormData();
            formData.append('pdfFile', selectedFile);
            formData.append("_id", user._id)

            const response = await axios.post('http://localhost:3000/api/summarize', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("response", response);
            if (response.status === 200) {
                setTranslation(response.data.data)
                user.history = [...user.history, response.data.history]
                localStorage.setItem("user", JSON.stringify(user))
                setLoading(false)
                return
            }
        } catch (err) {
            alert(err)
            setLoading(false)
        }

    }
    const handleLegal = async () => {

        if (!selectedFile) {
            setGenerate(false)
            alert("Please upload a file first!");
            return;
        }


        try {
            setLoading(true)
            const formData = new FormData();
            formData.append('pdfFile', selectedFile);
            formData.append("_id", user._id)
            const response = await axios.post('http://localhost:3000/api/check_legal', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("response", response);
            if (response.status === 200) {
                if (response.data.data == "true\n") {
                    alert("This is a legal document")
                } else {
                    alert("This is not a legal document")
                }

                user.history = [...user.history, response.data.history]
                localStorage.setItem("user", JSON.stringify(user))
                setLoading(false)
                return
            }
        } catch (err) {
            alert(err)
            setLoading(false)
        }

    }

    const handleGenerate = async () => {
        if (!text) {
            alert("Please enter the details!");
            return;
        }

        try {
            setLoading(true)
            const data = {
                user_prompt: text,
                _id: user._id
            }
            // console.log("formData", formData)
            console.log("user", user)
            const response = await axios.post('http://localhost:3000/api/generate-document', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("response", response);
            if (response.status === 200) {
                setTranslation(response.data.data.replace(/```html\s*|\s*```/g, '').trim())
                user.history = [...user.history, response.data.history]
                localStorage.setItem("user", JSON.stringify(user))
                setLoading(false)
                return
            }
        } catch (err) {
            alert(err)
            setLoading(false)
        }

    }

    return (
        <div className="relative bg-gray-700 w-full flex flex-col items-center p-6">
            {/* Header */}
            <div className="bg-black text-white w-full max-w-4xl p-4 rounded-xl flex justify-between items-center">
                <h1 className="text-lg font-bold  text-white">AI-Powered Legal Documentation Assistant</h1>
                <div className="space-x-2">
                    <Link to={'/profile'} className="bg-red-500 px-4 py-2 rounded text-white">Profile</Link>
                    <Btn />
                </div>
            </div>

            <div
                className="space-y-2 bg-gray-600 max-w-4xl w-full px-8 py-4 mt-4 text-gray-300 rounded-md"
            >
                <p className="text-2xl font-semibold text-black">Welcome, {user.name}!</p>
                <p>Email: {user.email}</p>

            </div>

            {/* Upload Section */}
            {


                <div className="bg-gray-600 text-white w-full max-w-4xl p-6 mt-6 rounded-xl">
                    <h2 className="text-lg font-semibold">{
                        generate ? "Enter the Details" : "Upload Your Document"
                    }</h2>

                    {/* Drag & Drop Area */}

                    {
                        !generate ? (<div
                            {...getRootProps()}
                            className="border-dashed border-2 border-gray-400 p-8 mt-4 text-center text-gray-300 rounded-md cursor-pointer"
                        >
                            <input {...getInputProps()} />
                            <p>Drag & Drop or Click to Upload</p>
                            <p className="text-sm">Supported formats: docx, pdf, jpg, png</p>
                        </div>)
                            : (
                                <div className="border-dashed border-2 border-gray-400 p-8 mt-4 text-center text-gray-300 rounded-md cursor-pointer">
                                    <textarea onChange={(e) => setText(e.target.value)} value={text} name="generate" id="generate" className="w-full h-full text-black" />
                                </div>
                            )
                    }


                    {/* Show selected file */}
                    {selectedFile && (<div className="flex flex-row gap-x-10 items-center justify-center">

                        <p className="mt-2 text-sm text-gray-300">
                            Selected File: <span className="font-semibold">{selectedFile.name}</span>
                        </p>



                        <div className="flex flex-row gap-x-5 items-center justify-center">
                            <p>Select Language</p>
                            <input type="text" value={language} onChange={(e) => setLanguage(e.target.value)}
                                className="bg-transparent border-spacing-2 border-black"
                            />

                        </div>
                    </div>


                    )}

                    {
                        generate && (
                            <button onClick={handleGenerate} className="bg-gray-500 mt-2 px-4 py-2 rounded text-white">Click to Generate</button>
                        )
                    }


                    {/* Buttons */}
                    <div className="flex justify-between mt-4">
                        <button onClick={handleLegal} className="bg-black px-4 py-2 rounded text-white">Check Document</button>
                        <button onClick={handleSummarize} className="bg-black px-4 py-2 rounded text-white">Summarize</button>
                        <button onClick={handleTranslate} className="bg-black px-4 py-2 rounded text-white">Translate</button>
                        <button onClick={() => setGenerate(!generate)} className="bg-black px-4 py-2 rounded text-white">Generate Document</button>
                    </div>
                </div>

            }
            {/* Output Section */}
            <Translation translation={translation} />

            {/* History Section */}
            {/* <div className="bg-gray-600 text-white w-full max-w-4xl p-6 mt-6 rounded-xl">
                <h2 className="text-lg font-semibold">History</h2>
                <div className="bg-white text-black p-6 rounded mt-4 min-h-[100px]">
                    No history available.
                </div>
            </div> */}
            <History />




            {loading && (
                <div className=" absolute opacity-80 flex items-center justify-center w-full h-screen bg-gray-700">

                    <div role="status">
                        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;

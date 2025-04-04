const History = require("../models/history.model")
const fs = require("fs")
require("dotenv").config()

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });



exports.translate = async (req, res) => {
    // console.log("File------->", req.file)
    const uploadedFilePath = req.file.path; // Get path from multer

    const mimeType = req.file.mimetype;
    try {
        // 1. Prepare the file part for Gemini
        // Convert the buffer from multer into the format Gemini expects

        const { language, _id } = req.body

        if (!_id) {
            return res.status(404).json({
                success: false,
                message: "_id missing"
            })
        }
        console.log("ID------->", _id)
        console.log("file------->", req.file.originalname)
        console.log(`Reading file from disk: ${uploadedFilePath}`);
        const fileBuffer = fs.readFileSync(uploadedFilePath); // Use fs to read the file

        // *** STEP 2: Encode the buffer you just read ***
        const base64EncodedData = fileBuffer.toString('base64');

        // *** STEP 3: Use the encoded data for Gemini ***
        const pdfFilePart = {
            inlineData: {
                data: base64EncodedData, // Use the variable holding the base64 string
                mimeType: mimeType,      // Use the detected mimeType
            },
        };


        const prompt = `
        You are a professional document translator. 
        Identify the language and Translate the given document to ${language}, 
        The document can be a legal contract, a business proposal, or any other formal document.
        The translation should be accurate and maintain the original meaning, tone, and context of the document.
        The translation should be in a formal tone and should be suitable for professional use.
        The translation should be done in a way that is easy to read and understand, while still being faithful to the original text.
        
        The formating of the document should be in HTML format and give the proper HTML tags for the document.
        You can use HTML tags like <h1>, <h2>, <p>, <ul>, <li>, <table>, etc. to format the document.
        Use this tags wherever necessary to make the document more readable
        The document may contain tables, bullet points, and other formatting elements.
        Do not include any additional information or explanations.
        just provide the translated text.
                `;

        // 2. Construct the prompt parts array
        const parts = [
            pdfFilePart, // Send the PDF file data first
            { text: prompt },  // Then the text prompt
        ];

        console.log("Sending request to Gemini API...");



        // 3. Call the Gemini API


        const generationConfig = {
            temperature: 0.4, // Adjust creativity/randomness
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096, // Adjust as needed
        };


        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,

        });

        console.log("Received response from Gemini API.");

        // 4. Process and send the response back to the frontend
        const response = result.response.candidates?.[0]?.content?.parts?.[0]?.text
        console.log("Response------>", response)
        // res.render("recommendations", { response });

        const addHistory = await History.create({
            userId: _id,
            name: req.file.originalname,
            result: `${response}`,
            type: "translation",
        })


        return res.status(200).json({
            data: `${response}`,
            history: addHistory,
            message: "File processed successfully",
        })

    } catch (error) {
        console.error("Error during Gemini API call:", error);
        // Provide more specific error info if possible
        let errorMessage = 'An error occurred while processing the PDF.';
        if (error.message) {
            errorMessage += ` Details: ${error.message}`;
        }
        // Check if it's an API error response
        if (error.response && error.response.data) {
            console.error("API Error Details:", JSON.stringify(error.response.data, null, 2));
            errorMessage += ` API Error: ${JSON.stringify(error.response.data)}`;
        }
        res.status(500).json({ error: errorMessage });
    };
};



exports.summarize = async (req, res) => {
    // console.log("File------->", req.file)
    const uploadedFilePath = req.file.path; // Get path from multer

    const mimeType = req.file.mimetype;
    try {
        // 1. Prepare the file part for Gemini
        // Convert the buffer from multer into the format Gemini expects

        const { language, _id } = req.body



        console.log(`Reading file from disk: ${uploadedFilePath}`);
        const fileBuffer = fs.readFileSync(uploadedFilePath); // Use fs to read the file

        // *** STEP 2: Encode the buffer you just read ***
        const base64EncodedData = fileBuffer.toString('base64');

        // *** STEP 3: Use the encoded data for Gemini ***
        const pdfFilePart = {
            inlineData: {
                data: base64EncodedData, // Use the variable holding the base64 string
                mimeType: mimeType,      // Use the detected mimeType
            },
        };


        const prompt = `
        Generate an easy-to-understand small summary of the document in HTML format with proper semantic tags like <h1>, <h2>, <p>, <ul>, <li>, <table>, etc.,** for better readability. Ensure the formatting is well-structured and visually appealing without adding extra explanations or information. Exclude the <html> tag
                `;

        // 2. Construct the prompt parts array
        const parts = [
            pdfFilePart, // Send the PDF file data first
            { text: prompt },  // Then the text prompt
        ];

        console.log("Sending request to Gemini API...");



        // 3. Call the Gemini API


        const generationConfig = {
            temperature: 0.4, // Adjust creativity/randomness
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096, // Adjust as needed
        };


        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,

        });

        console.log("Received response from Gemini API.");

        // 4. Process and send the response back to the frontend
        const response = result.response.candidates?.[0]?.content?.parts?.[0]?.text
        console.log("Response------>", response)
        // res.render("recommendations", { response });

        const addHistory = await History.create({
            userId: _id,
            name: req.file.originalname,
            result: response,
            type: "summarization",
        })

        return res.status(200).json({
            data: `${response}`,
            history: addHistory,
            message: "File processed successfully",
        })

    } catch (error) {
        console.error("Error during Gemini API call:", error);
        // Provide more specific error info if possible
        let errorMessage = 'An error occurred while processing the PDF.';
        if (error.message) {
            errorMessage += ` Details: ${error.message}`;
        }
        // Check if it's an API error response
        if (error.response && error.response.data) {
            console.error("API Error Details:", JSON.stringify(error.response.data, null, 2));
            errorMessage += ` API Error: ${JSON.stringify(error.response.data)}`;
        }
        res.status(500).json({ error: errorMessage });
    };
};


exports.legal = async (req, res) => {
    // console.log("File------->", req.file)
    const uploadedFilePath = req.file.path; // Get path from multer

    const mimeType = req.file.mimetype;
    try {
        // 1. Prepare the file part for Gemini
        // Convert the buffer from multer into the format Gemini expects

        const { language, _id } = req.body



        console.log(`Reading file from disk: ${uploadedFilePath}`);
        const fileBuffer = fs.readFileSync(uploadedFilePath); // Use fs to read the file

        // *** STEP 2: Encode the buffer you just read ***
        const base64EncodedData = fileBuffer.toString('base64');

        // *** STEP 3: Use the encoded data for Gemini ***
        const pdfFilePart = {
            inlineData: {
                data: base64EncodedData, // Use the variable holding the base64 string
                mimeType: mimeType,      // Use the detected mimeType
            },
        };


        const prompt = `
        Analyze the uploaded PDF and determine if it is a legal document. 
        A legal document typically includes contracts, agreements, court filings, policies, 
        government regulations, legal notices, affidavits, or official legal forms. 
        Return only true if the document is legal, otherwise return false
        Do not include any additional information or explanations or \n.                `;

        // 2. Construct the prompt parts array
        const parts = [
            pdfFilePart, // Send the PDF file data first
            { text: prompt },  // Then the text prompt
        ];

        console.log("Sending request to Gemini API...");



        // 3. Call the Gemini API


        const generationConfig = {
            temperature: 0.4, // Adjust creativity/randomness
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096, // Adjust as needed
        };


        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,

        });

        console.log("Received response from Gemini API.");

        // 4. Process and send the response back to the frontend
        const response = result.response.candidates?.[0]?.content?.parts?.[0]?.text
        console.log("Response------>", response)
        // res.render("recommendations", { response });

        const addHistory = await History.create({
            userId: _id,
            name: req.file.originalname,
            result: response,
            type: "legal",
        })

        return res.status(200).json({
            data: `${response}`,
            history: addHistory,
            message: "File processed successfully",
        })

    } catch (error) {
        console.error("Error during Gemini API call:", error);
        // Provide more specific error info if possible
        let errorMessage = 'An error occurred while processing the PDF.';
        if (error.message) {
            errorMessage += ` Details: ${error.message}`;
        }
        // Check if it's an API error response
        if (error.response && error.response.data) {
            console.error("API Error Details:", JSON.stringify(error.response.data, null, 2));
            errorMessage += ` API Error: ${JSON.stringify(error.response.data)}`;
        }
        res.status(500).json({ error: errorMessage });
    };
};

exports.generateDocument = async (req, res) => {
    try {


        const { user_prompt, _id } = req.body

        console.log("ISinde generate document and user promt is ", user_prompt)
        const prompt = `
        Generate a well-structured document based on the following user input: [${user_prompt}]. 
        The document should be formatted professionally, using appropriate headings, bullet points, 
        and clear sections where necessary. Ensure that the content is informative, engaging, and 
        easy to read. Maintain a formal yet approachable tone, and provide relevant details, examples,
         or explanations based on the context of the input.
         
        The formating of the document should be in HTML format and give the proper HTML tags for the document.
        You can use HTML tags like <h1>, <h2>, <p>, <ul>, <li>, <table>, etc. to format the document.
        Use this tags wherever necessary to make the document more readable
        The document may contain tables, bullet points, and other formatting elements.
        Do not include any additional information or explanations. please do not include the`;

        // 2. Construct the prompt parts array
        const parts = [
            { text: prompt },  // Then the text prompt
        ];

        console.log("Sending request to Gemini API...");

        // 3. Call the Gemini API


        const generationConfig = {
            temperature: 0.4, // Adjust creativity/randomness
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096, // Adjust as needed
        };


        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
        });

        console.log("Received response from Gemini API.");

        // 4. Process and send the response back to the frontend
        const response = result.response.candidates?.[0]?.content?.parts?.[0]?.text
        console.log("Response------>", response)
        // res.render("recommendations", { response });
        const addHistory = await History.create({
            userId: _id,
            name: "Document Generation",
            result: response,
            type: "generation",
        })
        return res.status(200).json({
            data: `${response}`,
            history: addHistory,
            message: "File processed successfully",
        })

    } catch (error) {
        console.error("Error during Gemini API call:", error);
        // Provide more specific error info if possible
        let errorMessage = 'An error occurred while processing the PDF.';
        if (error.message) {
            errorMessage += ` Details: ${error.message}`;
        }
        // Check if it's an API error response
        if (error.response && error.response.data) {
            console.error("API Error Details:", JSON.stringify(error.response.data, null, 2));
            errorMessage += ` API Error: ${JSON.stringify(error.response.data)}`;
        }
        res.status(500).json({ error: errorMessage });
    };
};

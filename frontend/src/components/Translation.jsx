import React, { useRef } from "react";
// import { useTranslation } from "./TranslationContext";
import html2pdf from "html2pdf.js";

function Translation({ translation }) {
    // const { translation } = useTranslation();
    const translationRef = useRef(null);

    const handleDownloadPDF = () => {
        if (!translation) {
            alert("Cannot download an empty file.");
            return;
        }

        const element = translationRef.current;
        if (!element) return;

        // Check if element has meaningful content
        const textContent = element.innerText.trim();
        if (!textContent) {
            alert("Cannot download an empty file.");
            return;
        }

        // Dynamically generate filename (Example: using first 10 words)
        const firstFewWords = textContent.split(" ").slice(0, 5).join("_") || "translation";
        const timestamp = new Date().toISOString().replace(/[-:.]/g, ""); // YYYYMMDDTHHMMSS format
        const fileName = `${firstFewWords}_${timestamp}.pdf`; // Example: "Hello_World_20240404T123456.pdf"

        html2pdf()
            .from(element)
            .set({
                margin: [10, 10, 10, 10],
                filename: fileName,
                html2canvas: {
                    scale: 1,
                    useCORS: true,
                    scrollY: 0,
                },
                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait",
                },
            })
            .save();
    };




    return (
        <div className="bg-gray-600 text-white w-full max-w-4xl p-6 mt-6 rounded-xl ">
            <h2 className="text-lg font-semibold">Output</h2>

            {/* Output Box */}
            <div className="bg-white text-black p-6 rounded mt-4 min-h-[100px] max-h-[500px] overflow-scroll" ref={translationRef}>
                {translation ? (
                    <div dangerouslySetInnerHTML={{ __html: translation.replace(/```html/g, '').replace(/```/g, '') }} />
                ) : (
                    "Your processed output will appear here."
                )}
            </div>

            {/* Download Button */}
            <button onClick={handleDownloadPDF} className="bg-black px-4 py-2 rounded text-white mt-4">
                Download Output
            </button>
        </div>
    );
}

export default Translation;

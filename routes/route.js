const expres = require("express")
const router = expres.Router();

const path = require("path");
const multer = require("multer")
const fs = require("fs");
const { translate, summarize, legal, generateDocument } = require("../controllers/generate");
const { getUserHistory } = require("../controllers/history");



const UPLOAD_DIRECTORY = './uploads/'; // Define your upload directory



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure the upload directory exists
        fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true }); // Create directory if it doesn't exist
        cb(null, UPLOAD_DIRECTORY); // Tell multer to save files here
    },
    filename: function (req, file, cb) {
        // Create a unique filename to avoid collisions and potential security issues
        // Example: fieldname-timestamp-random-extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
        // Alternative (simpler, but slightly higher collision risk):
        // cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage, // Use diskStorage configuration
    limits: { fileSize: 50 * 1024 * 1024 }, // Example: Increased 50MB limit for disk storage
    fileFilter: (req, file, cb) => {
        // console.log("File -------->", file)
        if (file.mimetype === 'application/pdf') {
            // console.log("Inside multer")
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
        }
    }
});



router.post("/translate", upload.single('pdfFile'), translate);



router.post("/summarize", upload.single('pdfFile'), summarize);


router.post("/check_legal", upload.single('pdfFile'), legal);

router.post("/generate-document", generateDocument);
router.get("/history/:userId", getUserHistory)



module.exports = router
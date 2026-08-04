const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");

const convertPDFToImages = require("../utils/pdfToImages");


const router = express.Router();



const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/");

    },


    filename: (req, file, cb) => {


        const filename =
            Date.now() + "-" + file.originalname;


        cb(null, filename);

    }

});


const upload = multer({ storage });



router.post("/", upload.single("file"), async (req, res) => {


    try {


        if (!req.file) {


            return res.status(400).json({

                message: "No file uploaded"

            });


        }



        console.log(

            "Processing:",
            req.file.filename

        );



        let images = [];



        if (req.file.mimetype === "application/pdf") {


            console.log("PDF detected");


            images = await convertPDFToImages(

                req.file.path

            );


        } else {


            console.log("Image detected");


            images.push(

                req.file.path

            );


        }



        let extractedText = "";



        for (const image of images) {


            console.log(

                "OCR reading:",
                image

            );


            const result = await Tesseract.recognize(

                image,

                "eng",

                {

                    logger: info => {


                        if(info.status === "recognizing text") {


                            console.log(

                                Math.round(info.progress * 100) + "%"

                            );


                        }


                    }

                }

            );



            extractedText +=

                result.data.text +

                "\n\n";


        }



        res.json({

            message: "OCR completed",

            text: extractedText

        });



    } catch(error) {


        console.error(

            "OCR ERROR:",

            error

        );


        res.status(500).json({

            message: "OCR failed",

            error: error.message

        });


    }


});



module.exports = router;
const express = require("express");
const multer = require("multer");

const {
    extractTextFromFile
} = require("../services/ocrService");

const router = express.Router();


const storage =
    multer.diskStorage({

        destination: (
            req,
            file,
            cb
        ) => {

            cb(
                null,
                "uploads/"
            );

        },


        filename: (
            req,
            file,
            cb
        ) => {

            const filename =
                Date.now() +
                "-" +
                file.originalname;

            cb(
                null,
                filename
            );

        }

    });


const upload =
    multer({
        storage
    });


router.post(
    "/",
    upload.single("file"),
    async (
        req,
        res
    ) => {

        try {

            if (!req.file) {

                return res.status(400).json({

                    message:
                        "No file uploaded"

                });

            }


            const text =
                await extractTextFromFile(
                    req.file
                );


            return res.json({

                message:
                    "OCR completed",

                text

            });

        }

        catch (error) {

            console.error(
                "OCR ERROR:",
                error
            );


            return res.status(500).json({

                message:
                    "OCR failed",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;
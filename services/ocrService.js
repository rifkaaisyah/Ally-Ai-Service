const Tesseract = require("tesseract.js");

const convertPDFToImages = require("../utils/pdfToImages");

async function extractTextFromFile(file) {

    if (!file) {
        throw new Error("File is required");
    }

    console.log(
        "OCR processing:",
        file.filename
    );

    let images = [];

    /*
    -----------------------------------------
    PDF
    -----------------------------------------
    */

    if (
        file.mimetype === "application/pdf"
    ) {

        console.log(
            "PDF detected"
        );

        images =
            await convertPDFToImages(
                file.path
            );

    }

    /*
    -----------------------------------------
    Image
    -----------------------------------------
    */

    else if (
        file.mimetype.startsWith("image/")
    ) {

        console.log(
            "Image detected"
        );

        images.push(
            file.path
        );

    }

    else {

        throw new Error(
            "Unsupported file type for OCR"
        );

    }


    let extractedText = "";


    /*
    -----------------------------------------
    OCR each image
    -----------------------------------------
    */

    for (
        const image
        of images
    ) {

        console.log(
            "OCR reading:",
            image
        );


        const result =
            await Tesseract.recognize(

                image,

                "eng",

                {

                    logger: info => {

                        if (
                            info.status ===
                            "recognizing text"
                        ) {

                            console.log(

                                Math.round(
                                    info.progress * 100
                                ) + "%"

                            );

                        }

                    }

                }

            );


        extractedText +=
            result.data.text +
            "\n\n";

    }


    return extractedText.trim();

}


module.exports = {
    extractTextFromFile
};
const fs = require("fs");
const path = require("path");

const { createCanvas } = require("canvas");
let pdfjsLib;

async function convertPDFToImages(pdfPath) {
    if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
}
    const outputFolder = "./converted";


    // Create converted folder if missing
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
    }


const pdfBuffer = fs.readFileSync(pdfPath);

const pdfData = new Uint8Array(pdfBuffer);


const pdf = await pdfjsLib.getDocument({

    data: pdfData

}).promise;



    const imagePaths = [];



    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {


        console.log(
            `Converting PDF page ${pageNumber}/${pdf.numPages}`
        );


        const page = await pdf.getPage(pageNumber);



        const viewport = page.getViewport({

            scale: 2

        });



        const canvas = createCanvas(

            viewport.width,

            viewport.height

        );


        const context = canvas.getContext("2d");



        await page.render({

            canvasContext: context,

            viewport: viewport

        }).promise;



        const imagePath = path.join(

            outputFolder,

            `page-${pageNumber}.png`

        );



        const buffer = canvas.toBuffer("image/png");

        fs.writeFileSync(

            imagePath,

            buffer

        );



        imagePaths.push(imagePath);


    }


    return imagePaths;

}


module.exports = convertPDFToImages;
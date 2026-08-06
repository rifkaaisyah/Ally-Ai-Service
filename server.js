const express = require("express");
const cors = require("cors");
require("dotenv").config();

const essayRoute = require("./routes/essay");
const ocrRoute = require("./routes/ocr");
const assessmentRoute = require("./routes/assessment");
const deepAssessmentRoute = require("./routes/deepAssessmentRoute");

const app = express();


app.use(cors());

app.use(express.json());


app.get("/", (req,res)=>{

    res.json({

        message:"Ally AI Service Running"

    });

});


app.use("/api/essay", essayRoute);

app.use("/api/ocr", ocrRoute);

app.use("/api/assessment", assessmentRoute);
app.use("/api/assessment", deepAssessmentRoute);


const PORT = process.env.PORT || 3001;


app.listen(PORT, ()=>{

    console.log(
        `AI Service running on port ${PORT}`
    );

});
const express = require("express");

const router = express.Router();

const {
    getScholarshipRecommendation
} = require("../rag/ragService");


router.post("/recommend", async (req, res)=>{

    try {

        const {
            profile
        } = req.body;


        if(!profile){

            return res.status(400).json({

                status:"error",

                message:
                "Student profile is required"

            });

        }


        const result =
            await getScholarshipRecommendation(
                profile
            );


        return res.json({

            status:"success",

            message:
            "Scholarship recommendation generated successfully",

            data: result

        });


    }
    catch(error){

        console.error(
            "Scholarship Recommendation Error:",
            error
        );


        return res.status(500).json({

            status:"error",

            message:error.message

        });

    }

});


module.exports = router;
const express = require("express");

const router = express.Router();

const {
    matchMentor
} = require("../services/mentorMatchingService");

const mentors =
    require("../data/journeys/mentors.json");


// POST /api/mentor/match
router.post("/match", (req, res) => {

    try {

        const profile =
            req.body.profile || req.body;

        const mentor =
            matchMentor(
                profile,
                mentors
            );

        if (!mentor) {

            return res.status(404).json({
                status: "error",
                message: "No mentor found"
            });

        }

        return res.json({
            status: "success",
            mentor: {
                id: mentor.id,
                name: mentor.name,
                scholarships: mentor.scholarships || [],
                study_country:
                    mentor.study_country || null,
                bio: mentor.bio || ""
            }
        });

    } catch (error) {

        console.error(
            "Mentor matching error:",
            error
        );

        return res.status(500).json({
            status: "error",
            message: error.message
        });

    }

});

module.exports = router;
const fs = require("fs");
const path = require("path");


/*
 * Directory where student journeys are stored.
 */

const JOURNEY_DIRECTORY =
    path.join(
        __dirname,
        "..",
        "data",
        "journeys"
    );


/*
 * Make sure the directory exists.
 */

function ensureDirectory() {

    if (!fs.existsSync(JOURNEY_DIRECTORY)) {

        fs.mkdirSync(
            JOURNEY_DIRECTORY,
            {
                recursive: true
            }
        );

    }

}


/*
 * Build the file path for one student.
 */

function getJourneyPath(studentId) {

    if (!studentId) {

        throw new Error(
            "studentId is required"
        );

    }

    ensureDirectory();

    return path.join(
        JOURNEY_DIRECTORY,
        `${studentId}.json`
    );

}


/*
 * Save a student's journey.
 */

function saveJourney(
    studentId,
    journey
) {

    if (!journey) {

        throw new Error(
            "Journey is required"
        );

    }

    const filePath =
        getJourneyPath(
            studentId
        );

    fs.writeFileSync(

        filePath,

        JSON.stringify(
            journey,
            null,
            2
        ),

        "utf8"

    );

    return journey;

}


/*
 * Load a student's journey.
 */

function loadJourney(
    studentId
) {

    const filePath =
        getJourneyPath(
            studentId
        );


    if (!fs.existsSync(filePath)) {

        return null;

    }


    const data =
        fs.readFileSync(
            filePath,
            "utf8"
        );


    return JSON.parse(
        data
    );

}


/*
 * Check whether a student already
 * has a saved journey.
 */

function journeyExists(
    studentId
) {

    const filePath =
        getJourneyPath(
            studentId
        );


    return fs.existsSync(
        filePath
    );

}


module.exports = {

    saveJourney,

    loadJourney,

    journeyExists

};
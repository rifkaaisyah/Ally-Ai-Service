const assessmentConfig = require("./assessmentConfig");


function calculateCategoryScore(category, answers) {

    const categoryConfig = assessmentConfig[category];

    let score = 0;


    for (const question in categoryConfig.questions) {

        const userAnswer = answers[question];


        if (!userAnswer) {
            continue;
        }


        const points =
            categoryConfig.questions[question][userAnswer];


        if (points !== undefined) {
            score += points;
        }

    }


    return score;

}



function determineReadinessLevel(percentage) {

    if (percentage >= 90) {

        return "Excellent Preparation";

    }


    if (percentage >= 70) {

        return "Strong Foundation";

    }


    if (percentage >= 50) {

        return "Needs Development";

    }


    return "Early Preparation";

}



function calculateReadiness(answers) {


    const result = {

        readiness_percentage: 0,

        readiness_level: "",

        categories: {},

        strengths: [],

        improvements: []

    };


    let totalScore = 0;



    for (const category in assessmentConfig) {


        const categoryScore =
            calculateCategoryScore(
                category,
                answers
            );


        result.categories[category] = categoryScore;


        totalScore += categoryScore;

    }



    result.readiness_percentage = totalScore;


    result.readiness_level =
        determineReadinessLevel(
            result.readiness_percentage
        );



    generateFeedback(result);



    return result;

}



function generateFeedback(result) {


    if (result.categories.academic >= 15) {

        result.strengths.push(
            "Strong academic foundation"
        );

    } else {

        result.improvements.push(
            "Improve academic preparation"
        );

    }



    if (result.categories.leadership >= 15) {

        result.strengths.push(
            "Strong leadership and impact experience"
        );

    } else {

        result.improvements.push(
            "Build leadership and community impact experience"
        );

    }



    if (result.categories.english >= 10) {

        result.strengths.push(
            "Good English preparation"
        );

    } else {

        result.improvements.push(
            "Improve English proficiency preparation"
        );

    }



    if (result.categories.application < 10) {

        result.improvements.push(
            "Improve CV and scholarship application materials"
        );

    }


}



module.exports = {

    calculateReadiness

};
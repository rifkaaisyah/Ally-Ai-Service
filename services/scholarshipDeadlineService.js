const {
    parseDeadline
} = require("./deadlineService");


function attachDeadlineInformation(
    scholarships,
    today = new Date()
) {

    if (!Array.isArray(scholarships)) {
        return [];
    }

    return scholarships.map(
        scholarship => {

            const applicationPeriod =
                scholarship?.deadline?.application_period || "";

            const deadline =
                parseDeadline(
                    applicationPeriod,
                    today
                );

            return {
                ...scholarship,

                deadlineInfo:
                    deadline
            };
        }
    );
}


module.exports = {
    attachDeadlineInformation
};
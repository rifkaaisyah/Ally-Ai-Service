async function testScholarshipAPI(){

    try{

        const response =
        await fetch(
            "http://localhost:3001/api/scholarship/recommend",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    profile:{

                        student_profile:{

                            academic:{
                                study_direction:"Artificial Intelligence"
                            },

                            leadership:{
                                experience:[
                                    "Student Organization"
                                ],

                                impact:
                                "Led 20 members"
                            },

                            career:{
                                contribution_area:
                                "Artificial Intelligence"
                            },

                            scholarship_preferences:{
                                target_countries:[
                                    "Japan",
                                    "Germany"
                                ]
                            }

                        }

                    }

                })

            }
        );


        const result =
        await response.json();


        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );


    }
    catch(error){

        console.error(
            error.message
        );

    }

}


testScholarshipAPI();
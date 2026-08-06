function generateRoadmap(
    profile,
    scholarships
){

const roadmap=[];


if(
 profile.academic?.academic_experiences
 .includes("research_experience")
){

roadmap.push({

month:1,

title:"Strengthen Research Profile",

tasks:[

"Organize research portfolio",

"Prepare research proposal",

"Highlight publications and academic achievements"

]

});

}


if(
profile.leadership
){

roadmap.push({

month:2,

title:"Build Leadership Evidence",

tasks:[

"Document leadership activities",

"Collect impact measurements",

"Prepare leadership stories for essays"

]

});

}


roadmap.push({

month:3,

title:"Scholarship Application Preparation",

tasks:

scholarships.map(
s =>
`Prepare application strategy for ${s.metadata.name}`
)

});


return roadmap;

}


module.exports={
generateRoadmap
}

module.exports = {

    generateRoadmap

};
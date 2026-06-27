export function retrieveKnowledge(
  lessonData:any,
  count:number
){

let facts=lessonData.kienThucChinh;

if(count<=10){

facts=facts.slice(0,3);

}

else if(count<=20){

facts=facts.slice(0,5);

}

return{

lesson:lessonData.tenBai,

keywords:lessonData.tuKhoa,

facts

};

}
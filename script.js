function startSurvey(){document.getElementById('survey').classList.remove('hidden');}
function generateReview(){
 let checks=[...document.querySelectorAll('input[type=checkbox]:checked')].map(c=>c.value).join('、');
 let improve=document.getElementById('improve').value;
 let text=`本日はありがとうございました。${checks}が特に良く、施術後はとてもリラックスできました。${improve? "改善点:"+improve:""} また伺いたいです。`;
 document.getElementById('reviewText').innerText=text;
 document.getElementById('result').classList.remove('hidden');
}
function copyText(){
 navigator.clipboard.writeText(document.getElementById('reviewText').innerText);
}
let config = {};

config.participants = {};

config.participants[0]="POOJA";
config.participants[1]="SUMANTH";
config.participants[2]="SHRINIWAS";
config.participants[3]="MONIKA";
config.participants[4]="DEEPALI";

var from,to;
function fun(){
document.getElementById("one").innerText=config.participants[0];
document.getElementById("two").innerText=config.participants[1];
document.getElementById("three").innerText=config.participants[2];
document.getElementById("four").innerText=config.participants[3];
document.getElementById("five").innerText=config.participants[4];
}

function fun1(event){

if(event=="one"){
document.getElementById("two2").innerText=config.participants[1];
document.getElementById("three3").innerText=config.participants[2];
document.getElementById("four4").innerText=config.participants[3];
document.getElementById("five5").innerText=config.participants[4];
}
if(event=="two"){
document.getElementById("two2").innerText=config.participants[0];
document.getElementById("three3").innerText=config.participants[2];
document.getElementById("four4").innerText=config.participants[3];
document.getElementById("five5").innerText=config.participants[4];
}
if(event=="three"){
document.getElementById("two2").innerText=config.participants[0];
document.getElementById("three3").innerText=config.participants[1];
document.getElementById("four4").innerText=config.participants[3];
document.getElementById("five5").innerText=config.participants[4];
}
if(event=="four"){
document.getElementById("two2").innerText=config.participants[0];
document.getElementById("three3").innerText=config.participants[1];
document.getElementById("four4").innerText=config.participants[2];
document.getElementById("five5").innerText=config.participants[4];
}
if(event=="five"){
document.getElementById("two2").innerText=config.participants[0];
document.getElementById("three3").innerText=config.participants[1];
document.getElementById("four4").innerText=config.participants[2];
document.getElementById("five5").innerText=config.participants[3];
}
}


function fun2(event){
document.getElementById("owner").innerText=document.getElementById(event).innerText;
from=document.getElementById(event).innerText;
fun1(event);
}

function fun3(event){
to=document.getElementById(event).innerText;
document.getElementById("buyer").innerText=document.getElementById(event).innerText;
}

function fun4()
{
alert('Transfer from '+from+' to '+to);
}
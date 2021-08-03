const electron = require('electron');
const {ipcRenderer} = electron;
let literallyeverything;

window.onload = () =>{
    console.log("yes");
    ipcRenderer.send("getCSV");
}

ipcRenderer.on("giveCSV", (e, item)=>{
    literallyeverything = item;
})

function searcheverything(){
    const query = document.querySelector('#search').value;
    const results = document.querySelector('#results');
    let indexesincluded=[];
    results.innerHTML="";
    if (query.length == 1){
        for (var i=0; i<literallyeverything.length ;i++){
            if (literallyeverything[i]['title'].substring(0,1).toUpperCase()==query.toUpperCase()){
                listStuff(i);
            }
        }
    } else if (query.length>1){
        for (var i=0; i<literallyeverything.length ;i++){
            if (literallyeverything[i]['title'].toUpperCase().includes(query.toUpperCase()) && !(indexesincluded.includes(literallyeverything[i]['title']))){
                listStuff(i);
                indexesincluded.push(literallyeverything[i]['title']);
            } else if (literallyeverything[i]['content'].toUpperCase().includes(query.toUpperCase()) && !(indexesincluded.includes(literallyeverything[i]['title']))){
                listStuff(i);
                indexesincluded.push(literallyeverything[i]['title']);
            }
        }
    } else {
        results.innerHTML="";
    }
}

function listStuff(index){
    const results = document.querySelector('#results');
    var title = document.createElement("button");
    title.innerHTML=literallyeverything[index]['title'];
    title.classList.add("btn","mt-2","bg-secondary","text-light");
    title.setAttribute("onclick","showContent("+index+")")
    results.appendChild(title);
    results.innerHTML+="<br>";
}

function showContent(index){
    const results = document.querySelector('#results');
    results.innerHTML="";
    results.innerHTML+="<button class='btn mt-2 bg-secondary text-light' onclick='searcheverything()'>Back</button><br>";
    results.innerHTML+="<h1>"+literallyeverything[index]['title']+"</h1>"
    results.innerHTML+="<p>"+literallyeverything[index]['content']+"</p>"
}
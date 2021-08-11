const electron = require('electron');
const {ipcRenderer} = electron;
let literallyeverything;

window.onload = () =>{
    ipcRenderer.send("getListOfCSVs");
}

ipcRenderer.on("giveCSV", (e, item)=>{
    literallyeverything = item;
    document.querySelector("#search").disabled = false;
    document.querySelector("#results").innerHTML = "<i>Type something in the search box! Results will appear here.</i>";
})

ipcRenderer.on("giveListOfCSVs", (e, item)=>{
    for (var i=0; i<item.length; i++) {
        let element = document.createElement("option");
        element.value=item[i].substring(0,item[i].length-4);
        element.innerHTML=element.value;
        document.querySelector("#listOfFiles").appendChild(element);
    }
})

function getData(){
    document.querySelector("#results").innerHTML = "<i>Retrieving data...</i>";
    const filename = document.querySelector("#selectListOfFiles").value;
    ipcRenderer.send("getCSV",filename);
    if (localStorage.getItem("search")!==""){
        document.querySelector('#search').value=localStorage.getItem("search");
        setTimeout(function(){searcheverything()},100);
    }
}

function searcheverything(){
    const query = document.querySelector('#search').value;
    const results = document.querySelector('#results');
    localStorage.setItem("search",query);
    let indexesincluded=[];
    results.innerHTML="";
    if (query.length == 1){
        for (var i=0; i<literallyeverything.length ;i++){
            if (literallyeverything[i]['title'].substring(0,1).toUpperCase()==query.toUpperCase()){
                listStuff(i);
                indexesincluded.push(0)
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
    }
    if (indexesincluded.length<1){
        if (query.length>0){
            results.innerHTML="<p class='m-2'><i>We couldn't find anything... =(</i></p>"
        } else {
            results.innerHTML="<p class='m-2'><i>Results will appear here.</i></p>"
        }
    }
}

function listStuff(index){
    const results = document.querySelector('#results');
    var title = document.createElement("button");
    title.innerHTML=literallyeverything[index]['title'];
    title.classList.add("btn","mt-3","bg-secondary","text-light");
    title.setAttribute("onclick","showContent("+index+")")
    results.appendChild(title);
    results.innerHTML+="<br>";
}

function showContent(index){
    const results = document.querySelector('#results');
    results.innerHTML="";
    results.innerHTML+="<button class='btn my-3 bg-primary text-light' onclick='searcheverything()'>Back</button><br>";
    if (literallyeverything[index]['content'].startsWith("REDIRECT")){
        results.innerHTML+="<p class='mt-2'><i>Redirected from "+literallyeverything[index]['title']+"</i><p>";
        for (var i=0; i<literallyeverything.length ;i++){
            if (literallyeverything[i]['title'].toUpperCase().includes(literallyeverything[index]['content'].split(",")[1].toUpperCase())){
                index = i;
                break;
            }
        }
    }
    results.innerHTML+="<h1>"+literallyeverything[index]['title']+"</h1>"
    results.innerHTML+="<p>"+literallyeverything[index]['content']+"</p>"
}
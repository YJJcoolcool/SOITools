const electron = require('electron');
const {ipcRenderer} = electron;

window.onload = ()=>{
    let settingsList = ['autoUpdate']
    for (let i=0; i<settingsList.length; i++){
        console.log(settingsList[i]+" "+localStorage.getItem(settingsList[i]))
        if (localStorage.getItem(settingsList[i])=="true"){
            document.getElementById(settingsList[i]).checked = true
        } else if (localStorage.getItem(settingsList[i])=="false"){
            document.getElementById(settingsList[i]).checked = false
        } else {
            document.getElementById(settingsList[i]).value = localStorage.getItem(settingsList[i])
        }
    }
}

function updateSettings(id, value){
    localStorage.setItem(id, value)
    console.log(id+" "+localStorage.getItem(id))
}

function checkForUpdates(){
    $.ajax({
        type: "GET",
        url: "https://yjjcoolcool.github.io/SOITools/version.json",
        dataType: "JSON",
        success: function (response) {
            $.getJSON(__dirname+"\\version.json", function(json) {
                compareVer(json,response[0]['literallyeverything'])
            });
        },
        error: function (obj, textStatus, errorThrown) {
            console.log("Error "+textStatus+": "+errorThrown);
        }
    });
}

function compareVer(json,response){
    let localver = json[0]['literallyeverything'];
    let needToUpdate = []
    for (let i=0; i<localver.length; i++){
        for (let j=0; j<response.length; j++){
            if (localver[i][0]==response[j][0]){
                if (localver[i][1]!=response[j][1]){
                    needToUpdate.push(localver[i][0]+".csv")
                }
            }
        }
    }
    for (let i=0; i<needToUpdate.length; i++){
        ipcRenderer.send("updateModule",needToUpdate[i]);
    }
}
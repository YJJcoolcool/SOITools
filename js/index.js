$(document).ready(()=> {
    checkForUpdates()
    // if (localStorage.getItem("checkForUpdatesAutomatically")){
    //     checkForUpdates()
    // };
})

function checkForUpdates(){
    $.ajax({
        type: "GET",
        url: "https://yjjcoolcool.github.io/SOITools/version.json",
        dataType: "JSON",
        success: function (response) {
            console.log(response)
        },
        error: function (obj, textStatus, errorThrown) {
            console.log("Error "+textStatus+": "+errorThrown);
        }
    });
}

function checkvalidip(id){
    if (document.getElementById(id).value>255){
        document.getElementById(id).value=255;
    }
    if (document.getElementById(id).value.length>=3 && id!='ip4'){
        document.getElementById(id.substr(0,2)+(parseInt(id.substr(2,3))+1)).focus();
        document.getElementById(id.substr(0,2)+(parseInt(id.substr(2,3))+1)).select();
    }
    checkipclass();
}

function checkipclass(){
    const ip1 = document.getElementById('ip1').value;
    if (ip1<127){
        classtype.innerText="Class A Address";
        document.getElementById('slider').value=8;
        maskbits(8);
    } else if (ip1==127){
        classtype.innerText="Loopback Address";
        document.getElementById('slider').value=16;
        maskbits(16);
    } else if (ip1<=191){
        classtype.innerText="Class B Address";
        document.getElementById('slider').value=16;
        maskbits(16);
    } else if (ip1<=223){
        classtype.innerText="Class C Address";
        document.getElementById('slider').value=24;
        maskbits(24);
    } else {
        classtype.innerText="Invalid IP Address";
        document.getElementById('slider').value=24;
        maskbits(24);
    }
}

function maskbits(bits){
    const groups = Math.floor(bits/8);
    const remainder = bits%8;
    const groupbits = ['','128.','192.','224.','240.','248.','252.','254.']
    const classtype = document.getElementById('classtype');
    const subnetmode = document.getElementById('subnetmode');
    const subnetbits = document.getElementById('subnetbits');
    const maxsubnets = document.getElementById('maxsubnets');
    const hostbits = document.getElementById('hostbits');
    const maxhosts = document.getElementById('maxhosts');

    document.getElementById('maskbits').innerText="Mask Bits: "+bits;
    var pass=false;
    subnetmode.innerText="Subnetting"
    if (classtype.innerText=="Class A Address"){
        if (bits>=8){
            subnetbits.innerText="Subnet Bits: "+(bits-8);
            maxsubnets.innerText="Max Subnets: "+(2**(bits-8));
            pass=true;
        }
    } else if (classtype.innerText=="Class B Address"){
        if (bits>=16){
            subnetbits.innerText="Subnet Bits: "+(bits-16);
            maxsubnets.innerText="Max Subnets: "+(2**(bits-16));
            pass=true;
        }
    } else if (classtype.innerText=="Class C Address"){
        if (bits>=24){
            subnetbits.innerText="Subnet Bits: "+(bits-24);
            maxsubnets.innerText="Max Subnets: "+(2**(bits-24));
            hostbits.innerText="Host Bits: "+(8-(bits-24));
            ((2**(8-(bits-24))-2)<0) ? maxhosts.innerText="Max Hosts: 0" : maxhosts.innerText="Max Hosts: "+(2**(8-(bits-24))-2);
            if (bits>30) subnetmode.innerText="Mask too long, no hosts.";
            else if (bits>24) subnetmode.innerText="Warning! Subnet - All 0's";
            pass=true;
        }
    }
    if (!pass) {
        subnetbits.innerText="Subnet Bits: -";
        maxsubnets.innerText="Max Subnets: -";
        hostbits.innerText="Host Bits: -";
        maxhosts.innerText="Max Hosts: -";
        subnetmode.innerText="Supernetting";
    }
    var final = "255.".repeat(groups)+groupbits[remainder];
    (remainder==0) ? final+="0.".repeat(4-groups) : final+="0.".repeat(3-groups);
    document.getElementById('wildcard').innerText=final.substr(0,final.length-1);
    document.getElementById('subnetmask').innerText="Subnet Mask: "+final.substr(0,final.length-1);
    updatehostrange(final.substr(0,final.length-1));
}

function updatehostrange(subnetmask){
    const ip1 = document.getElementById('ip1').value;
    const ip2 = document.getElementById('ip2').value;
    const ip3 = document.getElementById('ip3').value;
    const ip4 = document.getElementById('ip4').value;
    splitsubnetmask = subnetmask.split(".");
    var final = "";
    if (splitsubnetmask[0]=="255") {
        final+=ip1+".";
        if (splitsubnetmask[1]=="255") {
            final+=ip2+".";
            if (splitsubnetmask[2]=="255") {
                final+=ip3+".";
                if (splitsubnetmask[3]=="255") {
                    final+=ip4;
                } else {

                }
            }
        }
    }
    document.getElementById('hostrange').value=final;
}
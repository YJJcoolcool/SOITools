function checkvalidip(id){
    const ip1 = document.getElementById('ip1').value;
    const classtype = document.getElementById('classtype');

    if (document.getElementById(id).value>255){
        document.getElementById(id).value=255;
    }
    if (document.getElementById(id).value.length>=3 && id!='ip4'){
        document.getElementById(id.substr(0,2)+(parseInt(id.substr(2,3))+1)).focus();
        document.getElementById(id.substr(0,2)+(parseInt(id.substr(2,3))+1)).select();
    }
    if (ip1<127){
        classtype.innerText="Class A Address";
    } else if (ip1==127){
        classtype.innerText="Loopback Address";
    } else if (ip1<191){
        classtype.innerText="Class B Address";
    } else if (ip1<223){
        classtype.innerText="Class C Address";
    } else {
        classtype.innerText="Invalid IP Address";
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
            if (bits>31) subnetmode.innerText="Mask too long, no hosts.";
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

}
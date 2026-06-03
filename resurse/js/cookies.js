

//setCookie("a",10, 1000)
function setCookie(nume, val, timpExpirare){//timpExpirare in milisecunde
    d=new Date();
    d.setTime(d.getTime()+timpExpirare)
    document.cookie=`${nume}=${val}; expires=${d.toUTCString()}`;
}

function getCookie(nume){

    if (!document.cookie.includes("acceptat_banner=true")) {
        return null;
    }

    vectorParametri=document.cookie.split(";") // ["a=10","b=ceva"]
    for(let param of vectorParametri){
        if (param.trim().startsWith(nume+"="))
            return param.split("=")[1]
    }
    return null;
}

function deleteCookie(nume){
    console.log(`${nume}; expires=${(new Date()).toUTCString()}`)
    document.cookie=`${nume}=0; expires=${(new Date()).toUTCString()}`;
}

function deleteAllCookies() {
    let cookies = document.cookie.split(";");

    for (let c of cookies) {
        let eqPos = c.indexOf("=");
        let name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}



window.addEventListener("load", function(){
    let banner = document.getElementById("animatie-banner");
    let btn = document.getElementById("ok_cookies");

    if (!banner || !btn) return;

    if (getCookie("acceptat_banner")) {
        banner.style.display = "none";
    } else {
        banner.style.display = "flex"; // pornește animația
    }

    btn.onclick = function () {
        setCookie("acceptat_banner", true, 24 * 60 * 60 * 1000); // 1 zi
        banner.style.display = "none";
    };
});






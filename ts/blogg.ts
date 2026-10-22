export {}; //ger scriptet ett eget scope

const loginStatus = document.getElementById("userStatus");
const logOutBtn = document.querySelector<HTMLButtonElement>("#logOut");
const logInLink = document.querySelector<HTMLAnchorElement>("#logIn"); //Länk till inloggningssidan

function init(): void{
    showStatus();
    logOut();
    
}

function showStatus(){
    if(!loginStatus || !logOutBtn || !logInLink) return;

    let loggedIn = localStorage.getItem("loggedIn");
    if(loggedIn === "true"){
        loginStatus.textContent = "Du är inloggad.";
        logInLink.style.display = "none";
    } else{
        loginStatus.textContent = "Du är inte inloggad.";
        logOutBtn.style.display = "none";
        logInLink.style.display = "block";
    }
}

//Uppdaterar Localstorage ifall Logga ut knappen används.
function logOut(){
    if(!logOutBtn) return;
    logOutBtn.addEventListener("click", event =>{
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userName");
        showStatus();
    })
}

init();
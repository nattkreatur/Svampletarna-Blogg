//Inloggningsuppgifter
const namn = "Kalle";
const lösenord = "qwe123";
const logOutBtn = document.querySelector("#logOut"); //HTML-angivelse för att TS också behöver veta att det är en Button.
const userStatus = document.getElementById("userStatus");
const error = document.getElementById("error");
const formRef = document.querySelector("form");
function init() {
    //Kontrollerar så att formulär faktiskt finns annars klagar TS
    if (formRef) {
        formRef.addEventListener("submit", event => {
            event.preventDefault(); //stoppar inbyggd formulärhantering
            logIn();
            checkifLoggedIn();
        });
    }
    logOut();
    checkifLoggedIn();
}
//Uppdaterar Localstorage ifall Logga ut knappen används.
function logOut() {
    if (!logOutBtn)
        return;
    logOutBtn.addEventListener("click", event => {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userName");
        checkifLoggedIn();
    });
}
//Kollar om användare har skrivit rätt namn och lösenord. Uppdaterar isåfall localStorage.
function logIn() {
    if (!formRef)
        return; //om form existerar så fortsätt
    if (!error)
        return;
    const userInput = (formRef.elements.namedItem("user"));
    const passwordInput = (formRef.elements.namedItem("pwd"));
    //Kontrollerar att båda fälten är INPUT-fält innan de används.
    if (!(userInput instanceof HTMLInputElement) ||
        !(passwordInput instanceof HTMLInputElement))
        return;
    //Här kontrolleras värdet/value av inputfälten
    if (userInput.value === namn && passwordInput.value === lösenord) {
        //Uppdaterar local storage vid lyckad inloggning
        localStorage.setItem("loggedIn", "true"); //sparar generell status för om man är inloggad eller ej, underlättar kontroll
        localStorage.setItem("userName", namn); //sparar användarnamnet i Localstorage
        error.style.display = "none";
        formRef.reset(); //tömmer bara formuläret vid lyckade inloggningar
    }
    else {
        error.textContent = "Felaktiga inloggningsuppgifter!";
        error.style.display = "block";
    }
}
//Tittar i localStorage och manipulerar HTML-element beroende på om user är inloggad eller inte
function checkifLoggedIn() {
    if (!formRef || !userStatus || !logOutBtn || !error)
        return;
    let loggedIn = localStorage.getItem("loggedIn");
    let user = localStorage.getItem("userName"); //hämtar användarnamn
    if (loggedIn === "true") {
        formRef.style.display = "none";
        userStatus.style.display = "block";
        userStatus.textContent = "Välkommen " + user + ", du är nu inloggad.";
        logOutBtn.style.display = "block";
    }
    else {
        formRef.style.display = "block";
        logOutBtn.style.display = "none";
        userStatus.style.display = "none";
        error.style.display = "block"; //visar inloggadstatus
    }
}
init();
export {};

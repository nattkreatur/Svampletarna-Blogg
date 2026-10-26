const loginStatus = document.getElementById("userStatus");
const createBlogPost = document.getElementById("createBlogPost");
const logOutBtn = document.querySelector("#logOut");
const logInLink = document.querySelector("#logIn"); //Länk till inloggningssidan
const formRef = document.querySelector("form");
function init() {
    checkArray(); //Kollar om det redan finns blogginlägg i localstorage.
    createArticles(blogPostArray);
    console.log(blogPostArray); //för felsökning
    if (formRef) {
        formRef.addEventListener("submit", event => {
            event.preventDefault(); //stoppar inbyggd formulärhantering. TS tar över
            //kör funktion för att hämta data och spara i array
            getPost();
        });
    }
    showStatus(); //Ger användaren feedback om hen är inloggad eller inte.
    logOut();
}
/////////////////////////////////////////////
//Funktioner relaterat till inloggad status//
/////////////////////////////////////////////
function showStatus() {
    if (!loginStatus || !logOutBtn || !logInLink || !createBlogPost)
        return;
    let loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") {
        loginStatus.textContent = "Du är inloggad.";
        logInLink.style.display = "none";
        createBlogPost.style.display = "block";
    }
    else {
        loginStatus.textContent = "Du är inte inloggad.";
        logOutBtn.style.display = "none";
        logInLink.style.display = "block";
        createBlogPost.style.display = "none";
    }
}
//Uppdaterar Localstorage ifall Logga ut knappen används.
function logOut() {
    if (!logOutBtn)
        return;
    logOutBtn.addEventListener("click", event => {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userName");
        showStatus();
    });
}
//////////////////////////////////////////////////
//Funktioner för att skapa och spara blogginlägg//
//////////////////////////////////////////////////
let blogPostArray = []; //skapar array som bara får innehålla objekt av typen BlogPost
function checkArray() {
    const savedPosts = localStorage.getItem("blogPosts");
    //hämtar bloggen som string från localstorage och parsar dem tillbaka till object
    //i blogPostArray. as NewPost säger att arrayen ska innehålla NewPost objekt.
    if (savedPosts) {
        blogPostArray = JSON.parse(savedPosts);
    }
}
//Funktionens uppdrag är att hämta information från formulärets inputfält och sedan pusha dem till en array.
//De pushas med hjälp av JSON-stringify.
function getPost() {
    if (!formRef)
        return;
    const titlePost = formRef.elements.namedItem("title"); //Referenser för title och content från formuläret
    const contentPost = formRef.elements.namedItem("blogtext");
    const author = localStorage.getItem("userName"); //Referens för användarnamn
    if (!(titlePost instanceof HTMLInputElement) ||
        !(contentPost instanceof HTMLTextAreaElement))
        return; //kontrollerar att det är rätt typ av element(input o textarea)
    if (!author)
        return; //Kör bara om användarnamn finns(körs ej om användarnamn saknas)
    const newPost = {
        title: titlePost.value,
        userName: author,
        content: contentPost.value,
        date: new Date().toISOString()
    };
    blogPostArray.push(newPost);
    localStorage.setItem("blogPosts", JSON.stringify(blogPostArray)); //omvandlar array till string och sparar till localstorage
    //createArticles(blogPostArray); Behövs denna?
    console.log(blogPostArray); //för felsökning
    //console.log(newPost); //för felsökning
}
//////////////////////////////////////////////////////
//Funktioner för att skriva ut blogginlägg i section//
//////////////////////////////////////////////////////
const sectionRef = document.getElementById("blogpost");
//Funktionen tar emot en array med objekt(NewPost[]) och skriver ut dessa som artiklar genom att skapa HTML-element.
function createArticles(blogPostArray) {
    if (!sectionRef)
        return;
    blogPostArray.forEach(post => {
        const articleElement = document.createElement("article");
        let element = createElement("h3", post.title);
        articleElement.appendChild(element);
        element = createElement("p", "Skrivet av: " + post.userName + " - " + post.date);
        articleElement.appendChild(element);
        element = createElement("p", post.content);
        articleElement.appendChild(element);
        sectionRef.appendChild(articleElement);
    });
}
//Funktionen skapar HTML-element
function createElement(element, text) {
    const newElement = document.createElement(element);
    newElement.textContent = text;
    return newElement;
}
init();
export {};

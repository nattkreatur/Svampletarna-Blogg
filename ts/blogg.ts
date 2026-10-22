export {}; //ger scriptet ett eget scope

const loginStatus = document.getElementById("userStatus");
const createBlogPost = document.getElementById("createBlogPost");
const logOutBtn = document.querySelector<HTMLButtonElement>("#logOut");
const logInLink = document.querySelector<HTMLAnchorElement>("#logIn"); //Länk till inloggningssidan
const formRef = document.querySelector<HTMLFormElement>("form");

function init(): void{
    
    if(formRef){
        formRef.addEventListener("submit", event => {
            event.preventDefault(); //stoppar inbyggd formulärhantering. TS tar över
            //kör funktion för att hämta data och spara i array
            getPost();
        })
    }
    showStatus();
    logOut();
    
}

/////////////////////////////////////////////
//Funktioner relaterat till inloggad status//
/////////////////////////////////////////////

function showStatus():void{
    if(!loginStatus || !logOutBtn || !logInLink || !createBlogPost) return;

    let loggedIn = localStorage.getItem("loggedIn");
    if(loggedIn === "true"){
        loginStatus.textContent = "Du är inloggad.";
        logInLink.style.display = "none";
        createBlogPost.style.display = "block";
    } else{
        loginStatus.textContent = "Du är inte inloggad.";
        logOutBtn.style.display = "none";
        logInLink.style.display = "block";
        createBlogPost.style.display = "none";
    }
}

//Uppdaterar Localstorage ifall Logga ut knappen används.
function logOut():void{
    if(!logOutBtn) return;
    logOutBtn.addEventListener("click", event =>{
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userName");
        showStatus();
    })
}

//////////////////////////////////////////////////
//Funktioner för att skapa och spara blogginlägg//
//////////////////////////////////////////////////

let blogPosts: BlogPost[] = []; //en array där varje inlägg måste följa strukturen som interface BlogPost anger


interface BlogPost {
    title: string;
    userName: string;
    content: string;
    date: string;
}

function getPost(){
    if(!formRef) return;

    const titlePost = formRef.elements.namedItem("title"); //Referenser för title och content från formuläret
    const contentPost = formRef.elements.namedItem("blogtext");
    const author = localStorage.getItem("userName"); //Referens för användarnamn

    if(!(titlePost instanceof HTMLInputElement) || 
    !(contentPost instanceof HTMLTextAreaElement)) return; //kontrollerar att det är rätt typ av element(input o textarea)
    if(!author) return; //Kör bara om användarnamn finns(körs ej om användarnamn saknas)

    const newPost: BlogPost = {
        title: titlePost.value,
        userName: author,
        content: contentPost.value,
        date: new Date().toISOString()
    };
    console.log(newPost); //för felsökning
}

init();
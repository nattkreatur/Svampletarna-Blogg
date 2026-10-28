export {}; //ger scriptet ett eget scope

const loggedOutMsg = document.getElementById("loggedOutMsg");
const loginStatus = document.getElementById("userStatus");
const createBlogPost = document.getElementById("createBlogPost");
const logOutBtn = document.querySelector<HTMLButtonElement>("#logOut");
const logInLink = document.querySelector<HTMLAnchorElement>("#logIn"); //Länk till inloggningssidan
const formRef = document.querySelector<HTMLFormElement>("form");
let loggedIn = localStorage.getItem("loggedIn");

function init(): void{

    checkArray(); //Kollar om det redan finns blogginlägg i localstorage.
    createArticles(blogPostArray);
    console.log(blogPostArray); //för felsökning

    if(formRef){

        formRef.addEventListener("submit", event => {
            event.preventDefault(); //stoppar inbyggd formulärhantering. TS tar över
            //kör funktion för att hämta data och spara i array
            
            getPost();
        })
    }
    showStatus(); //Ger användaren feedback om hen är inloggad eller inte.
    logOut();
    
}

/////////////////////////////////////////////
//Funktioner relaterat till inloggad status//
/////////////////////////////////////////////

function showStatus(): void{
    if(!loginStatus || !logOutBtn || !logInLink || !createBlogPost || !loggedOutMsg) return;

    
    if(loggedIn === "true"){
        loggedOutMsg.style.display = "none";
        loginStatus.textContent = "Du är inloggad.";
        logInLink.style.display = "none";
        createBlogPost.style.display = "block";
    } else{
        loginStatus.textContent = "Du är inte inloggad.";
        logOutBtn.style.display = "none";
        logInLink.style.display = "inline-block";
        createBlogPost.style.display = "none";
    }
}

//Uppdaterar Localstorage ifall Logga ut knappen används.
function logOut(): void{
    if(!logOutBtn) return;
    logOutBtn.addEventListener("click", event =>{
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userName");
        location.reload();//laddar om sidan
        showStatus();
    })
}

//////////////////////////////////////////////////
//Funktioner för att skapa och spara blogginlägg//
//////////////////////////////////////////////////

let blogPostArray: NewPost[] = []; //skapar array som bara får innehålla objekt av typen BlogPost

interface NewComment {
    userName: string;
    date: string;
    content: string;

}
interface NewPost extends NewComment {
    title: string;
    comment: NewComment[];
}

function checkArray(): void{
    const savedPosts = localStorage.getItem("blogPosts");
    //hämtar bloggen som string från localstorage och parsar dem tillbaka till object
    //i blogPostArray. as NewPost säger att arrayen ska innehålla NewPost objekt.
    if(savedPosts) {
        blogPostArray = JSON.parse(savedPosts) as NewPost[];
        
}
}

//Funktionens uppdrag är att hämta information från formulärets inputfält och sedan pusha dem till en array.
//De pushas med hjälp av JSON-stringify.
function getPost(): void{
    if(!formRef) return;

    const titlePost = formRef.elements.namedItem("title"); //Referenser för title och content från formuläret
    const contentPost = formRef.elements.namedItem("blogtext");
    const author = localStorage.getItem("userName"); //Referens för användarnamn

    if(!(titlePost instanceof HTMLInputElement) || 
    !(contentPost instanceof HTMLTextAreaElement)) return; //kontrollerar att det är rätt typ av element(input o textarea)
    if(!author) return; //Kör bara om användarnamn finns(körs ej om användarnamn saknas)
    if(!contentPost.value.trim() || !titlePost.value.trim()) return; //Hindrar tom input med enbart mellanslag

    const newPost: NewPost = {
        title: titlePost.value,
        userName: author,
        content: contentPost.value,
        date: new Date().toLocaleDateString("sv-SV"), 
        comment: [] //inlägg börjar med en tom array för kommentarer
    };
    
    blogPostArray.push(newPost);
    localStorage.setItem("blogPosts", JSON.stringify(blogPostArray)); //omvandlar array till string och sparar till localstorage
    location.reload();//laddar om sidan efter post

    console.log(blogPostArray); //för felsökning
    //console.log(newPost); //för felsökning
}

//////////////////////////////////////////////////////
//Funktioner för att skriva ut blogginlägg i section//
//////////////////////////////////////////////////////
const sectionRef = document.getElementById("blogpost");


//Funktionen tar emot en array med objekt(NewPost[]) och skriver ut dessa som artiklar genom att skapa HTML-element.
function createArticles(blogArray: NewPost[]): void{
    if(!sectionRef) return;

    //skapar en kopia av ursprungsarrayen som bara används här. Den reverserar ordningen på artiklarna innan de skrivs ut.
    blogArray.slice().reverse().forEach(post => {
        const articleElement = document.createElement("article");
        const divElement = document.createElement("div");


        //Skapar innehållet i blogginlägget
        
        let element = createElement("h2", post.title);
        articleElement.appendChild(element);

        element = createElement("p", post.content);
        divElement.appendChild(element);

        element = createElement("p", "Av: " + post.userName + " (" + post.date + ")");
        divElement.appendChild(element);

        articleElement.appendChild(divElement);

        element = createElement("h4", "Kommentarer");
        articleElement.appendChild(element);


        //går igenom eventuella kommentarer med en foreach-loop.
        if(post.comment && post.comment.length > 0 ){

            post.comment.slice().reverse().forEach(comment => {
                //Skapar en kosmetisk div och tilldeldar den en klass av CSS-skäl
                const commentContainer = document.createElement("div");
                commentContainer.classList.add("commentContainer");

                let commentElement = createElement("p", comment.content);
                commentContainer.appendChild(commentElement);

                commentElement = createElement("p", comment.userName + " (" + comment.date + ")");
                commentContainer.appendChild(commentElement);

                articleElement.appendChild(commentContainer);
            })
        } else{
            const noComment = createElement("p", "Det finns inga kommentarer än.");
            articleElement.appendChild(noComment);
        }
        //Skapar formulär för kommentarer
        if(loggedIn === "true"){
            const commentForm = document.createElement("form");
            const commentText = document.createElement("textarea");
            const commentButton = createElement("button", "Publicera kommentar");
            
            commentText.placeholder = "Skriv en kommentar...";
            commentButton.setAttribute("type", "submit");

            commentForm.append(commentText, commentButton);
            
            articleElement.appendChild(commentForm);

            //input-fältens värden skickas till submitComment
            submitComment(commentForm, commentText, post);
        }

        sectionRef.appendChild(articleElement);
    })
}

//Funktionen skapar HTML-element
function createElement(element: string, text: string): HTMLElement{
    const newElement = document.createElement(element);
    newElement.textContent = text;
    return newElement;
}

//Funktionen tar emot inputvärden från kommentarsformuläret i createArticle och
//skickar in dem som objekt i arrayen. Uppdaterar sedan local storage.
function submitComment(
    commentForm: HTMLFormElement,
    commentText: HTMLTextAreaElement, 
    post: NewPost): void{
        commentForm.addEventListener("submit", event => {
            event.preventDefault();

            const author = localStorage.getItem("userName");

            if(!author) return;
            if(!commentText.value.trim()) return; //Hindrar tomma kommentarer+enbart mellanslag

            const newComment: NewComment = {
                userName: author,
                date: new Date().toLocaleDateString("sv-SV"),
                content: commentText.value
            }

            post.comment.push(newComment);

            localStorage.setItem("blogPosts", JSON.stringify(blogPostArray));
            location.reload();
        })
    }

init();
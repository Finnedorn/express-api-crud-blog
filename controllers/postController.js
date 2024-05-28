// importo fs e path
const fs = require("fs");
const path = require("path");
// importo e leggo il JSON
let blogPosts = require("../db/db-blog.json");
const { urlencoded } = require("express");
// storo in una const il contenuto a cui dovrò fare replace() nell'html
const placeHolder = "{{placeholder}}";
// creo una funzione di replacement dei contenuti in htnl 
function pageContentReplacer(oldcontent, content) {
    const filePath = path.join(__dirname, "../page.html");
    return fs.readFileSync(filePath, "utf-8").replace(oldcontent, content);
}
// funzione per aggiornare il json 
function jsonUpdater(newContent){
    const filePath = path.join(__dirname, "../db/db-blog.json");
    fs.writeFileSync(filePath, JSON.stringify(newContent));
    blogPosts = newContent;
}
// funzione per comporre lo slug dal title del req.body
function slugGenerator(name){
    let counter = 1;
    let nameToSlug = name.replaceAll(' ','-').toLowerCase().replaceAll('/', '');;
    const allSlugs = blogPosts.map(post => post.slug);
    while(allSlugs.includes(nameToSlug)) {
        nameToSlug = `${nameToSlug}-${counter}`;
        counter++;
    }
    return nameToSlug;
}
// funzione per eliminare un'img da public 
function fileDestroyer(file) {
    // estrapolo il percoros del file
    const filePath = path.join(__dirname, '../public', file);
    // lo elimino 
    fs.unlinkSync(filePath);
}





// setto la funzione di index
function index(req,res) {
    // content negotiation
    // se è richiesto un html...
    res.format({
        html: () => {
            // preparo un contenuto per cui poi fare replace in html
            // ciclo e stampo tutti gli elementi dell'array 
            let newHtml = ``;
            blogPosts.forEach(post=>{
                newHtml += `
                <div class="card overflow-hidden m-2" style="width: 400px">
                    <div class="overflow-hidden position-relative">
                        <img src="${post.image}" class="card-img-top" alt="immagine-di-${post.slug}">
                    </div>
                    <div class="card-body">
                        <a href="/posts/${post.slug}">
                            <h5 class="card-title text-center mb-3">${post.title}</h5>
                        </a>
                        <p class="card-text">${post.content.length > 30 ? post.content.slice(0,150) + "..." : post.content}</p>
                        <ul>
                `;
                post.tags.forEach(tag =>{
                    newHtml += `
                        <li class="list-unstyled">${tag}</li>
                    `
                    });
                newHtml += `
                        </ul>
                        <div class=" d-flex flex-column align-items-center">
                            <a class="mb-5" href="/posts/${post.slug}/download"> Download dell'immagine</a>
                        </div>
                    </div>
                </div>
                `
            });
            res.send(pageContentReplacer(placeHolder, newHtml));
        },
        // se è richiesto un json...
        json: () => {
            res.json(blogPosts);
        }
    })
};

// setto la funzione di show
function show(req,res) {
    // storo in const lo slug contenuto nei params della request
    const slugRequested = req.params.slug;
    // uso il metodo find() per cercare in array l'elemento con slug uguale a quello nella req
    const findedPost = blogPosts.find( post => post.slug === slugRequested);
    // se esiste...
    if(findedPost){
        // se è richiesto un html...
        res.format({
            html: () => {
                // preparo un contenuto per cui poi fare replace in html
                // stampo tutti i valori dell'elemento dell'array
                let newHtml = ``;
                newHtml += `
                    <div class="card overflow-hidden m-2" style="width: 400px">
                        <div class="overflow-hidden position-relative">
                            <img src="/${findedPost.image}" class="card-img-top" alt="immagine-di-${findedPost.slug}">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title text-center mb-3">${findedPost.title}</h5>
                            <p class="card-text">${findedPost.content}</p>
                            <ul>
                    `;
                    findedPost.tags.forEach(tag =>{
                        newHtml += `
                            <li class="list-unstyled">${tag}</li>
                        `
                        });
                    newHtml += `
                            </ul>
                            <div class=" d-flex flex-column align-items-center">
                                <a class="mb-5" href="/posts/${findedPost.slug}/download"> Download dell'immagine</a>
                                <a href="/">< Pagina Precedente</a>
                            </div>
                        </div>
                    </div>
                    `
                res.send(pageContentReplacer(placeHolder, newHtml));
            },
            // se è richiesto un json...
            json: () => {
                res.json(findedPost);
            }
        })
    // se l'elemento non esistesse...
    } else {
        // setto lo status code su file non found (404) e invio 
        res.status(404).send(pageContentReplacer("../page.html",
        "<p>mi spiace, non abbiamo trovato il post che stai cercando</p>"))
    }
};

function store(req, res){
    if (req.is('application/x-www-form-urlencoded')) {
        const {title, content, image, tags} = req.body;
        const newPostSlug = slugGenerator(title);
        const newPost = {
            title,
            slug: newPostSlug,
            content,
            image,
            tags
        }
        jsonUpdater([...blogPosts, newPost]);
    }else {
        const {title, content,tags} = req.body;
        const fileImage = req.file? req.file.filename : null;
        const newPostSlug = slugGenerator(title);
        const newPost = {
            title,
            slug: newPostSlug,
            content,
            image: fileImage,
            tags
        }
        jsonUpdater([...blogPosts, newPost]);
    }
    res.redirect(`/posts`);
};


function destroy(req, res){
    const reqSlug = req.params.slug;
    const postToDestroy = blogPosts.find(post => post.slug === reqSlug);
    if(postToDestroy) {
        const postlessJson = blogPosts.filter(post => post.slug !== reqSlug); 
        jsonUpdater(postlessJson);
        res.send(`Hai eliminato ${postToDestroy.title}`);
    } else {
        res.status(404).send(`Ci dispiace, non abbiamo trovato il post che vuoi eliminare`);
    }
}


// esporto le funzioni così da poterle utilizzare nel file di routing
module.exports = {
    index,
    store,
    show,
    destroy
}
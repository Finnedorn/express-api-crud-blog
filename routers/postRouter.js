// importo express
const express = require("express");
// importo il metodo di routing di express
const router = express.Router();
// importo il file con le funzioni del controller
const postController = require("../controllers/postController.js");
// importo le config di multer per settare il middleware 
const multer = require("multer");
// setto l'accesso alla cartella public per lo store dei file di multer 
const storage = multer({dest: "public"});
// import il middleware per fare il file check della richiesta post in store
const postDataValidator = require("../middlewares/postDataValidator");
const deleteAssistant = require("../middlewares/deleteAssistant.js");


// setto la route base affinche mi mostri il contenuto della funzione index
router.get("/", postController.index);
// setto la route post a cui invierò del contenuto col quale aggiornerò l'array/json
router.post("/", storage.single("image"), postDataValidator, postController.store);
// la route dello show di ciascun post
router.get("/:slug", postController.show);
// route per l'eliminazione di un elemento
router.delete("/:slug", deleteAssistant, postController.destroy);


// esporto il modulo così da poterlo utilizzare in app.js
module.exports = router;
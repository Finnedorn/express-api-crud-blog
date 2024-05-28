// importo express
const express = require("express");
// importo il metodo di routing di express
const router = express.Router();
// importo il file con le funzioni del controller
const postController = require("../controllers/postController.js");

// setto la route base affinche mi mostri il contenuto della funzione index
router.get("/", postController.index);
// la route dello show di ciascun post
router.get("/:slug", postController.show);
// la rotta che triggera il download dell'immagine
router.get("/:slug/download", postController.download);

// esporto il modulo così da poterlo utilizzare in app.js
module.exports = router;
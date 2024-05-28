const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
// setto il middleware
app.use(express.static('public'));
app.use(express.json());
// importo il file di routing 
const postRouter = require("./routers/postRouter");

// effettuo un redirect alla index di /post 
app.get('/',(req,res) =>{
    res.redirect('/posts');
});
// la rotta post adesso seguirà le configurazioni settate nel postRouter.js
app.use('/posts', postRouter);

app.listen(port, () => {
    console.log(`Sto runnando il server su http://localhost:${port}`);
});
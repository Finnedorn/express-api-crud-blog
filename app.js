const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
// setto i middleware
app.use(express.static('public'));
app.use(express.json());
// setto la possobilità di riconoscere e analizzare i file x-www-form-urlencoded
app.use(express.urlencoded({extended:true}));
// importo il file di routing 
const postRouter = require("./routers/postRouter");
// importo il middleware di check degli errori
const errorFormatter = require("./middlewares/errorFormatter");




// effettuo un redirect alla index di /post 
app.get('/',(req,res) =>{
    res.redirect('/posts');
});
// la rotta post adesso seguirà le configurazioni settate nel postRouter.js
app.use('/posts', postRouter);

// abilito il middleware di errorFormatter
// essendo un middleware il cui scopo è fare il catch di possibili errori
// lo inserisco prima di abilitare il server così che quest'ultimo non blocchi l'esecuzione delle altre routes
app.use(errorFormatter);

app.listen(port, () => {
    console.log(`Sto runnando il server su http://localhost:${port}`);
});
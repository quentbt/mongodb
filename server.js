import express from "express"
import route from "./router.js"
import { connect } from "mongoose"

connect("mongodb+srv://quentinbuet4:(Quentin15)@cluster0.qp8v2jv.mongodb.net/paris")
    .then(function () {
        console.log("connexion réussi");
    }).catch(function (err) {
        console.log(new Error(err));
    })

const app = express();
const PORT = 1235;
app.use(express.json())

app.use(route);

app.listen(PORT, function () {

    console.log(`serveur express écoute sur le port ${PORT}`);
})


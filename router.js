import { Router } from "express"
import { Balade } from "./model.js";

const router = Router();

//1
router.get("/all", async function (req, rep) {

    const balades = await Balade.find()
    rep.json(balades);
});

//2
router.get("/id/:id", async function (req, rep) {
    const id = req.params.id;

    //verifier est ce que l'id MongoDb que je viens de recup est valid
    const verif = isValidObjectId(id)

    if (!verif) {
        return rep.status(400).json({ msg: "id invalid" });
    }

    const reponse = await Balade.findById({ _id: id });

    rep.json(reponse)
})

// 3
router.get('/search/:search', async function (req, res) {
    const searchTerm = req.params.search;
    const result = await Balade.find({
        $or: [
            { nom_poi: { $regex: searchTerm, $options: 'i' } },
            { texte_intro: { $regex: searchTerm, $options: 'i' } }
        ]
    });

    res.json(result);
});

//4
router.get("/site-internet", async function (req, rep) {
    try {
        const balades = await Balade.find({ url_site: { $ne: null } });
        rep.json(balades);
    } catch (error) {
        rep.status(500).json({ message: "Erreur serveur" });
    }
});

//5
router.get('/mot_cle', async function (req, res) {
    const result = await Balade.find({
        $expr: { $gt: [{ $size: "$mot_cle" }, 5] }
    });

    res.json(result);
});

//6
router.get('/publie/:annee', async function (req, res) {
    const annee = req.params.annee;

    try {
        const regexAnnee = new RegExp(`^${annee}`, "i");
        const balades = await Balade.find({
            date_saisie: regexAnnee
        }).sort({ date_saisie: 1 });
        res.json(balades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//7
router.get('/arrondissement/:num_arrondissement', async function (req, rep) {
    const code_postal = req.params.num_arrondissement;

    const arrondissement = await Balade.countDocuments({
        code_postal: code_postal
    })
    rep.json({ count: arrondissement })
});

//8
router.get("/synthese", async function (req, rep) {
    try {
        const synthese = await Balade.aggregate([
            {
                $group: {
                    _id: "$code_postal",
                    total: { $sum: 1 }
                }
            }
        ]);
        rep.json(synthese);
    } catch (error) {
        rep.status(500).json({ message: "Erreur serveur" });
    }
});

//9
router.get("/categorie", async function (req, rep) {

    const categorie = await Balade.distinct("categorie");
    rep.json({ categorie })
});

//10
router.post("/add", async function (req, rep) {
    const balades = req.body;
    if (!balades.nom_poi || !balades.adresse || !balades.categorie) {
        return rep.status(400).json({ message: "Les champs 'nom_poi','adresse',et'categorie'sont non défini" })
    }
    const nouvelleBalade = new Balade(balades);
    const reponse = await nouvelleBalade.save();
    rep.json(reponse);
})

//11
router.put("/add-mot_cle/:id", async function (req, rep) {
    const baladeId = req.params.id;
    const newMotCle = req.body.mot_cle;

    const reponse = await Balade.updateOne({ _id: baladeId }, {
        $addToSet: { mot_cle: newMotCle }
    });

    rep.json(reponse);
})

//12
router.put("/update-one/:id", async function (req, res) {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "invalid id baka" });
        }
        const balade = await Balade.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!balade) {
            return res.status(404).send({ message: "Balade non trouvée." });
        }
        return res.status(200).send(balade);
    } catch (error) {
        return res.status(500).send();
    }
});

//13
router.put("/update-many/:search", async function (req, res) {
    try {
        const balade = await Balade.updateMany(
            { texte_description: { $regex: req.params.search, $options: 'i' } },
            { $set: { nom_poi: req.body.nom_poi } }
        );
        return res.status(200).send(balade);
    }
    catch (error) {
        return res.status(500).send();
    }
});

//14
router.delete("/delete/:id", async function (req, res) {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).send({ message: "invaliid id" });
        }
        await Balade.findByIdAndDelete(req.params.id);
        return res.status(200).send();
    } catch (error) {
        return res.status(500).send();
    }
});

export default router;
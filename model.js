import { Schema, model } from "mongoose";

const schemaBalade = new Schema({

    identifiant: String,
    adresse: { type: String, require: true },
    code_postal: String,
    parcours: [String],
    url_image: String,
    copyright_image: String,
    legende: String,
    categorie: { type: String, require: true },
    nom_poi: { type: String, require: true },
    date_saisie: Date,
    mot_cle: [String],
    ville: String,
    texte_intro: String,
    texte_description: String,
    url_site: String,
    fichier_image: {
        thumbnail: Boolean,
        filename: String,
        format: String,
        width: Number,
        mimetype: String,
        etag: String,
        id: String,
        last_synchronized: Date,
        color_summary: [],
        height: Number
    },
    geo_shape: {
        type: String,
        geometry: {
            coordinates: [Number],
            type: String,
        },
        properties: {},
    },
    geo_point_2d: {

        lon: Number,
        lat: Number
    }
})

const Balade = model("balades", schemaBalade);

export { Balade };
require("dotenv").config();

module.exports = {
    token: process.env.TOKEN,
    clientID: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
    ownerID: "749005619800965121", // Id del dueño
    embedColor: "#c53fba", // Color de los embeds
    staffRole: "1139684735149416610", // ID del rol que tiene acceso a ver y escribir en los tickets
    ticketsCategory: "1129148780118278307", // Categoria en donde los tickets seran creados
    transcriptChannel: "1141567355441389658", // Canal donde llegaran los transcripts
    customActivity: "mahiro.online", // Estado del bot

}

function parseBoolean(value) { if (typeof (value) === 'string') { value = value.trim().toLowerCase(); }
switch (value) { case true: case "true": return true; default: return false; }}

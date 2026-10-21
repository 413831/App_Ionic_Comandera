var admin = require("firebase-admin");

try {
    var serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : require("./config/admin-sdk.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL || "https://tp2-comanda-pps---v2.firebaseio.com"
    });
} catch (error) {
    console.warn("Aviso en server-nodejs: No se encontró ./config/admin-sdk.json ni variable FIREBASE_SERVICE_ACCOUNT:", error.message);
    try {
        admin.initializeApp({
            databaseURL: process.env.FIREBASE_DATABASE_URL || "https://tp2-comanda-pps---v2.firebaseio.com"
        });
    } catch (e) {
        console.warn("Inicialización de respaldo de firebase-admin.");
    }
}

module.exports.admin = admin;
const express = require("express");

const app = express();

/**
 * Middleware de las routes requeridas
 */

app.use(require("./comentario"));
app.use(require("./comuna"));
app.use(require("./login"));
app.use(require("./poblacion"));
app.use(require("./notificacion"));
app.use(require("./puntoChofer"));
app.use(require("./recorrido"));
app.use(require("./region"));
app.use(require("./usuario"));

module.exports = app;

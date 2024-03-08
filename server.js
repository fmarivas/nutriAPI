require('dotenv').config();
const express = require('express');
const routes = require('./api/routes');
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = require('cors')
app.use(cors())


// Definindo rotas
app.use('/', routes);

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

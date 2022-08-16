const express = require('express');
const app = express();
const router = require('./routes');
const { auth } = require('./middlewares/auth');

const PORT = 8080;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(auth);

app.use('/api', router);

const server = app.listen(PORT, () => {
   console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
})

server.on("error", error => console.log(`Error en servidor ${error}`));

app.use((req, res, next) => {
   if(res.status(404)) {
      const error = {
         error: -2,
         method: req.method,
         path: req.path
      }
      res.status(404).send(error);
   }
 });
const express = require("express");

const server = express();

server.use(express.json());

let projetos = [];
let requests = 0;

server.use((req, res, next) => {
  requests += 1;
  console.log("Requisições realizadas: ", requests);
  return next();
});

function checkIdExists(req, res, next) {
  const { id } = req.params;
  const projetoFiltered = projetos.filter(projeto => projeto.id === id);
  if (projetoFiltered.length === 0) {
    return res.status(400).json({ error: "Id not exists in the array" });
  }

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projetos);
});

server.get("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;
  const projeto = projetos.filter(projeto => projeto.id === id);
  return res.json(projeto);
});

server.put("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projetos.map((projeto, index) => {
    if (projeto.id == id) {
      projetos[index].title = title;
      return res.json(projeto);
    }
  });
});

server.post("/projects/:id/tasks", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projetos.map((projeto, index) => {
    if (projeto.id == id) {
      projetos[index].tasks.push(title);
    }
  });

  return res.send();
});

server.post("/projects", (req, res) => {
  //{ id: "1", title: 'Novo projeto', tasks: [] }
  const novoProjeto = { ...req.body, tasks: [] };
  projetos.push(novoProjeto);
  return res.send();
});

server.listen(3000);

const express = require('express');

const server = express();
server.use(express.json());

const projects = [];
let count_request = 0;

// Midleware global - Contador de request
server.use((req,res, next) =>{
    count_request++;
    console.log(`Requisição ${count_request} foi chamada`);
    return next();
});

// Midleware local - valida o id do projeto na URL
function checkIdExists(req, res,next){
    let idExist = false;
    const { id } = req.params;

    projects.filter((project, index) =>{
        if(project.id == id)
            idExist = true
    })
    if(!idExist)
        return res.status('400').json({ error: `Not found a project with this id:${id}`});
    else
        return next();
}

// cadastrar projeto
server.post('/projects', (req,res) =>{
    projects.push(req.body);
    res.json(projects);
});

// cadastrar uma nova tarefa
server.post('/projects/:id/tasks', checkIdExists, (req,res) =>{
    const { id } = req.params;
    const { title } = req.body;
    projects.filter((project, index) =>{
        if(project.id == id)
            projects[index].tasks.push(title)
    })
    res.json(projects);
});

// editar titulo do projeto
server.put('/projects/:id', checkIdExists, (req,res) =>{
    const { id } = req.params;
    const { title } = req.body;
    projects.filter((project, index) =>{
        if(project.id == id)
            projects[index].title = title
    })
    res.json(projects);
});

// deletar uma tarefa
server.delete('/projects/:id', checkIdExists, (req,res) =>{
    const { id }  = req.params;
    projects.filter((project, index) =>{
        if(project.id == id)
            projects.pop(index);
    })
    res.json(projects);
});

// lista projetos e suas tarefas
server.get('/projects',(req, res) => {
    res.json({projects});
})

server.listen(3000);
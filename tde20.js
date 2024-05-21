




const express = require('express');
const bodyParser = require('body-parser');
const { faker } = require('@faker-js/faker');

const app = express();
const PORT = 3000;


app.use(bodyParser.json());


let tasks = [];
let users = [];


function gerarDadosPessoa() {
    const nome = faker.name.findName();
    const email = faker.internet.email();
    const dataNascimento = faker.date.past().toLocaleDateString();

    return { nome, email, dataNascimento };
}

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const newTask = req.body;
    newTask.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const updatedTask = req.body;
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, ...updatedTask };
        }
        return task;
    });
    res.json(updatedTask);
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== taskId);
    res.sendStatus(204);
});


app.post('/v1/register', (req, res) => {
    const { email, password } = req.body;
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'Email already registered' });
    }
    const newUser = { email, password };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.post('/v1/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({ message: 'Login successful' });
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

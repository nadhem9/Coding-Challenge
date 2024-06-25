const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT =5000;

app.use(bodyParser.json());
app.use(cors());

let todoList = [];

app.get('/api/todo', (req, res) => {
  res.json(todoList);
});


app.post('/api/todo', (req, res) => {
  const newItem = req.body;
  todoList.unshift(newItem); 
  res.status(201).json(newItem);
});


app.put('/api/todo/:id', (req, res) => {
  const id = req.params.id;
  const updatedItem = req.body;
  todoList[id] = updatedItem;
  res.status(200).json(updatedItem);
});


app.delete('/api/todo/:id', (req, res) => {
  const id = req.params.id;
  todoList.splice(id, 1);
  res.status(200).json({ message: 'Task deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

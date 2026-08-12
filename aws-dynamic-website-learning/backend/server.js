// server.js
const express = require('express');
const cors = require('cors');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const app = express();
app.use(cors());
app.use(express.json());

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const data = await docClient.send(new ScanCommand({ TableName: 'Tasks' }));
    res.json(data.Items || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new task
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  const newItem = { taskId: Date.now().toString(), title, createdAt: new Date().toISOString() };
  try {
    await docClient.send(new PutCommand({ TableName: 'Tasks', Item: newItem }));
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await docClient.send(new DeleteCommand({
      TableName: 'Tasks',
      Key: { taskId: id }
    }));
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.listen(3000, () => console.log('Server running on port 3000'));
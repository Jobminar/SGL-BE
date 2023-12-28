import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToMongoDB from './conn.js';
import router from './routes.js';
import { json } from 'express';
import mongoose from 'mongoose';

import bcrypt from 'bcryptjs';
import Login from './Model.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
connectToMongoDB();
app.use(json());
app.use('/', router);

app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await Login.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Login({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Login.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

dotenv.config();

let server;

const startServer = async () => {
  try {
    await connectToMongoDB();

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const shutdownServer = async () => {
  if (server) {
    await server.close(() => {
      console.log('Server closed');
      connectToMongoDB().then(() => process.exit(0));
    });
  }
};

process.on('SIGINT', async () => {
  console.log('Received SIGINT signal');
  await shutdownServer();
});

process.on('uncaughtException', async (error) => {
  console.error(error);
  await shutdownServer();
  process.exit(1);
});

startServer();

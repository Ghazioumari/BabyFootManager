const express = require('express');
const { Pool } = require('pg');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = 3000;

// Configuration PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'babyfoot',
    password: 'postgres',
    port: 5432,
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes API
app.get('/api/parties', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM parties ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serveur HTTP
const server = app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

// WebSocket
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Nouveau client connecté');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        // Diffuser le message à tous les clients sauf l'expéditeur
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log('Client déconnecté');
    });
});

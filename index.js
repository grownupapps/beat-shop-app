// 1. Core Modules (Node.js built-in)
const express = require('express');
const path = require('path');
const fs = require('fs');

// 2. Third Party Modules
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const session = require('express-session');

// 3. Eigene Models
const Beat = require('./Models/beat');

// 4. Express App initialisieren
const app = express();

// MongoDB Verbindung
mongoose.connect('mongodb+srv://joshuafrehse96:6tuPGd6TaDa6nox9@cluster0.eyspo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Verbindung erfolgreich!');
}).catch(err => {
    console.error('MongoDB Verbindungsfehler:', err);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(session({
    secret: 'beat-shop-secret',
    resave: false,
    saveUninitialized: false
}));

// Admin Routes einbinden
const adminRoutes = require('./routes/admin');
app.use('/', adminRoutes);

// Öffentliche Seite (Player für Kunden)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Beat Shop</title>
                <style>
                    body { 
                        font-family: Arial; 
                        max-width: 800px; 
                        margin: 20px auto; 
                        padding: 20px;
                        background-color: #f5f5f5;
                    }
                    .beat-card {
                        background: white;
                        padding: 20px;
                        margin: 15px 0;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    audio {
                        width: 100%;
                        margin-top: 10px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .beat-content {
                        display: flex;
                        gap: 20px;
                        margin-bottom: 10px;
                    }
                    .beat-cover {
                        width: 100px;
                        height: 100px;
                        object-fit: cover;
                        border-radius: 4px;
                    }
                    .beat-info {
                        flex: 1;
                    }
                    .beat-info h3 {
                        margin: 0 0 10px 0;
                    }
                    .beat-info p {
                        margin: 5px 0;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Beat Shop</h1>
                    <p>Check die neuesten Beats</p>
                </div>

                <div id="beatsList"></div>

                <script>
                    fetch('/beats-list')
                        .then(res => res.json())
                        .then(beats => {
                            const beatsListDiv = document.getElementById('beatsList');
                            beats.forEach(beat => {
                                const beatDiv = document.createElement('div');
                                beatDiv.className = 'beat-card';
                                beatDiv.innerHTML = \`
                                    <div class="beat-content">
                                        \${beat.coverPath ? \`<img src="/uploads/\${beat.coverPath}" class="beat-cover" alt="\${beat.title}">\` : ''}
                                        <div class="beat-info">
                                            <h3>\${beat.title}</h3>
                                            \${beat.description ? \`<p>\${beat.description}</p>\` : ''}
                                            <p>BPM: \${beat.bpm || 'N/A'} | Key: \${beat.key || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <audio controls>
                                        <source src="/uploads/\${beat.filePath}" type="audio/mpeg">
                                    </audio>
                                \`;
                                beatsListDiv.appendChild(beatDiv);
                            });
                        });
                </script>
            </body>
        </html>
    `);
});

// Server starten
const port = 3000;
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
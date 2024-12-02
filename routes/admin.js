const express = require('express');
const router = express.Router();
const path = require('path');
const Beat = require('../Models/beat');
const requireLogin = require('../middleware/auth');
const fs = require('fs');






// Login-Seite
router.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Producer Login</title>
                <style>
                    body { 
                        font-family: Arial; 
                        max-width: 400px; 
                        margin: 40px auto; 
                        padding: 20px;
                        background-color: #f5f5f5;
                    }
                    .login-form {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    input {
                        width: 100%;
                        padding: 8px;
                        margin: 10px 0;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    }
                    button {
                        width: 100%;
                        padding: 10px;
                        background: #2c5282;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    button:hover {
                        background: #2a4365;
                    }
                    .error {
                        color: red;
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="login-form">
                    <h2>Producer Login</h2>
                    ${req.session.error ? `<div class="error">${req.session.error}</div>` : ''}
                    <form action="/login" method="POST">
                        <input type="text" name="username" placeholder="Username" required>
                        <input type="password" name="password" placeholder="Password" required>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </body>
        </html>
    `);
    req.session.error = null;
});

// Login verarbeiten
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'test123') {
        req.session.isLoggedIn = true;
        res.redirect('/admin');
    } else {
        req.session.error = 'Falscher Username oder Passwort';
        res.redirect('/login');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});
// Admin Dashboard
router.get('/admin', requireLogin, (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Producer Dashboard</title>
                <style>
                    body { 
                        font-family: 'Arial', sans-serif;
                        max-width: 1200px; 
                        margin: 20px auto; 
                        padding: 20px;
                        background: #f5f5f5;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 30px;
                        padding: 20px;
                        background: white;
                        border-radius: 10px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .upload-form {
                        background: white;
                        padding: 25px;
                        border-radius: 10px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        margin-bottom: 30px;
                    }
                    .form-group {
                        margin-bottom: 20px;
                    }
                    .form-group label {
                        display: block;
                        margin-bottom: 8px;
                        font-weight: bold;
                        color: #333;
                    }
                    .form-group input[type="text"],
                    .form-group input[type="number"],
                    .form-group input[type="url"],
                    .form-group textarea,
                    .form-group select {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        font-size: 14px;
                    }
                    .form-row {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 30px;
                    }
                    .beat-card {
                        background: white;
                        padding: 20px;
                        margin-bottom: 20px;
                        border-radius: 10px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        <p>\${beat.productUrl ? \`Produkt URL: \${beat.productUrl}\` : ''}</p>
                    }
                    .beat-content {
                        display: flex;
                        gap: 20px;
                        margin-bottom: 15px;
                    }
                    .beat-cover {
                        width: 120px;
                        height: 120px;
                        object-fit: cover;
                        border-radius: 8px;
                    }
                    .beat-info {
                        flex: 1;
                    }
                    .beat-controls {
                        display: flex;
                        gap: 10px;
                        margin-top: 15px;
                    }
                    .btn {
                        padding: 8px 16px;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.3s ease;
                    }
                    .btn-primary {
                        background: #2C5282;
                        color: white;
                    }
                    .btn-danger {
                        background: #E53E3E;
                        color: white;
                    }
                    .btn:hover {
                        opacity: 0.9;
                        transform: translateY(-1px);
                    }
                    .logout-btn {
                        background: #E53E3E;
                        color: white;
                        padding: 8px 16px;
                        border-radius: 5px;
                        text-decoration: none;
                        transition: background-color 0.3s ease;
                    }
                    .logout-btn:hover {
                        background: #C53030;
                    }
                    audio {
                        width: 100%;
                        margin-top: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Producer Dashboard</h1>
                    <a href="/logout" class="logout-btn">Logout</a>
                </div>
                
                <div class="upload-form">
                    <h2>Beat hochladen</h2>
                    <form action="/admin/upload" method="post" enctype="multipart/form-data">
                        <div class="form-group">
                            <label>Beat Datei:</label>
                            <input type="file" name="beat" accept="audio/*" required>
                        </div>

                        <div class="form-group">
                            <label>Cover Bild:</label>
                            <input type="file" name="cover" accept="image/*">
                        </div>

                        <div class="form-group">
                            <label>Titel:</label>
                            <input type="text" name="title" required>
                        </div>

                        <div class="form-group">
                            <label>Beschreibung:</label>
                            <textarea name="description" rows="3"></textarea>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>BPM:</label>
                                <input type="number" name="bpm" min="1" max="999">
                            </div>

                            <div class="form-group">
                                <label>Key/Tonart:</label>
                                <select name="key">
                                    <option value="">-- Wähle Key --</option>
                                    <option value="C">C</option>
                                    <option value="C#">C#</option>
                                    <option value="D">D</option>
                                    <option value="D#">D#</option>
                                    <option value="E">E</option>
                                    <option value="F">F</option>
                                    <option value="F#">F#</option>
                                    <option value="G">G</option>
                                    <option value="G#">G#</option>
                                    <option value="A">A</option>
                                    <option value="A#">A#</option>
                                    <option value="B">B</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Produkt URL:</label>
                            <input type="url" name="productUrl" placeholder="https://example.com/product">
                        </div>

                        <button type="submit" class="btn btn-primary">Hochladen</button>
                    </form>
                </div>

                <div id="beatsList">
                    <h2>Deine Beats</h2>
                </div>

                <script>
                    async function loadBeats() {
                        try {
                            const response = await fetch('/beats-list');
                            const beats = await response.json();
                            const beatsListDiv = document.getElementById('beatsList');
                            beatsListDiv.innerHTML = '<h2>Deine Beats</h2>';
                            
                            beats.forEach(beat => {
                                const beatDiv = document.createElement('div');
                                beatDiv.className = 'beat-card';
                                beatDiv.innerHTML = \`
                                    <div class="beat-content">
                                        \${beat.coverPath ? \`<img src="/uploads/\${beat.coverPath}" class="beat-cover" alt="\${beat.title}">\` : ''}
                                        <div class="beat-info">
                                            <h3>\${beat.title}</h3>
                                            <p>\${beat.description || ''}</p>
                                            <p>BPM: \${beat.bpm || 'N/A'} | Key: \${beat.key || 'N/A'}</p>
                                  <p>\${beat.productUrl ? \`Produkt URL: \${beat.productUrl}\` : ''}</p>
                                            <div class="beat-controls">
                                                <button onclick="editBeat('\${beat._id}')" class="btn btn-primary">Bearbeiten</button>
                                                <button onclick="deleteBeat('\${beat._id}')" class="btn btn-danger">Löschen</button>
                                            </div>
                                        </div>
                                    </div>
                                    <audio controls>
                                        <source src="/uploads/\${beat.filePath}" type="audio/mpeg">
                                    </audio>
                                \`;
                                beatsListDiv.appendChild(beatDiv);
                            });
                        } catch (error) {
                            console.error('Fehler beim Laden der Beats:', error);
                        }
                    }

                    async function deleteBeat(beatId) {
                        if (!confirm('Möchtest du diesen Beat wirklich löschen?')) {
                            return;
                        }

                        try {
                            const response = await fetch(\`/admin/beat/\${beatId}\`, {
                                method: 'DELETE'
                            });

                            if (response.ok) {
                                alert('Beat erfolgreich gelöscht');
                                loadBeats();
                            } else {
                                const error = await response.json();
                                alert('Fehler beim Löschen: ' + error.message);
                            }
                        } catch (error) {
                            console.error('Fehler:', error);
                            alert('Fehler beim Löschen des Beats');
                        }
                    }

                    function editBeat(beatId) {
                        window.location.href = '/admin/beat/' + beatId + '/edit';
                    }

                    // Initial Beats laden
                    loadBeats();
                </script>
            </body>
        </html>
    `);
});

// Upload-Route
// In admin.js, Update der Upload-Route
router.post('/admin/upload', requireLogin, async (req, res) => {
    try {
        if (!req.files || !req.files.beat) {
            return res.status(400).send('Keine Beat-Datei hochgeladen.');
        }

        const beatFile = req.files.beat;
        const coverFile = req.files.cover;
        
        // Korrektur der Pfade relativ zum Projektstamm
        const beatFileName = `beat_${Date.now()}_${beatFile.name}`;
        const beatPath = path.join(__dirname, '../uploads/beats', beatFileName);
        await beatFile.mv(beatPath);

        let coverFileName = null;
        if (coverFile) {
            coverFileName = `cover_${Date.now()}_${coverFile.name}`;
            const coverPath = path.join(__dirname, '../uploads/covers', coverFileName);
            await coverFile.mv(coverPath);
        }

        const beat = new Beat({
            title: req.body.title || beatFile.name,
            description: req.body.description,
            bpm: req.body.bpm,
            key: req.body.key,
            filePath: `beats/${beatFileName}`,
            coverPath: coverFileName ? `covers/${coverFileName}` : null,
            productUrl: req.body.productUrl // Diese Zeile hinzufügen
      
        });

        await beat.save();
        res.redirect('/admin');
    } catch (error) {
        console.error('Upload Fehler:', error);
        res.status(500).send('Fehler beim Upload: ' + error.message);
    }
});

// Beat löschen

router.delete('/admin/beat/:id', requireLogin, async (req, res) => {
    try {
        const beat = await Beat.findById(req.params.id);
        if (!beat) {
            return res.status(404).json({ message: 'Beat nicht gefunden' });
        }

        // Dateien löschen
        if (beat.filePath) {
            const beatFilePath = path.join(__dirname, '../uploads', beat.filePath);
            if (fs.existsSync(beatFilePath)) {
                fs.unlinkSync(beatFilePath);
            }
        }
        
        if (beat.coverPath) {
            const coverFilePath = path.join(__dirname, '../uploads', beat.coverPath);
            if (fs.existsSync(coverFilePath)) {
                fs.unlinkSync(coverFilePath);
            }
        }

        // Beat aus der Datenbank löschen
        await Beat.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete Error:', error);
        res.status(500).json({ message: error.message });
    }
});



// Beat bearbeiten Route (GET)
router.get('/admin/beat/:id/edit', requireLogin, async (req, res) => {
    try {
        const beat = await Beat.findById(req.params.id);
        if (!beat) {
            return res.status(404).send('Beat nicht gefunden');
        }

        res.send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Beat bearbeiten</title>
                    <style>
                        body { 
                            font-family: Arial; 
                            max-width: 800px; 
                            margin: 20px auto; 
                            padding: 20px;
                            background-color: #f5f5f5;
                        }
                        .edit-form {
                            background: white;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .form-group {
                            margin-bottom: 15px;
                        }
                        .form-group label {
                            display: block;
                            margin-bottom: 5px;
                            font-weight: bold;
                        }
                        .form-group input[type="text"],
                        .form-group input[type="number"],
                        .form-group input[type="url"],
                        .form-group textarea,
                        .form-group select {
                            width: 100%;
                            padding: 8px;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                        }
                        button {
                            padding: 10px 20px;
                            background: #2c5282;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        }
                        button:hover {
                            background: #2a4365;
                        }
                    </style>
                </head>
                <body>
                    <div class="edit-form">
                        <h2>Beat bearbeiten: ${beat.title}</h2>
                        <form id="editForm">
                            <div class="form-group">
                                <label>Titel:</label>
                                <input type="text" name="title" value="${beat.title}" required>
                            </div>

                            <div class="form-group">
                                <label>Beschreibung:</label>
                                <textarea name="description">${beat.description || ''}</textarea>
                            </div>

                            <div class="form-group">
                                <label>BPM:</label>
                                <input type="number" name="bpm" value="${beat.bpm || ''}" min="1" max="999">
                            </div>

                            <div class="form-group">
                                <label>Key/Tonart:</label>
                                <select name="key">
                                    <option value="">-- Wähle Key --</option>
                                    ${['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
                                        .map(k => `<option value="${k}" ${beat.key === k ? 'selected' : ''}>${k}</option>`)
                                        .join('')}
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Produkt URL:</label>
                                <input type="url" name="productUrl" value="${beat.productUrl || ''}" placeholder="https://example.com/product">
                            </div>

                            <button type="submit">Änderungen speichern</button>
                            <a href="/admin" style="margin-left: 10px; text-decoration: none;">Zurück</a>
                        </form>
                    </div>

                    <script>
                        document.getElementById('editForm').addEventListener('submit', async (e) => {
                            e.preventDefault();
                            
                            const formData = new FormData(e.target);
                            const data = {
                                title: formData.get('title'),
                                description: formData.get('description'),
                                bpm: formData.get('bpm'),
                                key: formData.get('key'),
                                productUrl: formData.get('productUrl')
                            };

                            try {
                                const response = await fetch('/admin/beat/${beat._id}', {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(data)
                                });

                                if (response.ok) {
                                    alert('Beat erfolgreich aktualisiert');
                                    window.location.href = '/admin';
                                } else {
                                    const error = await response.json();
                                    alert('Fehler beim Aktualisieren: ' + error.message);
                                }
                            } catch (error) {
                                console.error('Fehler:', error);
                                alert('Fehler beim Aktualisieren des Beats');
                            }
                        });
                    </script>
                </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('Server Fehler: ' + error.message);
    }
});
router.get('/admin/beat/:id/edit', requireLogin, async (req, res) => {
    try {
        const beat = await Beat.findById(req.params.id);
        if (!beat) {
            return res.status(404).send('Beat nicht gefunden');
        }

        res.send(`
            <h2>Beat bearbeiten: ${beat.title}</h2>
            <form id="editForm">
                <div>
                    <label>Titel:</label>
                    <input type="text" name="title" value="${beat.title}" required>
                </div>
                <div>
                    <label>Beschreibung:</label>
                    <textarea name="description">${beat.description || ''}</textarea>
                </div>
                <div>
                    <label>BPM:</label>
                    <input type="number" name="bpm" value="${beat.bpm || ''}" min="1" max="999">
                </div>
                <button type="submit">Speichern</button>
                <a href="/admin">Zurück</a>
            </form>

            <script>
                document.getElementById('editForm').onsubmit = async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = {
                        title: formData.get('title'),
                        description: formData.get('description'),
                        bpm: formData.get('bpm')
                    };

                    try {
                        await fetch('/admin/beat/${beat._id}', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        });
                        window.location.href = '/admin';
                    } catch (error) {
                        alert('Fehler beim Speichern');
                    }
                };
            </script>
        `);
    } catch (error) {
        res.status(500).send('Fehler: ' + error.message);
    }
});

router.put('/admin/beat/:id', requireLogin, async (req, res) => {
    try {
        await Beat.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            bpm: req.body.bpm,
            key: req.body.key,
            productUrl: req.body.productUrl  // Diese Zeile hinzufügen
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/beats-list', async (req, res) => {
    try {
        const beats = await Beat.find().sort({ createdAt: -1 });
        res.json(beats);
    } catch (error) {
        console.error('Error fetching beats:', error);
        res.status(500).json({ error: 'Fehler beim Laden der Beats' });
    }
});
module.exports = router;
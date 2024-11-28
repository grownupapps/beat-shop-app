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
                    .form-group {
                        margin-bottom: 15px;
                        text-align: left;
                    }
                    .form-group label {
                        display: block;
                        margin-bottom: 5px;
                        font-weight: bold;
                    }
                    .form-group input[type="text"],
                    .form-group input[type="number"],
                    .form-group textarea,
                    .form-group select {
                        width: 100%;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    }
                    #coverPreview {
                        margin-top: 10px;
                        max-width: 200px;
                        max-height: 200px;
                    }
                    #coverPreview img {
                        width: 100%;
                        height: auto;
                        border-radius: 4px;
                    }
                    body { 
                        font-family: Arial; 
                        max-width: 800px; 
                        margin: 20px auto; 
                        padding: 20px;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                    }
                    .upload-form {
                        border: 2px dashed #ccc;
                        padding: 20px;
                        margin: 20px 0;
                        text-align: center;
                    }
                    .beats-list {
                        margin-top: 20px;
                    }
                    .beat-item {
                        background: #f5f5f5;
                        padding: 15px;
                        margin: 10px 0;
                        border-radius: 4px;
                    }
                    .logout-btn {
                        padding: 8px 16px;
                        background: #e53e3e;
                        color: white;
                        text-decoration: none;
                        border-radius: 4px;
                    }
                    .logout-btn:hover {
                        background: #c53030;
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
                    .beat-actions {
                        margin-top: 10px;
                        display: flex;
                        gap: 10px;
                    }
                    .edit-btn, .delete-btn {
                        padding: 6px 12px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: 500;
                    }
                    .edit-btn {
                        background: #2c5282;
                        color: white;
                    }
                    .delete-btn {
                        background: #e53e3e;
                        color: white;
                    }
                    .edit-btn:hover {
                        background: #2a4365;
                    }
                    .delete-btn:hover {
                        background: #c53030;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Producer Dashboard</h1>
                    <a href="/logout" class="logout-btn">Logout</a>
                </div>
                
                <div class="upload-form">
                    <h3>Beat hochladen</h3>
                    <form action="/admin/upload" method="post" enctype="multipart/form-data">
                        <div class="form-group">
                            <label>Beat Datei:</label>
                            <input type="file" name="beat" accept="audio/*" required>
                        </div>

                        <div class="form-group">
                            <label>Cover Bild:</label>
                            <input type="file" name="cover" accept="image/*" required>
                            <div id="coverPreview"></div>
                        </div>

                        <div class="form-group">
                            <label>Titel:</label>
                            <input type="text" name="title" required>
                        </div>

                        <div class="form-group">
                            <label>Beschreibung:</label>
                            <textarea name="description" rows="3"></textarea>
                        </div>

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

                        <button type="submit">Hochladen</button>
                    </form>
                </div>

                <div class="beats-list">
                    <h3>Deine Beats</h3>
                    <div id="beatsList"></div>
                </div>

                <script>
                async function loadBeats() {
                    try {
                        const response = await fetch('/beats-list');
                        const beats = await response.json();
                        const beatsListDiv = document.getElementById('beatsList');
                        beatsListDiv.innerHTML = '';
                        
                    beats.forEach(beat => {
    const beatDiv = document.createElement('div');
    beatDiv.className = 'beat-item';
    beatDiv.innerHTML = \`
        <div class="beat-content">
            \${beat.coverPath ? \`<img src="/uploads/\${beat.coverPath}" class="beat-cover" alt="\${beat.title}">\` : ''}
            <div class="beat-info">
                <h3>\${beat.title}</h3>
                \${beat.description ? \`<p>\${beat.description}</p>\` : ''}
                <p>BPM: \${beat.bpm || 'N/A'} | Key: \${beat.key || 'N/A'}</p>
                <div class="beat-actions">
                    <button onclick="editBeat('\${beat._id}')" class="edit-btn">Bearbeiten</button>
                    <button onclick="deleteBeat('\${beat._id}')" class="delete-btn">Löschen</button>
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
                            loadBeats(); // Liste neu laden
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
router.post('/admin/upload', requireLogin, async (req, res) => {
    try {
        if (!req.files || !req.files.beat) {
            return res.status(400).send('Keine Beat-Datei hochgeladen.');
        }

        const beatFile = req.files.beat;
        const coverFile = req.files.cover;
        
        const beatFileName = `beat_${Date.now()}_${beatFile.name}`;
        const beatPath = path.join(__dirname, '../uploads/beats', beatFileName); // Pfad korrigiert
        await beatFile.mv(beatPath);

        let coverFileName = null;
        if (coverFile) {
            coverFileName = `cover_${Date.now()}_${coverFile.name}`;
            const coverPath = path.join(__dirname, '../uploads/beats', coverFileName); // Pfad korrigiert
            await coverFile.mv(coverPath);
        }

        const beat = new Beat({
            title: req.body.title || beatFile.name,
            description: req.body.description,
            bpm: req.body.bpm,
            key: req.body.key,
            filePath: `beats/${beatFileName}`, // Dieser Pfad sollte stimmen
            coverPath: coverFileName ? `beats/${coverFileName}` : null // Dieser auch
        });

        await beat.save();
        res.redirect('/admin');
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).send('Fehler beim Upload: ' + error.message);
    }
});
// Beats auflisten
router.get('/beats-list', async (req, res) => {
    try {
        const beats = await Beat.find().sort({ createdAt: -1 });
        res.json(beats);
    } catch (error) {
        console.error('Error fetching beats:', error);
        res.status(500).json([]);
    }
});

// Beat löschen

router.delete('/admin/beat/:id', requireLogin, async (req, res) => {
    try {
        const beat = await Beat.findById(req.params.id);
        if (!beat) {
            return res.status(404).json({ error: 'Beat nicht gefunden' });
        }

        // Dateien löschen - Pfade korrigiert
        if (beat.filePath) {
            const beatFilePath = path.join(__dirname, '../beats', beat.filePath.replace('beats/', '')); // Pfad korrigiert
            fs.unlink(beatFilePath, err => {
                if (err) console.error('Fehler beim Löschen der Beat-Datei:', err);
            });
        }
        if (beat.coverPath) {
            const coverFilePath = path.join(__dirname, '../beats', beat.coverPath.replace('beats/', '')); // Pfad korrigiert
            fs.unlink(coverFilePath, err => {
                if (err) console.error('Fehler beim Löschen des Covers:', err);
            });
        }

        await Beat.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Serverfehler beim Löschen' });
    }
});

// Füge diese Route in admin.js ein, direkt vor module.exports = router;

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
                        .current-files {
                            margin: 10px 0;
                            padding: 10px;
                            background: #f8f8f8;
                            border-radius: 4px;
                        }
                        .preview-image {
                            max-width: 200px;
                            max-height: 200px;
                            margin: 10px 0;
                            border-radius: 4px;
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
                                key: formData.get('key')
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
            key: req.body.key  // Fügen Sie das key-Feld hinzu
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
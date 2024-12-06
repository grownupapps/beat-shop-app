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

// 4. Upload-Verzeichnisse erstellen
const uploadsPath = path.join(__dirname, 'uploads');
const beatsPath = path.join(__dirname, 'uploads/beats');
const coversPath = path.join(__dirname, 'uploads/covers');

// Erstellt die Ordner, falls sie nicht existieren
[uploadsPath, beatsPath, coversPath].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Verzeichnis erstellt: ${dir}`);
    }
});

// 5. Express App initialisieren
const app = express();

// 6. MongoDB Verbindung
mongoose.connect('mongodb+srv://joshuafrehse96:6tuPGd6TaDa6nox9@cluster0.eyspo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Verbindung erfolgreich!');
}).catch(err => {
    console.error('MongoDB Verbindungsfehler:', err);
});

// 7. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB Limit
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
    secret: 'beat-shop-secret',
    resave: false,
    saveUninitialized: false
}));

// 8. Admin Routes einbinden
const adminRoutes = require('./routes/admin');
app.use('/', adminRoutes);

// Öffentliche Seite (Player für Kunden)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Premium Beats</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body { 
                        font-family: 'Montserrat', sans-serif;
                        background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
                        color: #ffffff;
                        line-height: 1.6;
                        min-height: 100vh;
                        padding: 2rem;
                    }

                    .container {
                        max-width: 1400px;
                        margin: 0 auto;
                    }

                    #beatsList {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 2rem;
                        padding: 1rem;
                    }

                    .beat-card {
                        position: relative;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 20px;
                        overflow: hidden;
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                        border: 1px solid rgba(212, 175, 55, 0.2);
                        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                    }

                    .beat-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 12px 30px rgba(212, 175, 55, 0.2);
                    }

                    .wishlist-heart-button {
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: transparent;
                        border: none;
                        cursor: pointer;
                        padding: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: transform 0.2s ease;
                        border-radius: 50%;
                        z-index: 7;
                    }

                    .wishlist-heart-button:hover {
                        transform: scale(1.1);
                    }

                    .heart-icon {
                        fill: #ffebee;
                        stroke: #ff0000;
                        stroke-width: 1.5px;
                        transition: all 0.3s ease;
                    }

                    .heart-icon.active {
                        fill: #ff0000;
                        transform: scale(1.1);
                    }

                    .wishlist-notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        padding: 15px 25px;
                        border-radius: 8px;
                        z-index: 1000;
                        opacity: 0;
                        visibility: hidden;
                        transition: opacity 0.3s, visibility 0.3s;
                    }

                    .wishlist-notification.show {
                        opacity: 1;
                        visibility: visible;
                    }

                    .beat-content {
                        display: flex;
                        gap: 1.5rem;
                        padding: 1.5rem;
                        flex: 1;
                    }

                    .beat-cover {
                        width: 140px;
                        height: 140px;
                        object-fit: cover;
                        border-radius: 15px;
                        border: 2px solid rgba(212, 175, 55, 0.3);
                        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    }

                    .beat-info {
                        flex: 1;
                    }

                    .beat-info h3 {
                        font-size: 1.5rem;
                        margin-bottom: 0.8rem;
                        color: #D4AF37;
                        font-weight: 600;
                    }

                    .beat-info p {
                        color: #e0e0e0;
                        margin-bottom: 1rem;
                        font-size: 1rem;
                    }

                    .beat-metadata {
                        display: inline-block;
                        background: rgba(212, 175, 55, 0.1);
                        padding: 0.4rem 0.8rem;
                        border-radius: 25px;
                        margin-right: 0.8rem;
                        margin-bottom: 0.5rem;
                        font-size: 0.9rem;
                        color: #D4AF37;
                        border: 1px solid rgba(212, 175, 55, 0.3);
                    }

                    .product-button {
                        display: inline-block;
                        background: #D4AF37;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 25px;
                        text-decoration: none;
                        margin-top: 15px;
                        transition: all 0.3s ease;
                        font-weight: bold;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }

                    .product-button:hover {
                        background: #C5A028;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    }

                    .audio-container {
                        padding: 1.2rem;
                        background: rgba(0, 0, 0, 0.3);
                        border-top: 1px solid rgba(212, 175, 55, 0.2);
                    }

                    audio {
                        width: 100%;
                        height: 36px;
                    }

                    audio::-webkit-media-controls-panel {
                        background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
                        border: 1px solid rgba(212, 175, 55, 0.3);
                    }

                    audio::-webkit-media-controls-play-button,
                    audio::-webkit-media-controls-mute-button {
                        filter: sepia(100%) saturate(400%) brightness(95%);
                    }

                    @media (max-width: 1200px) {
                        .container {
                            max-width: 960px;
                        }
                        .beat-cover {
                            width: 120px;
                            height: 120px;
                        }
                    }

                    @media (max-width: 992px) {
                        #beatsList {
                            grid-template-columns: 1fr;
                        }
                        .beat-cover {
                            width: 140px;
                            height: 140px;
                        }
                        body {
                            padding: 1rem;
                        }
                    }

                    @media (max-width: 576px) {
                        .beat-content {
                            flex-direction: column;
                            align-items: center;
                            text-align: center;
                        }
                        .header h1 {
                            font-size: 2.5rem;
                        }
                        .beat-cover {
                            width: 160px;
                            height: 160px;
                        }
                        .beat-info h3 {
                            font-size: 1.2rem;
                        }
                        .beat-metadata {
                            font-size: 0.8rem;
                            padding: 0.3rem 0.6rem;
                        }
                        body {
                            padding: 0.5rem;
                        }
                    }

                    @media (orientation: landscape) and (max-height: 500px) {
                        .beat-content {
                            flex-direction: row;
                        }
                        .beat-cover {
                            width: 100px;
                            height: 100px;
                        }
                    }
                </style>
            </head>
            <body>
                <div id="beatsList"></div>
                <div class="wishlist-notification">Markierte Beats werden in deiner Shopify Wishlist gespeichert!</div>

                <script>
                    // Audio Control Funktionen
                    function setupAudioControl(audioElements) {
                        audioElements.forEach(audio => {
                            audio.addEventListener('play', () => {
                                audioElements.forEach(otherAudio => {
                                    if (otherAudio !== audio && !otherAudio.paused) {
                                        otherAudio.pause();
                                        otherAudio.currentTime = 0;
                                    }
                                });
                            });
                        });
                    }

                    function initAudioControl() {
                        const audioElements = Array.from(document.querySelectorAll('audio'));
                        setupAudioControl(audioElements);
                        
                        const observer = new MutationObserver((mutations) => {
                            mutations.forEach((mutation) => {
                                if (mutation.addedNodes.length) {
                                    const newAudioElements = Array.from(document.querySelectorAll('audio'));
                                    setupAudioControl(newAudioElements);
                                }
                            });
                        });
                        
                        observer.observe(document.body, {
                            childList: true,
                            subtree: true
                        });
                    }

                    function toggleWishlist(button, productUrl) {
                        const heartIcon = button.querySelector('.heart-icon');
                        const isActive = heartIcon.classList.contains('active');
                        const notification = document.querySelector('.wishlist-notification');
                        
                        heartIcon.classList.toggle('active');
                        notification.classList.add('show');
                        
                        setTimeout(() => {
                            notification.classList.remove('show');
                        }, 5000);
                        
                        const productId = productUrl.split('/products/')[1]?.split('?')[0];
                        
                        if (productId) {
                            if (!isActive) {
                                console.log('Zur Wunschliste hinzugefügt:', productId);
                            } else {
                                console.log('Von Wunschliste entfernt:', productId);
                            }
                        }
                    }

                    // Beats laden und anzeigen
                    fetch('/beats-list')
                        .then(res => res.json())
                        .then(beats => {
                            const beatsListDiv = document.getElementById('beatsList');
                            beats.forEach(beat => {
                                const beatDiv = document.createElement('div');
                                beatDiv.className = 'beat-card';
                                beatDiv.innerHTML = \`
                                    <div class="beat-content">
                                        \${beat.productUrl ? \`
                                            <button onclick="toggleWishlist(this, '\${beat.productUrl}')" 
                                                    class="wishlist-heart-button"
                                                    aria-label="Zur Wunschliste hinzufügen">
                                                <svg class="heart-icon" viewBox="0 0 24 24" width="28" height="28">
                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                                </svg>
                                            </button>
                                        \` : ''}
                                        \${beat.coverPath ? \`<img src="/uploads/\${beat.coverPath}" class="beat-cover" alt="\${beat.title}">\` : ''}
                                        <div class="beat-info">
                                            <h3>\${beat.title}</h3>
                                            \${beat.description ? \`<p>\${beat.description}</p>\` : ''}
                                            <div class="beat-metadata-container">
                                                <span class="beat-metadata">BPM: \${beat.bpm || 'N/A'}</span>
                                                <span class="beat-metadata">Key: \${beat.key || 'N/A'}</span>
                                               



                                                \${beat.productUrl ? \`
                                                    <a href="\${beat.productUrl}" target="_blank" class="product-button">
                                                        Zum Produkt
                                                    </a>
                                                \` : ''}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="audio-container">
                                        <audio controls>
                                            <source src="/uploads/\${beat.filePath}" type="audio/mpeg">
                                        </audio>
                                    </div>
                                \`;
                                beatsListDiv.appendChild(beatDiv);
                            });
                            // Nach dem Laden der Beats Audio-Control initialisieren
                            initAudioControl();
                        });

                    // Initial Audio-Control aufrufen
                    document.addEventListener('DOMContentLoaded', initAudioControl);
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
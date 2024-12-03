const mongoose = require('mongoose');

const pageSettingsSchema = new mongoose.Schema({
    headerTitle: {
        type: String,
        default: 'Premium Beats'
    },
    headerSubtitle: {
        type: String,
        default: 'Entdecke deine nächste Hit-Produktion'
    }
});

module.exports = mongoose.model('PageSettings', pageSettingsSchema);

const mongoose = require('mongoose');
const markakSchema = new mongoose.Schema({

    marka_id:{
        type: Number
    },
    marka_nev: {
        required: true,
        type: String
    },
    orszag: {
        required: true,
        type: String
    },
    alapitas_ev: {
        required: true,
        type: Number
    }
})
module.exports = mongoose.model('Marka', markakSchema, 'markak')





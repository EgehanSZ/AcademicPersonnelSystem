import mongoose from 'mongoose';

const IlanSchema = new mongoose.Schema({
    baslik: {
        type: String,
        required: true
    },
    kategori: {
        type: String,
        enum: ['Dr. Öğr. Üyesi', 'Doçent', 'Profesör'],
        required: true
    },
    aciklama: {
        type: String,
        required: true
    },
    fakulte: {
        type: String,
        required: true
    },
    bolum: {
        type: String,
        required: true
    },
    kriterler: {
        gerekliEvraklar: [String],

    },
    baslangicTarihi: {
        type: Date,
        default: Date.now
    },
    bitisTarihi: {
        type: Date,
        required: true
    },
    basvuruDurum: {
        type: Boolean,
        default: false,

    },
    basvuranlar: [{
        type: String,
        ref: 'users'
    }],
    durum: {
        type: String,
        enum: ['aktif', 'kapandi', 'beklemede'],
        default: 'beklemede'
    },
    olusturan: {
        type: String,
        ref: 'users'
    },
    juriUyeleri: [{
        type: String,
        ref: 'users'
    }],

});

export default mongoose.model('listings', IlanSchema,);
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
    fakulte: String,
    bolum: String,
    kriterler: {
        gerekliEvraklar: [String],

    },
    baslangicTarihi: Date,
    bitisTarihi: Date,
    durum: {
        type: String,
        enum: ['aktif', 'kapandi', 'beklemede'],
        default: 'beklemede'
    },
    olusturan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
});

export default mongoose.model('listings', IlanSchema,);
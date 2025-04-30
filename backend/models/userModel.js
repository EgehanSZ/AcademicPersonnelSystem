import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    kullaniciId: {
        type: String,
        required: true,
        unique: true
    },
    sifre: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['aday', 'admin', 'yonetici', 'juri'],
        required: true,
        default: 'aday'
    },
    ad: {
        type: String,
        required: true
    },
    soyad: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true

    },
    dogumTarihi: {
        type: Date,
        required: true
    },

    adres: {
        type: String,
        required: true
    },
    telefon: {
        type: String,
        required: true
    },

    fakulte: {
        type: String,
        required: true
    },
    universite: {
        type: String,
        required: true
    },
    bolum: {
        type: String,
        required: true
    },
    mezuniyetYili: {
        type: Number,
        required: true
    },
    derece: {
        type: String,
        enum: ['lisans', 'yuksekLisans', 'doktora'],
        required: true
    },

    olusturmaTarihi: {
        type: Date,
        default: Date.now
    },
    resimUrl: String,
    basvurular: [{
        type: String,
     //   ref: 'listings'
    }]

});
export default mongoose.model('users', UserSchema);
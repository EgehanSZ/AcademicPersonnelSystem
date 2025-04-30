import User from '../models/userModel.js';
import Listing from '../models/listingModel.js';
import bcrypt from 'bcrypt';
import { uploadToS3 } from '../utils/s3.js'; // S3'e yükleme fonksiyonu
import { TCKimlikNoDogrula } from '../services/tckimlikService.js';
import { authenticateToken } from '../middleware/authMiddleware.js'
import jwt from 'jsonwebtoken'; // JWT kütüphanesi
import dotenv from 'dotenv'
dotenv.config({ path: './config.env' });


// Kullanıcı Oluşturma
export const createUser = async (req, res) => {
    try {
        const {
            kullaniciId,
            sifre,
            rol,
            ad,
            soyad,
            email,
            dogumTarihi,
            adres,
            telefon,
            fakulte,
            universite,
            bolum,
            mezuniyetYili,
            derece,
        } = req.body;


        // Kullanıcı zaten var mı kontrol et
        const exists = await User.findOne({ kullaniciId });
        if (exists) {
            return res.status(400).json({ message: 'Bu Kullanıcı Kayıtlı' });
        }

        //tckimlik doğrulama
        const dogumYili = new Date(dogumTarihi).getFullYear();
        const isValid = await TCKimlikNoDogrula(kullaniciId, ad, soyad, dogumYili);
        if (!isValid) {
            return res.status(401).json({ message: 'TCKimlik No Doğrulanamadı' });
        }

        // Şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(sifre, salt);
        const user = new User({
            kullaniciId,
            sifre: hash,
            rol,
            ad,
            soyad,
            email,
            dogumTarihi,
            adres,
            telefon,
            fakulte,
            universite,
            bolum,
            mezuniyetYili,
            derece,
            resimUrl: "",
        });
        await user.save();
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Sunucu hatası" });
    }
}
export const uploadProfilePhoto = async (req, res) => {
    try {
        const { kullaniciId } = req.body;
        const updatedUser = await User.findOneAndUpdate(
            { kullaniciId },
            { $set: { resimUrl: req.file ? await uploadToS3(req.file) : null } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        if (req.file) {
            return res.status(200).json({ message: 'Profil resmi yüklendi', resimUrl: updatedUser.resimUrl });
        } else {
            return res.status(400).json({ message: 'Resim dosyası bulunamadı' });
        }
    } catch (error) {
        console.log("S3 yükleme hatası:", error);
        return res.status(500).json({ message: "S3 yükleme hatası", error: error.message });
    }
}


//Kullanıcı Silme
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const exists = await User.findOne({ kullaniciId: id })
        if (!exists) {
            return res.status(404).json({ message: 'Kullanıcı Bulunamadı' })
        }
        await User.deleteOne({ kullaniciId: id })
        return res.status(200).json({ message: 'Kullanıcı Başarıyla Silindi' })
    } catch (error) {
        return res.status(500).json({ message: "Sunucu hatası" });
    }
}
//Tüm kullanıcıları Çekme
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
        if (users.length === 0) {
            return res.status(404).json({ message: 'Kullanıcı Bulunamadı' })
        }
        return res.status(200).json(users)


    } catch (error) {
        return res.status(500).json({ message: "Sunucu hatası" });
    }
}


export const loginUser = async (req, res) => {
    try {
        const { kullaniciId, sifre } = req.body;


        const user = await User.findOne({ kullaniciId });
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı Bulunamadı' });
        }


        const isPasswordValid = await bcrypt.compare(sifre, user.sifre);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Geçersiz Şifre' });
        }

        const token = jwt.sign(
            { kullaniciId: user.kullaniciId, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );


        // Giriş başarılı
        return res.status(200).json({ message: 'Giriş Başarılı', token });
    } catch (error) {
        return res.status(500).json({ message: "Sunucu hatası" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const kullaniciId = req.user.kullaniciId;

        // Kullanıcıyı bul
        const user = await User.findOne({ kullaniciId });
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        // Mevcut şifreyi doğrula
        const isMatch = await bcrypt.compare(currentPassword, user.sifre);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mevcut şifre yanlış.' });
        }

        // Yeni şifreyi hashle ve kaydet
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.sifre = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Şifre başarıyla güncellendi.' });
    } catch (error) {
        console.error('Şifre değiştirme hatası:', error);
        return res.status(500).json({ message: 'Sunucu hatası.' });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findOne({ kullaniciId: req.user.kullaniciId });
        if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const kullaniciId = req.user.kullaniciId;
        const updateFields = req.body;
        const user = await User.findOneAndUpdate(
            { kullaniciId },
            updateFields,
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        res.json(user);
    } catch (e) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

export const getJuriUsers = async (req, res) => {
    try {
        const juris = await User.find({ rol: 'juri' });
        if (juris.length === 0) {
            return res.status(404).json({ message: 'Jüri Bulunamadı' });
        }
        return res.status(200).json(juris);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Sunucu hatası", error: error.message });
    }
};
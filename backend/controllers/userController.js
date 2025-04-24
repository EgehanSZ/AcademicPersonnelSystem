import User from '../models/userModel.js';
import Listing from '../models/listingModel.js';
import bcrypt from 'bcrypt';
import { uploadToS3 } from '../utils/s3.js'; // S3'e yükleme fonksiyonu
import { TCKimlikNoDogrula } from '../services/tckimlikService.js';

//Kullanıcı Oluşturma
// export const createUser = async (req, res) => {
//     try {
//         const { kullaniciId, sifre, rol } = req.body

//         const exists = await User.findOne({ kullaniciId })
//         if (exists) {
//             return res.status(400).json({ message: 'Bu Kullanıcı Kayıtlı' })
//         }
//         const salt = await bcrypt.genSalt(10)
//         const hash = await bcrypt.hash(sifre, salt)

//         const user = new User({ kullaniciId, sifre: hash, rol });
//         await user.save();
//         return res.status(201).json(user)


//     } catch (error) {
//         return res.status(500).json({ message: "Sunucu hatası" });
//     }

// }

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
            unvan,
            telefon,
            telefon2,
            fakulte,
            bolum,
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
            return res.status(400).json({ message: 'TCKimlik No Doğrulanamadı' });
        }


        // Şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(sifre, salt);

        let resimUrl = null;
        if (req.file) {
            resimUrl = await uploadToS3(req.file);
        }

        const user = new User({
            kullaniciId,
            sifre: hash,
            rol,
            ad,
            soyad,
            email,
            dogumTarihi,
            adres,
            unvan,
            telefon,
            telefon2,
            fakulte,
            bolum,
            resimUrl
        });

        // Kaydet ve yanıtla
        await user.save();
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Sunucu hatası" });
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
//Emre
export const loginUser = async (req, res) => {
    try {
        const { kullaniciId, sifre } = req.body; // req.body üzerinden alıyoruz

        // Kullanıcıyı kontrol et
        const user = await User.findOne({ kullaniciId });
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı Bulunamadı' });
        }

        // Şifreyi doğrula
        const isPasswordValid = await bcrypt.compare(sifre, user.sifre);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Geçersiz Şifre' });
        }

        const token = jwt.sign(
            { id: user.kullaniciId, rol: user.rol }, //  BURADA NEDEN kullaniciId YERİNE _ıd KULLANILDI ???????
            'SECRET_KEY', // Gizli anahtar (env dosyasına taşıyın)
            { expiresIn: '1h' } // Token geçerlilik süresi
        );


        // Giriş başarılı
        return res.status(200).json({ message: 'Giriş Başarılı', user });
    } catch (error) {
        return res.status(500).json({ message: "Sunucu hatası" });
    }
};

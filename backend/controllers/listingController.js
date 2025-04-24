import Listing from '../models/listingModel.js';
import User from '../models/userModel.js';


// İlan oluşturma
export const createListing = async (req, res) => {
    try {
        const { baslik, kategori, fakulte, bolum, kriterler, baslangicTarihi, bitisTarihi } = req.body;

        const listing = new Listing({
            baslik,
            kategori,
            fakulte,
            bolum,
            kriterler,
            baslangicTarihi,
            bitisTarihi,
            olusturan: req.user.id // JWT'den gelen kullanıcı ID'si
        });

        await listing.save();
        return res.status(201).json({ message: 'İlan başarıyla oluşturuldu', listing });
    } catch (error) {
        console.error('İlan oluşturma hatası:', error);
        return res.status(500).json({ message: 'İlan oluşturulamadı' });
    }
};

// Kullanıcının başvuru listesini getirme
export const getApplicationList = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ kullaniciId: id }).populate('basvurular');
        if (!user || user.basvurular.length === 0) {
            return res.status(404).json({ message: 'Başvuru Bulunamadı' });
        }
        return res.status(200).json(user.basvurular);
    } catch (error) {
        console.error('Başvuru listesi getirme hatası:', error);
        return res.status(500).json({ message: 'Başvuru listesi getirilemedi' });
    }
};

// Tüm ilanları listeleme
export const getAllListings = async (req, res) => {
    try {
        // const listings = await Listing.find().populate('olusturan', 'isim soyad email');
        const listings = await Listing.find({});
        return res.status(200).json(listings);
    } catch (error) {
        console.error('İlanları getirme hatası:', error);
        return res.status(500).json({ message: 'İlanlar getirilemedi' });
    }
};

// İlan silme
export const deleteListing = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: 'İlan bulunamadı' });
        }

        // Sadece ilanı oluşturan kullanıcı silebilir
        if (listing.olusturan.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Bu ilanı silme yetkiniz yok' });
        }

        await Listing.findByIdAndDelete(id);
        return res.status(200).json({ message: 'İlan başarıyla silindi' });
    } catch (error) {
        console.error('İlan silme hatası:', error);
        return res.status(500).json({ message: 'İlan silinemedi' });
    }
};
// export const getListings = async (req, res) => {
//     try {
//         const listings = await Listing.find({});
//         if (listings.length === 0) {
//             return res.status(404).json({ message: 'İlan Bulunamadı Bulunamadı' })
//         }
//         return res.status(200).json(listings)

//     } catch (error) {
//         return res.status(500).json({ message: "Sunucu hatası" });
//     }


// }
// export const getApplicationList = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const user = await User.findOne({ kullaniciId: id }).populate('basvurular');
//         const listings = user.basvurular;
//         if (listings.length === 0) {
//             return res.status(404).json({ message: 'Başvuru Bulunamadı' })
//         }
//         return res.status(200).json(listings)

//     } catch (error) {

//     }
// }
// export const deleteListing = async (req, res) => {
//     try {
//         const { id } = req.params;
//         await Listing.findByIdAndDelete(id);
//         return res.status(200).json({ message: 'İlan Başarıyla Silindi' })

//     } catch (error) {

//     }

// }
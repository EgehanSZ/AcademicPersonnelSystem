import Listing from '../models/listingModel.js';
import User from '../models/userModel.js';
import { uploadToS3 } from '../utils/s3.js';
// İlan oluşturma
export const createListing = async (req, res) => {
    try {
        const { baslik, kategori, fakulte, bolum, aciklama, bitisTarihi } = req.body;

        const listing = new Listing({
            baslik,
            kategori,
            fakulte,
            bolum,
            aciklama,
            bitisTarihi,
            olusturan: req.user.kullaniciId
        });
        await listing.save();
        return res.status(201).json(listing);
    } catch (error) {
        console.error('İlan oluşturma hatası:', error);
        return res.status(500).json({ message: 'İlan oluşturulamadı' });
    }
};
export const updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const { baslik, kategori, aciklama, bolum, fakulte, bitisTarihi } = req.body;

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: 'İlan bulunamadı' });
        }

        // Sadece ilanı oluşturan kullanıcı güncelleyebilir
        if (listing.olusturan.toString() !== req.user.kullaniciId) {
            return res.status(403).json({ message: 'Bu ilanı güncelleme yetkiniz yok' });
        }

        listing.baslik = baslik || listing.baslik;
        listing.kategori = kategori || listing.kategori;
        listing.aciklama = aciklama || listing.aciklama;
        listing.bolum = bolum || listing.bolum;
        listing.fakulte = fakulte || listing.fakulte;
        listing.bitisTarihi = bitisTarihi || listing.bitisTarihi;

        await listing.save();
        return res.status(200).json(listing);
    } catch (error) {
        console.error('İlan güncelleme hatası:', error);
        return res.status(500).json({ message: 'İlan güncellenemedi' });
    }
}




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
        const listings = await Listing.find({});
        return res.status(200).json(listings);
    } catch (error) {
        console.error('İlanları getirme hatası:', error);
        return res.status(500).json({ message: 'İlanlar getirilemedi' });
    }
};

// İlan detayını getirme
export const getListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: 'İlan bulunamadı' });
        }
        return res.status(200).json(listing);
    } catch (error) {
        console.error('İlanı getirme hatası:', error);
        return res.status(500).json({ message: 'İlan getirilemedi' });
    }
};



export const listingApply = async (req, res) => {
    try {
        const kullaniciId = req.user.kullaniciId;
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: 'Lütfen bir dosya yükleyin.' });
        }

        let dosyaUrl;
        try {
            dosyaUrl = await uploadToS3(req.file);
        } catch (uploadErr) {
            console.error('S3 yükleme hatası:', uploadErr);
            return res.status(500).json({ message: 'Dosya yüklenirken hata oluştu.' });
        }


        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: 'İlan bulunamadı.' });
        }


        if (listing.basvuranlar.includes(kullaniciId)) {
            return res.status(400).json({ message: 'Bu ilana zaten başvurdunuz.' });
        }


        listing.basvuranlar.push(kullaniciId);
        listing.basvuruDurum = true;


        if (!listing.kriterler) {
            listing.kriterler = { gerekliEvraklar: [] };
        } else if (!Array.isArray(listing.kriterler.gerekliEvraklar)) {
            listing.kriterler.gerekliEvraklar = [];
        }
        listing.kriterler.gerekliEvraklar.push(dosyaUrl);


        await listing.save();
        return res.status(200).json({
            message: 'Başvuru başarıyla yapıldı.',
            dosyaUrl
        });

    } catch (error) {
        console.error('Başvuru sırasında hata:', error);
        return res.status(500).json({ message: 'Başvuru sırasında bir hata oluştu.' });
    }
};


export const getApplications = async (req, res) => {
    try {
        const applications = await Listing.find({ basvuruDurum: true });
        if (!applications) {
            return res.status(404).json({ message: 'Başvuru bulunamadı' });
        }
        return res.status(200).json(applications);

    } catch (error) {
        console.error('Başvuru getirme hatası:', error);
        return res.status(500).json({ message: 'Başvuru getirilemedi. Hata: ' + error.message });
    }
}
export const getApplicationsByJuri = async (req, res) => {
    try {
        const kullaniciId = req.user.kullaniciId;

        const listing = await Listing.find({
            basvuruDurum: true,
            juriUyeleri: kullaniciId
        });

        if (!listing || listing.length === 0) {
            return res.status(404).json({ message: 'Başvuru bulunamadı' });
        }

        return res.status(200).json(listing);

    } catch (error) {
        console.error('Başvuru getirme hatası:', error);
        return res.status(500).json({ message: 'Başvuru getirilemedi. Hata: ' + error.message });
    }
}



export const addJuriInListing = async (req, res) => {
    try {
        const { id } = req.params;
        const { kullaniciId } = req.body

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: 'İlan bulunamadı' });
        }

        if (listing.juriUyeleri.includes(kullaniciId)) {
            return res.status(400).json({ message: 'Bu jüri üyesi zaten eklenmiş' });
        }

        listing.juriUyeleri.push(kullaniciId);
        await listing.save();
        return res.status(200).json({ message: 'Jüri üyesi başarıyla eklendi' });
    } catch (error) {
        console.error('Jüri üyesi ekleme hatası:', error);
        return res.status(500).json({ message: 'Jüri üyesi eklenemedi' });
    }
}




// İlan silme
export const deleteListing = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: 'İlan bulunamadı' });
        }

        // Sadece ilanı oluşturan kullanıcı silebilir
        if (listing.olusturan.toString() !== req.user.kullaniciId) {
            return res.status(403).json({ message: 'Bu ilanı silme yetkiniz yok' });
        }

        await Listing.findByIdAndDelete(id);
        return res.status(200).json({ message: 'İlan başarıyla silindi' });
    } catch (error) {
        console.error('İlan silme hatası:', error);
        return res.status(500).json({ message: 'İlan silinemedi' });
    }
};

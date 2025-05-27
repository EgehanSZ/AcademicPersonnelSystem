# Akademik Personel Alım Sistemi

Bu proje, üniversitelerin akademik personel alım süreçlerini dijitalleştirmek amacıyla geliştirilmiş bir web tabanlı uygulamadır. Başvuru süreçleri, jüri atamaları, dosya kontrolü ve mülakat değerlendirmeleri gibi adımlar tek bir platformda toplanmıştır. Sistem, React.js ile frontend, Node.js ile backend, MongoDB ile veritabanı, AWS S3 ile dosya saklama ve JWT ile kimlik doğrulama kullanarak geliştirilmiştir.

## İçindekiler

- [Proje Tanımı](#proje-tanımı)
- [Teknolojiler](#teknolojiler)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Proje Yapısı](#proje-yapısı)
- [Çevresel Değişkenler](#çevresel-değişkenler)
- [Geliştirici Notları](#geliştirici-notları)
- [Katkıda Bulunma](#katkıda-bulunma)
- [Lisans](#lisans)

## Proje Tanımı

Akademik Personel Alım Sistemi, üniversite akademik kadrosu için başvuru sürecini dijital ortamda yönetmek amacıyla tasarlanmıştır. Adaylar başvurularını online olarak yapar, başvuruların değerlendirilmesi ve mülakat süreci ise sistem üzerinden gerçekleştirilir. Bu süreçleri kolaylaştıran ve şeffaf hale getiren sistem, yönetici, jüri ve aday gibi farklı rollerin kullanımına açıktır.

## Teknolojiler

- **Frontend:** React.js, Vite, React Router DOM, Ant Design, Bootstrap, React Bootstrap
- **Backend:** Node.js, Express.js
- **Veritabanı:** MongoDB (Mongoose)
- **Kimlik Doğrulama:** JWT (JSON Web Token)
- **Dosya Yükleme:** AWS S3, Multer
- **Çevre Değişkenleri:** dotenv
- **API İletişimi:** Axios
- **Tarih İşlemleri:** dayjs
- **Diğer:** cors, uuid, @aws-sdk/client-s3

## Kurulum 
## Frontend kurulumları
cd client

npm create vite@latest
npm install
npm install antd @ant-design/icons @ant-design/v5-patch-for-react-19
npm install bootstrap react-bootstrap
npm install react-router-dom
npm install axios
npm install dayjs

## Backend Kurulumları 
cd server

npm install express mongoose cors dotenv multer jsonwebtoken axios
npm install @aws-sdk/client-s3 uuid

### Gereksinimler

- Node.js ve npm kurulu olmalıdır.
- MongoDB Atlas ve AWS S3 hesaplarına sahip olunmalıdır.

### Adım 1: Projeyi Klonlayın

```bash
git clone https://github.com/EgehanSZ/AcademicPersonnelSystem.git
cd AcademicPersonnelSystem
```

### Adım 2: Bağımlılıkları Yükleyin

#### Frontend (client klasörü içinde)

```bash
cd frontend
npm install
```

#### Backend (server klasörü içinde)

```bash
cd ../backend
npm install
```

### Adım 3: Çevresel Değişkenleri Yapılandırın

Kök dizine `.env` dosyası oluşturun ve şu değişkenleri girin:

```env
ATLAS_URI=your-mongodb-uri
PORT=3000
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket
JWT_SECRET=your-jwt-secret
```

### Adım 4: Uygulamayı Başlatın

#### Frontend:

```bash
cd frontend
npm run dev
```

#### Backend:

```bash
cd backend
npm start
```

## Kullanım

- **Kayıt Olun:** Adaylar sistemde kayıt olabilir.
- **Başvuru Yapın:** Akademik pozisyonlara başvuruda bulunulabilir.
- **Jüri Atamaları:** Yönetici, jüri ataması yapabilir.
- **Mülakat ve Değerlendirme:** Jüri üyeleri adayları değerlendirebilir.
- **Belge Yükleme:** Adaylar AWS S3'e belgelerini yükleyebilir.

## Proje Yapısı

```
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── .env
├── package.json
└── README.md
```

## Çevresel Değişkenler

- `ATLAS_URI`
- `PORT`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_BUCKET_NAME`
- `JWT_SECRET`

## Geliştirici Notları

- Ant Design bileşenleri özelleştirilmiştir.
- Bootstrap ile temel responsive yapı desteklenmiştir.
- JWT ile güvenli kullanıcı kimlik doğrulama sağlanmıştır.
- AWS SDK v3 kullanılmıştır.

## Katkıda Bulunma

1. Fork'layın.
2. Yeni bir branch oluşturun: `git checkout -b feature-foo`
3. Değişiklikleri yapın ve commitleyin: `git commit -am 'Add feature'`
4. Push'layın: `git push origin feature-foo`
5. Pull request açın.

## Lisans

Bu proje MIT lisansı ile lisanslanmıştır.

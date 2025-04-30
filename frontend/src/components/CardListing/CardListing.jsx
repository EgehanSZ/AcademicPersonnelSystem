import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getListing, listingApply } from '../../services/listingApi'
import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';


const getKosullar = (kategori) => {
    if (!kategori) return [];
    // Türkçe karakterleri sadeleştir ve küçük harfe çevir
    const key = kategori
        .toLocaleLowerCase('tr-TR')
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ş/g, 's')
        .replace(/ü/g, 'u');
    switch (key) {
        case "dr. ogr. uyesi":
            return [
                "Yabancı dil puanı en az 65",
                "En az 4 yayın: 1 A1-A2, 2 A1-A4, 1 A1-A5 dergisinde",
                "En az 1 makalede başlıca yazar olunmalı",
                "Asgari faaliyet ve toplam puan koşulu sağlanmalı"
            ];
        case "docent":
            return [
                "Doçentlik unvanı alınmış olmalı",
                "Yabancı dil puanı en az 65",
                "6-7 yayın (alanına göre), en az 2 başlıca yazar",
                "En az 1-2 yüksek lisans/doktora danışmanlığı",
                "Proje görevleri ve faaliyet puan şartı"
            ];
        case "profesor":
            return [
                "Doçentlik sonrası en az 7 yayın: 3 A1-A2, 4 A1-A4",
                "En az 2 yüksek lisans veya 1 doktora danışmanlığı",
                "Proje görevleri (H.1-H.17) ve 3 başlıca yazar",
                "Asgari puan şartları sağlanmalı"
            ];
        default:
            return [];
    }
};

export const CardListing = () => {
    const [listing, setListing] = useState({})
    let params = useParams()
    let id = params.id
    const navigate = useNavigate();
    const [form] = Form.useForm();
    useEffect(() => {
        async function loadListings() {
            let data = await getListing(id)
            setListing(data)
        }
        loadListings()

    }, [id])

    const onFinish = async (values) => {
        const token = localStorage.getItem('token');
        if (!token) {
            message.error("Giriş yapılmamış. Lütfen tekrar giriş yapın.");
            return;
        }
      //    const decodedToken = jwtDecode(token);
      // const kullaniciId = decodedToken.kullaniciId;
       
      const file = values.dosya.originFileObj;
      try {
            const response = await listingApply(id, token,file);

            if (response.status === 200) {
                message.success("Başvuru Başarılı");
            } else if (response.status === 400) {
                message.error("Bu ilana zaten başvurdunuz");
            }
            else if (response.status === 404) {
                message.error("Başvuru Bulunamadı");
            } else if (response.status === 401) {
                message.error("Başvuru Hatası");
            } else if (response.status === 500) {
                message.error("Sunucu Hatası");
            } else {
                message.error("Başvuru Başarısız");
            }
        } catch (error) {
            message.error("Bir hata oluştu");
            console.error(error);
        }
    };


    return (
        <div style={{ padding: 24, textAlign: "left" }}>
            <Button onClick={() => navigate(-1)} type="link">← Geri Dön</Button>

            <Card title={listing.baslik} style={{ marginTop: 16 }}>
                <p><strong>Birim:</strong> {listing.bolum}</p>
                <p><strong>Kategori:</strong> {listing.kategori}</p>
                <p><strong>Açıklama:</strong> {listing.aciklama}</p>
                <p><strong>Son Başvuru Tarihi:</strong> {listing.basvuruSonTarihi ? new Date(listing.basvuruSonTarihi).toLocaleDateString('tr-TR') : "-"}</p>
            </Card>

            <Card title="Başvuru Koşulları ve Form" style={{ marginTop: 24 }}>
                <ul>
                    {getKosullar(listing.kategori).map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>

                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ marginTop: 24 }}
                    form={form}
                >
                    <Form.Item
                        name="dosya"
                        label="Belgeler (.zip/.pdf)"
                        valuePropName="file"
                        getValueFromEvent={e => e && e.fileList[0]}

                        rules={[{ required: true, message: "Lütfen belge yükleyin" }]}
                    >
                        <Upload beforeUpload={() => false} maxCount={1} accept=".zip,.pdf">
                            <Button icon={<UploadOutlined />}>Dosya Yükle</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Başvur
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );

};


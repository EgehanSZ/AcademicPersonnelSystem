import React, { useState, useEffect } from 'react';
import { ProList } from '@ant-design/pro-components';
import { Button, Space, Tag, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/theme.css';
import '../../app.css';
import { getListings } from '../../services/listingApi'
import { getApplicationList } from '../../services/listingApi';

// Başvuru durumu etiketlerini tanımla
const durumEtiketleri = {
    beklemede: { metin: 'Beklemede', renk: 'yellow' },
    onaylandi: { metin: 'Onaylandı', renk: 'green' },
    onaylanmadi: { metin: 'Onaylanmadı', renk: 'red' },
    iptalEdildi: { metin: 'İptal Edildi', renk: 'gray' },
    incelemede: { metin: 'İnceleniyor', renk: 'blue' },
};

export const Applications = () => {
    const navigate = useNavigate();
    const [basvurular, setBasvurular] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hata, setHata] = useState(null);

    useEffect(() => {
        const loadBasvurular = async () => {
            setLoading(true); // sadece bir kere çalışması yeterli
            setHata(null);
            try {
                const data = await getListings(); // eğer başvuruları çekmek istiyorsan getApplicationList kullan!
                setBasvurular(data);
            } catch (error) {
                let mesaj = 'Başvurular yüklenirken bir hata oluştu.';
                if (error instanceof Error) {
                    mesaj = error.message;
                }
                setHata(mesaj);
                message.error('Başvurular yüklenemedi. Lütfen tekrar deneyin.');
            } finally {
                setLoading(false);
            }
        };
        loadBasvurular();
    }, []); // ✅ sadece component mount edildiğinde çalışır


    if (hata) {
        return (
            <div className="hata-mesaji">
                <p>Hata: {hata}</p>
            </div>
        );
    }

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    if (!basvurular || basvurular.length === 0) {
        return <div>Henüz bir başvurunuz bulunmamaktadır.</div>;
    }

    return (
        <div style={{ padding: '16px' }}>
            <ProList
                rowKey="id"
                headerTitle="Başvurularım"
                metas={{
                    title: { dataIndex: 'ilanBasligi' },
                    description: { dataIndex: 'ilanAciklamasi' },
                    subTitle: {
                        render: (_, row) => (
                            <Space wrap>
                                <Tag color="blue">{`${row.ilanFakulte} - ${row.ilanBolum}`}</Tag>
                                <Tag color={durumEtiketleri[row.durum].renk}>
                                    {durumEtiketleri[row.durum].metin}
                                </Tag>
                            </Space>
                        ),
                    },
                    actions: {
                        render: (_, row) => [
                            <Button
                                type="link"
                                key="detay"
                                onClick={() => navigate(`/ilanlar/${row.ilanId}`)}
                            >
                                İlan Detayı
                            </Button>,
                        ],
                    },
                    extra: {
                        render: (_, row) => (
                            <div style={{ fontWeight: 'bold' }}>
                                Başvuru Tarihi: {new Date(row.basvuruTarihi).toLocaleDateString('tr-TR')}
                            </div>
                        ),
                    },
                }}
                dataSource={filtrelenmisIlanlar}
                style={{ maxWidth: '100%' }}
            />
        </div>
    );
};

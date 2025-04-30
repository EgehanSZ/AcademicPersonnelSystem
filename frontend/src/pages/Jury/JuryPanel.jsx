import React from "react";
import { Tag, Button, message, Space, } from "antd";
import { useNavigate } from "react-router-dom";
import './Jurypanel.css';
import { ProList } from "@ant-design/pro-components";
import { useState, useEffect } from 'react'
import { getApplicationsByJuri } from "../../services/listingApi";
import { jwtDecode } from 'jwt-decode';



const Jurypanel = () => {
    const [kategoriFiltre, setKategoriFiltre] = useState("all");
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loadingApplications, setLoadingApplications] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setLoadingApplications(true);
        getApplicationsByJuri(token)
            .then((res) => {
                if (res.status === 200) setApplications(res.data);
                else if (res.status === 403) message.error("Yetkiniz yok.");
                else if (res.status === 404) message.error("Başvuru bulunamadı.");
            })
            .catch((e) => {
                console.error(e);
                message.error("Başvurular yüklenirken hata oluştu.");
            })
            .finally(() => setLoadingApplications(false));
    }, []);


    const basvurulanIlanlar =
        kategoriFiltre === "all"
            ? applications
            : applications.filter((i) => i.kategori === kategoriFiltre);

    return (
        <div style={{ padding: 16 }}>
            <ProList
                rowKey="_id"
                headerTitle="Başvurular"
                toolBarRender={() => [
                    <Button key="all" onClick={() => setKategoriFiltre("all")}>
                        Tüm İlanlar
                    </Button>,
                    <Button key="doktor" onClick={() => setKategoriFiltre("Dr. Öğr. Üyesi")}>
                        Dr. Öğr. Üyesi
                    </Button>,
                    <Button key="docent" onClick={() => setKategoriFiltre("Doçent")}>
                        Doçent
                    </Button>,
                    <Button key="profesor" onClick={() => setKategoriFiltre("Profesör")}>
                        Profesör
                    </Button>,
                ]}
                pagination={{
                    pageSize: 10,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} arası gösteriliyor. Toplam ${total} başvuru`,
                }}
                metas={{
                    title: { dataIndex: "baslik" },
                    description: { dataIndex: "aciklama" },
                    subTitle: {
                        render: (_, row) => (
                            <Space wrap>
                                <Tag color="blue">{`${row.fakulte} - ${row.bolum}`}</Tag>
                                <Tag color="green">{row.kategori}</Tag>
                            </Space>
                        ),
                    },
                    actions: {
                        render: (_) => [
                            <Button
                                type="link"
                                key="geri"
                                onClick={() => setSelectedMenu("listings")}
                            >
                                Geri
                            </Button>,
                        ],
                    },
                    extra: {
                        render: (_, row) => (
                            <div style={{ fontWeight: "bold" }}>
                                Son Başvuru:{" "}
                                {new Date(row.bitisTarihi).toLocaleDateString("tr-TR")}
                            </div>
                        ),
                    },
                }}
                dataSource={basvurulanIlanlar}
                loading={loadingApplications}
            />
        </div>

    );
};

export default Jurypanel;

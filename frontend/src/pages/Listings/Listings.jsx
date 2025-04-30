import React from "react";
import { ProList } from "@ant-design/pro-components";
import { Button, Space, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import { getListings } from '../../services/listingApi'
import '../../assets/styles/theme.css';
import './listings.css';
import '../../app.css';

export const Listings = () => {
  const [kategoriFiltre, setKategoriFiltre] = useState("all");
  const navigate = useNavigate();
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadListings() {
      if (loading) return;
      setLoading(true);
      let data = await getListings()
      setListings(data);
      setLoading(false);
    }
    loadListings()
  }, [])
  if (listings.length === 0) {
    return <div>Loading...</div>;
  }

  const filtrelenmisIlanlar =
    kategoriFiltre === "all"
      ? listings
      : listings.filter((ilan) => ilan.kategori === kategoriFiltre);

  return (
    <div style={{ padding: "16px" }}>
      <ProList
        rowKey="id"
        headerTitle="Akademik Personel İlanları"
        toolBarRender={() => [
          <Button key="all" onClick={() => setKategoriFiltre("all")}>Tüm İlanlar</Button>,
          <Button key="doktor" onClick={() => setKategoriFiltre("Dr. Öğr. Üyesi")}>Dr. Öğr. Üyesi</Button>,
          <Button key="docent" onClick={() => setKategoriFiltre("Doçent")}>Doçent</Button>,
          <Button key="profesor" onClick={() => setKategoriFiltre("Profesör")}>Profesör</Button>,
        ]}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} arası gösteriliyor. Toplam ${total} ilan`
        }}
        metas={{
          title: { dataIndex: "baslik" },
          description: { dataIndex: "aciklama" },
          subTitle: {
            render: (_, row) => (
              <Space wrap>
                <Tag color="blue">{`${row.fakulte} - ${row.bolum}`}</Tag>
                <Tag color="green">
                  {row.kategori === "Dr. Öğr. Üyesi"
                    ? "Dr. Öğr. Üyesi"
                    : row.kategori === "Doçent"
                      ? "Doçent"
                      : "Profesör"}
                </Tag>
              </Space>

            ),
          },
          actions: {
            render: (_, row) => [
              <Button
                type="link"
                key="detay"
                onClick={() => navigate(`/ilanlar/${row._id}`)}
              >
                Detay
              </Button>
            ],
          },
          extra: {
            render: (_, row) => (
              <div style={{ fontWeight: "bold" }}>
                Son Başvuru: {new Date(row.bitisTarihi).toLocaleDateString('tr-TR')}
              </div>
            ),
          },
        }}
        dataSource={filtrelenmisIlanlar}
        style={{ maxWidth: "100%" }}
      />
    </div>
  );
};
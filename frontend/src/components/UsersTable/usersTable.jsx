import React from 'react';
import { useState, useEffect } from 'react'
import { Table } from 'antd';
import { getAllUsers, deleteUser } from '../../services/api'


export const UsersTable = () => {
    const [users, setUsers] = useState([])
    useEffect(() => {
        async function loadUsers() {
            let usersData = await getAllUsers();
            setUsers(usersData);

        }
        loadUsers();
    }, [users])
    const handleDelete = async (kullaniciId) => {
        try {
            await deleteUser(kullaniciId);
            setUsers((prevUsers) => prevUsers.filter((user) => user.kullaniciId !== kullaniciId));

        } catch (error) {
            console.error("Kullanıcı silinirken hata oluştu:", error);

        }
    }
    const columns = [
        { title: 'KullancıID', dataIndex: 'kullaniciId', key: 'kullaniciId' },
        { title: 'Name', dataIndex: 'ad', key: 'ad' },
        { title: 'Rol', dataIndex: 'rol', key: 'rol' },
        {
            title: 'İşlem',
            dataIndex: '',
            key: 'x',
            render: (text, record) => <a onClick={() => handleDelete(record.kullaniciId)}>Delete</a>,
        },
    ];


    const data = users.map((user) => {
        return {
            key: user._id,
            kullaniciId: user.kullaniciId,
            ad: user.ad,
            rol: user.rol,
        };
    });

    return (
        < Table
            columns={columns}
            expandable={{
                expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                rowExpandable: record => record.name !== 'Not Expandable',
            }}
            dataSource={data}
        />
    )
}



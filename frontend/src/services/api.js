import axios from "axios";
const URL = 'http://localhost:3000'

export async function getListings() {
    const response = await axios.get(`${URL}/listings`)

    if (response.status === 200) {
        return response.data
    } else {
        throw new Error('No data found')
    }
}

export async function createUser(userData) {
    try {
        const response = await axios.post(`${URL}/user-add`, userData)
        return response
    } catch (error) {
        if (error.response) {
            return error;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası')
        }

    }
}
export async function deleteUser(kullaniciId, token) {

    try {
        const token = localStorage.getItem('token')
        const response = await axios.delete(`${URL}/user-delete/${kullaniciId}`, { headers: { Authorization: `Bearer ${token}` } })
        return response
    } catch (error) {
        if (error.response) {

        } else {
            throw new Error('Sunucu veya Bağlantı Hatası')
        }

    }
}
export async function getAllUsers() {
    try {
        const response = await axios.get(`${URL}/user-getAll`)
        return response.data
    } catch (error) {
        if (error.response) {
            return error;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası')
        }

    }
}




export async function loginUser(userData) {
    try {
        const response = await axios.post(`${URL}/login`, userData);
        return response;
    } catch (error) {
        if (error.response) {
            return error;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası');
        }
    }
}

export async function createListing(listingData, token) {
    try {
        const response = await axios.post(`${URL}/listings/create`, listingData, {
            headers: {
                Authorization: `Bearer ${token}` // JWT token'ı ekliyoruz
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası');
        }
    }
}

export async function getAllListings() {
    try {
        const response = await axios.get(`${URL}/listings/all`);
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası');
        }
    }
}

export async function deleteListing(listingId, token) {
    try {
        const response = await axios.delete(`${URL}/listings/${listingId}`, {
            headers: {
                Authorization: `Bearer ${token}` // JWT token'ı ekliyoruz
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        } else {
            throw new Error('Sunucu veya Bağlantı Hatası');
        }
    }
}


// export async function getAdvertisement(id) {
//     const response = await axios.get(`${URL}/ilanlar/${id}`)

//     if (response.status === 200) {
//         return response.data
//     } else {
//         throw new Error('No data found')
//     }

// }
// export async function creatAdvertisement(advertisement) {
//     const response = await axios.post(`${URL}/ilanlar`, advertisement)

//     if (response.status === 200) {
//         return response
//     } else {
//         throw new Error('No data found')
//     }

// }
// export async function updateAdvertisement(id, advertisement) {
//     const response = await axios.put(`${URL}/ilanlar/${id}`, advertisement)

//     if (response.status === 200) {
//         return response
//     } else {
//         throw new Error('No data found')
//     }

// }
// export async function deleteAdvertisement(id) {
//     const response = await axios.delete(`${URL}/ilanlar/${id}`)

//     if (response.status === 200) {
//         return response
//     } else {
//         throw new Error('No data found')
//     }

// }

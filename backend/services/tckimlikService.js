import axios from 'axios';

// export const TCKimlikNoDogrula = async (TCKimlikNo, Ad, Soyad, DogumYili) => {
//   if (!TCKimlikNo || !Ad || !Soyad || !DogumYili) {
//     throw new Error('Eksik veya hatalı parametreler: TCKimlikNo, Ad, Soyad, DogumYili kontrol edin.');
//   }

//   const url = 'https://tckimlik.nvi.gov.tr/service/kpspublic.asmx';

//   const xml = `
//         <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
//           <soap:Body>
//             <TCKimlikNoDogrula xmlns="http://tckimlik.nvi.gov.tr/WS">
//               <TCKimlikNo>${TCKimlikNo}</TCKimlikNo>
//               <Ad>${Ad}</Ad>
//               <Soyad>${Soyad}</Soyad>
//               <DogumYili>${DogumYili}</DogumYili>
//             </TCKimlikNoDogrula>
//           </soap:Body>
//         </soap:Envelope>
//     `;

//   console.log('Gönderilen XML:', xml); // Hata ayıklama için log

//   try {
//     const response = await axios.post(url, xml, {
//       headers: {
//         'Content-Type': 'text/xml; charset=utf-8',
//         'SOAPAction': 'http://tckimlik.nvi.gov.tr/WS/TCKimlikNoDogrula',
//       },
//     });

//     console.log('SOAP Yanıtı:', response.data);

//     const result = response.data.includes('<TCKimlikNoDogrulaResult>true</TCKimlikNoDogrulaResult>');
//     return result;
//   } catch (error) {
//     console.error('SOAP Hatası:', error);
//     throw new Error('TCKimlik doğrulama sırasında bir hata oluştu');
//   }
// };


export const TCKimlikNoDogrula = async (TCKimlikNo, Ad, Soyad, DogumYili) => {
  const url = 'https://tckimlik.nvi.gov.tr/service/kpspublic.asmx'; // URL'yi burada tanımlayın

  const xml = `
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <TCKimlikNoDogrula xmlns="http://tckimlik.nvi.gov.tr/WS">
          <TCKimlikNo>${TCKimlikNo}</TCKimlikNo>
          <Ad>${Ad}</Ad>
          <Soyad>${Soyad}</Soyad>
          <DogumYili>${DogumYili}</DogumYili>
        </TCKimlikNoDogrula>
      </soap:Body>
    </soap:Envelope>
  `;

  try {
    const response = await axios.post(url, xml, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'http://tckimlik.nvi.gov.tr/WS/TCKimlikNoDogrula',
      },
    });

    const result = response.data.includes('<TCKimlikNoDogrulaResult>true</TCKimlikNoDogrulaResult>');
    return result;
  } catch (error) {
    console.error('SOAP Hatası:', error.response?.data || error.message);
    throw new Error('TCKimlik doğrulama sırasında bir hata oluştu');
  }
};
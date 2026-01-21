import axios from 'axios';

// =====================================================================
// 1. BASE URL AYARI (Android Emülatör İçin)
// =====================================================================
// Android emülatör, bilgisayarının 'localhost'una erişmek için 
// '10.0.2.2' IP adresini kullanır. 
// Eğer gerçek telefonda test edeceksen buraya bilgisayarının IP'sini yazmalısın.
// Örn: 'http://192.168.1.35:3000/api'
const BASE_URL = 'http://10.0.2.2:3000/api'; 

// =====================================================================
// 2. AXIOS ÖRNEĞİ OLUŞTURMA
// =====================================================================
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000, // Hocanın istediği 5 saniye kuralı
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// =====================================================================
// 3. İSTEK (REQUEST) INTERCEPTOR
// =====================================================================
// Her istek atılmadan önce burası çalışır.
// İleride "Token" eklemek istersen burayı kullanacağız.
apiClient.interceptors.request.use(
  async (config) => {
    // Örn: const token = await AsyncStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    
    // Şimdilik sadece log atalım, isteğin gittiğini görelim
    console.log(`[API REQUEST] ${config.method.toUpperCase()} -> ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================================
// 4. YANIT (RESPONSE) INTERCEPTOR (Hata Yönetim Merkezi)
// =====================================================================
// Sunucudan cevap geldiğinde önce burası karşılar.
apiClient.interceptors.response.use(
  (response) => {
    // Cevap başarılıysa (200 OK), direkt veriyi döndür.
    return response;
  },
  (error) => {
    // Hata Detaylarını Konsola Yaz (Debug için çok önemli)
    console.error('[API ERROR]', error.response?.data || error.message);

    let errorMessage = "Bir hata oluştu.";

    if (!error.response) {
      // Sunucuya hiç ulaşılamadıysa (İnternet yok veya Sunucu kapalı)
      errorMessage = "Sunucuya bağlanılamıyor. İnternetinizi kontrol edin.";
    } else {
      // Sunucudan gelen özel hata mesajı varsa onu al
      // Sema backend'de { "message": "Şifre yanlış" } dönüyorsa onu yakalarız.
      errorMessage = error.response.data?.message || errorMessage;
    }

    // Hatayı temizleyip fırlatıyoruz ki sayfalarımızda (LoginScreen vb.)
    // karmaşık objelerle değil, net mesajlarla uğraşalım.
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
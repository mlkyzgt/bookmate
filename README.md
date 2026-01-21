# Bookmate – Yapay Zeka Destekli Kitap Asistanı

**Bookmate**, okuyucuların kütüphanelerini dijital ortamda yönetmelerini, okudukları kitaplardan önemli alıntıları saklamalarını ve **yapay zeka desteğiyle** yeni kitaplar keşfetmelerini sağlayan bir **React Native mobil uygulamasıdır**.

---

## Temel Özellikler

- **Kütüphane Yönetimi**  
  Google Books API entegrasyonu ile kitap arama ve kişisel kütüphaneye ekleme.

- **Alıntı Defteri**  
  Kitaplara özel alıntıların CRUD işlemleri (Ekleme, Listeleme, Güncelleme, Silme) ile yönetimi.

- **Yapay Zeka Önerileri**  
  Groq API (Llama 3 70B) kullanılarak, kullanıcının kütüphanesine ve okuma zevklerine göre kişiselleştirilmiş kitap tavsiyeleri.

- **Gerçek Zamanlı Senkronizasyon**  
  Verilerin Cloud Firestore ile tüm cihazlar arasında anlık olarak senkronize edilmesi.

- **Profil Yönetimi**  
  Kullanıcı bilgilerini güncelleme ve okuma istatistiklerini takip etme.

---

## Teknik Mimari ve Kullanılan Teknolojiler

Uygulama, modern React Native pratikleri ve bileşen tabanlı mimari üzerine inşa edilmiştir.

### Genel Teknolojiler
- **Framework:** React Native (Functional Components)
- **Dil:** JavaScript (JSX)
- **Navigasyon:** React Navigation (Native Stack Navigator)
- **State Yönetimi:** React Hooks (`useState`, `useEffect`, `useRef`, `useContext`)

### Backend & Yapay Zeka
- **Backend as a Service (BaaS):** Firebase  
  - Authentication  
  - Cloud Firestore
- **Yapay Zeka:** Groq API / Llama 3 70B

### Dış Servisler & UI
- **API İletişimi:** Axios
- **Dış Servisler:** Google Books API
- **Görselleştirme:** Lottie Animations, Flash Message

---

## Bilgi Akışı ve Veri Yönetimi

Uygulama, React'in **Tek Yönlü Veri Akışı (Unidirectional Data Flow)** prensibini takip eder.

- **Props**  
  Üst bileşenlerden alt bileşenlere veri aktarımı  
  _(Örn: Kitap detaylarının ekranlar arasında aktarılması)_

- **State**  
  Bileşen içindeki dinamik verilerin yönetimi  
  _(Örn: Form girişleri, yükleme ve hata durumları)_

- **Asenkron İşlemler**  
  API istekleri ve veritabanı işlemleri `async/await` yapısı ile, kullanıcı arayüzünü bloke etmeden gerçekleştirilir.

- **Offline Yönetimi**  
  Firebase'in yerel önbellekleme özellikleri sayesinde veriler çevrimdışı durumda da görüntülenebilir.

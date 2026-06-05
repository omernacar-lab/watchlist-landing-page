# WatchList — Landing Page & Legal

WatchList uygulamasının tanıtım (waitlist) sayfası + Apple/Google için gizlilik
politikası ve kullanım şartları. Saf statik HTML/CSS/JS — derleme gerekmez.

## İçerik

| Dosya | Ne işe yarar |
|------|--------------|
| `index.html` | Landing page + bekleme listesi (waitlist) formu |
| `privacy.html` | Gizlilik Politikası (TR + EN) — **Apple App Store için zorunlu URL** |
| `terms.html` | Kullanım Şartları (TR + EN) — uygulama içiyle birebir aynı |
| `style.css` | Ortak stil (uygulamanın koyu + mor teması) |
| `lang.js` | TR/EN dil geçişi |
| `favicon.svg` | Sekme ikonu |
| `firestore-waitlist.rules` | Waitlist için Firestore güvenlik kuralı |

Sayfalar **iki dilli** (Türkçe varsayılan, sağ üstten TR/EN). Tarayıcı dili
İngilizce ise otomatik EN açılır; seçim tarayıcıda hatırlanır.

---

## 1) GitHub'a koy + GitHub Pages ile yayınla

1. GitHub'da yeni bir **public** repo aç: `watchlist-landing`.
2. Bu klasörü push'la:
   ```bash
   cd watchlist-landing
   git init
   git add .
   git commit -m "WatchList landing + privacy + terms"
   git branch -M main
   git remote add origin https://github.com/omernacar-lab/watchlist-landing-page.git
   git push -u origin main
   ```
3. Repo → **Settings → Pages** → *Build and deployment* → Source: **Deploy from a branch**,
   Branch: **main** / **/(root)** → Save.
4. ~1 dk sonra siteniz yayında:
   - Landing: `https://omernacar-lab.github.io/watchlist-landing-page/`
   - **Gizlilik (Apple'a verilecek): `https://omernacar-lab.github.io/watchlist-landing-page/privacy.html`**
   - Şartlar: `https://omernacar-lab.github.io/watchlist-landing-page/terms.html`

> Özel alan adı (örn. `watchlistapp.com`) istersen: Settings → Pages → Custom domain.
> Repo köküne `CNAME` dosyası eklenir. Apple'a o zaman özel domain URL'sini verirsin.

---

## 2) Waitlist formunu çalışır hale getir (Firebase)

E-postalar mevcut Firebase projenizin Firestore'una `waitlist` koleksiyonuna düşer.

1. **Firebase web config'i al:** Firebase Console → ⚙️ Project Settings →
   *Your apps* → Web uygulaması yoksa **Add app → Web** ile ekle →
   *SDK setup and configuration* → **Config**.
2. `index.html` içinde `FIREBASE_CONFIG = { ... }` bloğunu bu değerlerle değiştir.
   (Bu anahtarlar **public**'tir, repo'da durması güvenlidir — gizli değildir.)
3. **Firestore kuralını ekle:** `firestore-waitlist.rules` içindeki `match /waitlist/...`
   bloğunu uygulama projenizin `firestore.rules` dosyasına ekle, sonra:
   ```bash
   firebase deploy --only firestore:rules
   ```
4. Sayfada bir e-posta gir → **Firebase Console → Firestore → `waitlist`** altında
   belgeyi gör.

> Config yapıştırılmadan form "Form henüz yapılandırılmadı" uyarısı verir, hata atmaz.
> Spam endişesi olursa: Firebase App Check ekle veya Formspree'ye geç (READ015 notu).

---

## 3) Apple App Store Connect notları (önemli)

- **Privacy Policy URL** alanına `privacy.html` linkini gir (zorunlu).
- **App Privacy** (Data Collection) anketi: uygulama hesap için **e-posta**
  (ve Google girişinde **ad**) topluyor. Bunu beyan et:
  - *Contact Info → Email Address* → **Linked to user**, **App Functionality**,
    **Used for Tracking: NO**.
  - İstersen *User Content → watchlist* → Linked, App Functionality.
  - Analytics / Ads / Tracking: **hiçbiri**.
- ⚠️ Uygulamadaki `ios/Runner/PrivacyInfo.xcprivacy` şu an "veri toplanmıyor"
  (`NSPrivacyCollectedDataTypes` boş) diyor. Hesap için e-posta topladığımız için,
  App Store Connect anketinde yukarıdaki gibi e-postayı beyan etmek **tutarlılık
  açısından doğru olur**. (Manifest, App Store anketinden ayrıdır; çelişki
  yaratmamak için ikisini de e-posta yönünde tutmak en güvenlisi.)

---

## Düzenleme ipuçları

- Metinleri değiştirmek: `index.html` içindeki `window.I18N` sözlüğü (TR + EN).
- İletişim e-postası: tüm dosyalarda `omer_nacar@hotmail.com` geçiyor; destek
  adresin varsa toplu değiştir.
- Logoyu kendi PNG'nle değiştirmek istersen `favicon.svg` yerine `favicon.png`
  koy + `<link rel="icon">` satırlarını güncelle.

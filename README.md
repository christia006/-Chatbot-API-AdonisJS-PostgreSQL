# 🤖 Chatbot API — AdonisJS + PostgreSQL

Sebuah REST API sederhana untuk menyimpan dan mengelola pertanyaan pengguna serta jawaban dari chatbot eksternal Majadigi. Dibangun menggunakan **AdonisJS v5**, **PostgreSQL**, dan menggunakan middleware token untuk autentikasi.

---

## 💼 Contoh Kasus Nyata

| **Kasus** | **Solusi** |
|----------|------------|
| Chatbot layanan publik | Pengguna mengirim pertanyaan, bot memberikan jawaban |
| Riwayat percakapan pengguna | Semua pesan disimpan dan dapat diambil kembali |
| Akses percakapan aman | Hanya user dengan token yang bisa melihat isi percakapan |

---

 ## 🌟 Ketentuan Teknis 

### ✅ Gunakan AdonisJS versi 5
![AdonisJS v5](/images/AdonisJS%20versi%205.png)

### ✅ Gunakan PostgreSQL sebagai database
![PostgreSQL Schema](/images/postgressql.png)

![Schema PostgreSQL](/images/Schema%20postgresql.png)

### ✅ Gunakan Axios atau HttpContext.client untuk request ke API eksternal
![Gunakan Axios](/images/Gunakan%20Axios.png)

---

## 🌟 Nilai Plus / Bonus Features
### 🧪 Validasi input menggunakan Validator
![Validator](/images/Tambahkan%20validasi%20input%20menggunakan%20Validator.png)


### ✅ Menambahkan route lain seperti delete conversation/message
![Delete Conversation/Message](/images/ada%20route%20lain%20delete%20conversation%20dan%20message.png)



### 🔍 Filter params (search), Pagination (page, limit), preload relasi (lastMessage) di `/conversations`
![Filter & Pagination](/images/Filter%20params%20(search)%20,%20Pagination%20(page,%20limit),Preload%20relasi%20(lastMessage).png)

---

## 📩 Contoh Endpoint

- `GET /conversation`
  ![Get Conversation](/images/get%20conversation.png)

- `POST /question`
  ![Post Question](/images/post%20question.png)

- `GET /question`
  ![Get Question](/images/get%20question.png)

---

----

## 🔄 Alur Program (Secara Sederhana)

1. Pengguna mengirim pertanyaan via endpoint `POST /questions`
2. Sistem menyimpan pertanyaan ke database (`messages` & `conversations`)
3. API menghubungi chatbot eksternal dan menyimpan respon bot
4. Jawaban dikembalikan ke pengguna
5. Pengguna dapat melihat daftar percakapan atau isi pesan berdasarkan `sessionId` melalui `GET` endpoint

---
## 📡 API Documentation

### 🔹 Kirim Pertanyaan
**POST** `/questions`

- Menerima input pertanyaan dari pengguna.
- Menyimpan data ke database PostgreSQL (`conversations` dan `messages`).
- Mengirim pertanyaan ke API eksternal:
  [`https://api.majadigidev.jatimprov.go.id/api/external/chatbot/send-message`](https://api.majadigidev.jatimprov.go.id/api/external/chatbot/send-message)
- Respons dari API eksternal disimpan sebagai jawaban bot.

📌 **Catatan:**
- `session_id` boleh berupa UUID acak.
- Format input/output bebas.
- Dokumentasi API eksternal:  
  [`https://documentation-api-majadigi-beckend.vercel.app/chatbot.html`](https://documentation-api-majadigi-beckend.vercel.app/chatbot.html)

---

### 🔹 Ambil Semua Percakapan
**GET** `/conversation`

- Menampilkan seluruh percakapan dari database.
- Mendukung filter pencarian dengan query param `?search=keyword`.
- Mendukung pagination: `?page=1&limit=10`

---

### 🔹 Ambil Pesan dari Satu Percakapan
**GET** `/conversation/:id_or_uuid`

- Menampilkan semua pesan dalam percakapan tertentu berdasarkan:
  - `id` (numerik), atau
  - `session_id` (UUID)

---

### 🔹 Hapus Percakapan
**DELETE** `/conversation/:id_or_uuid`

- Menghapus percakapan dari database berdasarkan:
  - `id` (numerik), atau
  - `session_id` (UUID)
- Menghapus seluruh pesan yang terhubung dengan percakapan tersebut.

---

### 🔹 Hapus Pesan Tertentu
**DELETE** `/messages/:id`

- Menghapus pesan berdasarkan `id` dari tabel `messages`.
- Jika pesan yang dihapus adalah pesan terakhir dalam percakapan, maka `lastMessageId` akan diupdate otomatis.

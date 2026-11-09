# Card Battle

Game kartu gunting-batu-kertas berbasis web. Pemain dan bot masing-masing menerima 6 kartu acak. Setiap ronde pemain menyeret satu kartu ke arena untuk dilawankan dengan kartu bot. Pemain pertama yang mencapai 3 poin memenangkan pertandingan.

## Aturan

1. **Lapis pertama:** kategori berbeda ditentukan oleh aturan gunting-batu-kertas, berapa pun nilainya.
2. **Lapis kedua:** kategori sama ditentukan oleh nilai kartu (1–9) yang lebih tinggi.
3. Kategori dan nilai sama dianggap seri, tidak ada yang mendapat poin.
4. Karena ronde seri tidak memberi poin, kartu bisa habis sebelum ada yang mencapai 3 poin. Dalam kasus itu pemenang ditentukan dari skor tertinggi, atau pertandingan berakhir seri.

## Menjalankan Secara Lokal

Project memakai ES Modules sehingga harus dibuka melalui web server, bukan langsung lewat `file://`.

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

Unit test logika permainan (membutuhkan Node.js 20 atau lebih baru):

```bash
npm test
```

## Struktur Kode

```
index.html              Struktur meja permainan dan overlay menu
style.css               Layout responsif, tampilan kartu, dan status drag
package.json            Skrip unit test (tidak dibutuhkan untuk menjalankan game)
src/
  main.js               Menyusun modul dan mengatur alur ronde
  config.js             Konstanta permainan
  cards.js              Kategori kartu dan pembagian kartu acak
  rules.js              Perbandingan dua lapis (kategori, lalu nilai)
  match.js              State pertandingan: kartu di tangan, skor, kondisi menang
  bot.js                Strategi pemilihan kartu bot
  ui/
    drag-controller.js  Drag and drop berbasis Pointer Events
    table-view.js       Rendering state ke DOM
    card-element.js     Pembuatan elemen kartu
    overlay.js          Panel layar mulai dan hasil
  utils/
    random.js           Fungsi bantu angka acak
tests/
  rules.test.js         Pengujian aturan perbandingan
  match.test.js         Pengujian alur dan kondisi akhir pertandingan
```

## Keputusan Teknis

- **Logika murni terpisah dari UI.** `rules.js` dan `match.js` tidak menyentuh DOM sehingga dapat diuji langsung dengan `node --test`.
- **Dependency injection pada `Match`.** Fungsi pembagi kartu dan strategi bot dapat diganti saat pengujian, sehingga skenario seperti kartu habis atau skor seri bisa diuji secara deterministik.
- **Kartu diambil dari tangan (splice), bukan ditandai.** Kartu yang sudah dimainkan tidak mungkin dipakai lagi, dan memainkan kartu yang tidak ada di tangan akan menghasilkan error.
- **Pointer Events untuk drag and drop.** HTML5 Drag and Drop API tidak berjalan untuk sentuhan di sebagian besar browser mobile. Pointer Events menangani mouse dan sentuhan dengan satu jalur kode.
- **Event delegation.** Listener dipasang pada wadah kartu, bukan per kartu, sehingga kartu bisa dirender ulang tanpa memasang listener baru.
- **Seluruh arena menjadi drop zone.** Area yang besar lebih nyaman untuk jari dibanding slot kecil.
- **Kunci input selama reveal.** Kartu tidak bisa diseret saat hasil ronde ditampilkan sehingga dua ronde tidak dapat dimainkan bertumpuk.
- **Bot memilih tanpa melihat kartu pemain.** Pilihan bot acak dari kartu di tangannya sehingga ronde tetap adil.

## Library Eksternal

Tidak ada. Seluruh kode ditulis dengan JavaScript murni. Unit test memakai test runner bawaan Node.js.

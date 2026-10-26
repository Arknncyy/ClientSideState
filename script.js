const dataPortofolio = [
    {
        judul: "Anggota Divisi Dokumentasi — Komisi Komunikasi Sosial Gereja Boro",
        waktu: "2022 – Sekarang",
        deskripsi: "Aktif berkontribusi sejak tahun 2022 dalam perencanaan konten visual, pengelolaan arsip dokumentasi kegiatan, serta produksi materi publikasi digital gereja."
    },
    {
        judul: "Tim Dokumentasi Festival Kesenian Tradisional",
        waktu: "November 2025",
        deskripsi: "Bertanggung jawab dalam pengambilan rekaman visual udara (aerial footage) untuk dokumentasi dan siaran kegiatan seni budaya tradisional."
    },
    {
        judul: "Tim Dokumentasi Inisiasi Sanata Dharma",
        waktu: "Agustus 2026",
        deskripsi: "Bertanggung jawab dalam pengambilan dokumentasi untuk Inisiasi Sanata Dharma (Insadha)."
    }
];

const containerPortofolio = document.querySelector("#container-portofolio");
const btnTema = document.querySelector("#btn-tema");
const btnInfo = document.querySelector("#btn-info");
const kotakAside = document.querySelector("aside");
const formKomentar = document.querySelector("#form-komentar");
const daftarKomentar = document.querySelector("#daftar-komentar");
const pesanError = document.querySelector("#pesan-error");
const btnHapusSemua = document.querySelector("#btn-hapus-semua");
const inputNama = document.querySelector("#input-nama");
const inputPesan = document.querySelector("#input-pesan");

function toggleTema() {
    document.body.classList.toggle("dark-mode");
    const temaSekarang = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("tema", temaSekarang);
    if (btnTema) {
        btnTema.textContent = temaSekarang === "dark" ? "Mode Terang" : "Mode Gelap";
    }
}

function muatPreferensiTema() {
    const tema = localStorage.getItem("tema");
    if (tema === "dark") {
        document.body.classList.add("dark-mode");
        if (btnTema) btnTema.textContent = "Mode Terang";
    }
}

if (btnTema) {
    btnTema.addEventListener("click", toggleTema);
}

document.addEventListener("keydown", (e) => {
    const activeTag = document.activeElement.tagName;
    if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;

    if (e.key.toLowerCase() === "d") {
        toggleTema();
    }
});

function muatStatusAside() {
    const statusAside = localStorage.getItem("statusAside");
    if (statusAside === "tersembunyi" && kotakAside) {
        kotakAside.classList.add("tersembunyi");
    }
}

if (btnInfo && kotakAside) {
    btnInfo.addEventListener("click", () => {
        kotakAside.classList.toggle("tersembunyi");
        const isHidden = kotakAside.classList.contains("tersembunyi");
        localStorage.setItem("statusAside", isHidden ? "tersembunyi" : "tampil");
    });
}

function simpanLike(judulArtikel, jumlah) {
    const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};
    semuaLike[judulArtikel] = jumlah;
    localStorage.setItem("semuaLike", JSON.stringify(semuaLike));
}

function renderItemPortofolio(item) {
    const article = document.createElement("article");

    const judul = document.createElement("h3");
    judul.textContent = item.judul;

    const waktu = document.createElement("p");
    waktu.innerHTML = `<time>${item.waktu}</time>`;

    const deskripsi = document.createElement("p");
    deskripsi.textContent = item.deskripsi;

    const semuaLike = JSON.parse(localStorage.getItem("semuaLike")) || {};
    let jumlahLike = semuaLike[item.judul] || 0;

    const tombolLike = document.createElement("button");
    tombolLike.textContent = `Like (${jumlahLike})`;
    tombolLike.dataset.like = jumlahLike;
    tombolLike.style.marginRight = "8px";

    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus Item";
    tombolHapus.classList.add("btn-danger");

    article.appendChild(judul);
    article.appendChild(waktu);
    article.appendChild(deskripsi);
    article.appendChild(tombolLike);
    article.appendChild(tombolHapus);

    containerPortofolio.appendChild(article);
}

if (containerPortofolio) {
    dataPortofolio.forEach(renderItemPortofolio);

    containerPortofolio.addEventListener("mouseover", (e) => {
        const article = e.target.closest("article");
        if (article) article.classList.add("artikel-hover");
    });

    containerPortofolio.addEventListener("mouseout", (e) => {
        const article = e.target.closest("article");
        if (article) article.classList.remove("artikel-hover");
    });

    containerPortofolio.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON" && e.target.textContent === "Hapus Item") {
            e.target.closest("article").remove();
        }

        if (e.target.tagName === "BUTTON" && e.target.textContent.startsWith("Like")) {
            const article = e.target.closest("article");
            const judul = article.querySelector("h3").textContent;
            
            let jumlah = parseInt(e.target.dataset.like || 0);
            jumlah++;
            e.target.dataset.like = jumlah;
            e.target.textContent = `Like (${jumlah})`;

            simpanLike(judul, jumlah);
        }
    });
}

const formPortofolio = document.querySelector("#form-portofolio");
if (formPortofolio) {
    formPortofolio.addEventListener("submit", (e) => {
        e.preventDefault();

        const judul = document.querySelector("#input-judul-porto").value.trim();
        const waktu = document.querySelector("#input-waktu-porto").value.trim();
        const deskripsi = document.querySelector("#input-deskripsi-porto").value.trim();

        if (judul && waktu && deskripsi) {
            renderItemPortofolio({ judul, waktu, deskripsi });
            formPortofolio.reset();
        }
    });
}

function simpanKomentar(nama, pesan) {
    const daftar = JSON.parse(localStorage.getItem("komentar")) || [];
    daftar.push({ id: Date.now(), nama, pesan });
    localStorage.setItem("komentar", JSON.stringify(daftar));
}

function hapusKomentarDariStorage(id) {
    let daftar = JSON.parse(localStorage.getItem("komentar")) || [];
    daftar = daftar.filter(item => item.id !== id);
    localStorage.setItem("komentar", JSON.stringify(daftar));
}

function muatKomentar() {
    if (!daftarKomentar) return;
    daftarKomentar.innerHTML = "";
    const daftar = JSON.parse(localStorage.getItem("komentar")) || [];
    
    daftar.forEach((k) => {
        const li = document.createElement("li");
        li.dataset.id = k.id;

        const teksKomentar = document.createElement("span");
        teksKomentar.textContent = `${k.nama}: ${k.pesan}`;

        const btnHapusKomentar = document.createElement("button");
        btnHapusKomentar.textContent = "Hapus";
        btnHapusKomentar.classList.add("btn-danger");
        btnHapusKomentar.style.marginLeft = "10px";

        li.appendChild(teksKomentar);
        li.appendChild(btnHapusKomentar);
        daftarKomentar.appendChild(li);
    });
}

if (formKomentar) {
    formKomentar.addEventListener("submit", (e) => {
        e.preventDefault();

        const nama = inputNama.value.trim();
        const pesan = inputPesan.value.trim();

        if (nama === "" || pesan.length < 5) {
            if (pesanError) {
                pesanError.textContent = "Nama wajib diisi dan komentar minimal 5 karakter!";
                pesanError.classList.remove("tersembunyi");
            }
            return;
        }

        if (pesanError) pesanError.classList.add("tersembunyi");

        simpanKomentar(nama, pesan);
        muatKomentar();

        // Clear sessionStorage draf setelah dikirim
        sessionStorage.removeItem("drafNama");
        sessionStorage.removeItem("drafPesan");
        formKomentar.reset();
    });
}

if (daftarKomentar) {
    daftarKomentar.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON" && e.target.textContent === "Hapus") {
            const li = e.target.closest("li");
            const id = parseInt(li.dataset.id);
            
            hapusKomentarDariStorage(id);
            li.remove();
        }
    });
}

if (btnHapusSemua && daftarKomentar) {
    btnHapusSemua.addEventListener("click", () => {
        localStorage.removeItem("komentar");
        daftarKomentar.innerHTML = "";
    });
}

if (inputNama && inputPesan) {
    inputNama.value = sessionStorage.getItem("drafNama") || "";
    inputPesan.value = sessionStorage.getItem("drafPesan") || "";

    inputNama.addEventListener("input", () => {
        sessionStorage.setItem("drafNama", inputNama.value);
    });

    inputPesan.addEventListener("input", () => {
        sessionStorage.setItem("drafPesan", inputPesan.value);
    });
}

const btnReset = document.querySelector("#btn-reset");
if (btnReset) {
    btnReset.addEventListener("click", () => {
        const konfirmasi = confirm("Hapus semua data tersimpan (tema, like, komentar, & status aside)?");
        if (konfirmasi) {
            localStorage.clear();
            sessionStorage.clear();
            location.reload();
        }
    });
}

muatPreferensiTema();
muatStatusAside();
muatKomentar();
/* =========================
   State Management untuk Tema
   ========================= */
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    }
    
    applyTheme(theme) {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.updateToggleButton();
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
    
    updateToggleButton() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            if (this.currentTheme === 'dark') {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                themeToggle.title = "Switch to Light Mode";
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                themeToggle.title = "Switch to Dark Mode";
            }
        }
    }
    
    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
}

/* =========================
   Mini "database" produk
   ========================= */
const PRODUCTS = [
    {
        id: "p1",
        title: "Template Landing Page Modern",
        desc: "Template HTML responsive dengan layout bersih, cocok untuk startup dan freelancer. Termasuk file HTML, CSS, dan demo preview.",
        price: "Rp 79.000",
        img: "Asset/template1.jpg",
        category: "Template",
        tags: ["HTML", "Landing"],
        lynk: "https://lynk.id/produk-template-landing",
        demo: "Asset/template1-demo.jpg"
    },
    {
        id: "p2",
        title: "Template Portfolio Premium",
        desc: "One-page portfolio minimalis. Mudah dikustom, SEO-friendly, dan ringan.",
        price: "Rp 59.000",
        img: "Asset/template2.jpg",
        category: "Template",
        tags: ["Portfolio"],
        lynk: "https://lynk.id/produk-portfolio",
        demo: "Asset/template2-demo.jpg"
    },
    {
        id: "p3",
        title: "Pack Preset Lightroom - Urban",
        desc: "10 preset untuk tampilan urban/kontras. Cocok untuk feed Instagram.",
        price: "Rp 39.000",
        img: "Asset/preset-pack.jpg",
        category: "Preset",
        tags: ["Photos", "Lightroom"],
        lynk: "https://lynk.id/preset-urban",
        demo: "Asset/preset-demo.jpg"
    },
    {
        id: "p4",
        title: "QR & Barcode Tool (Frontend)",
        desc: "Tool JS sederhana untuk generate QR dari teks/URL. Termasuk source code.",
        price: "Rp 49.000",
        img: "Asset/tool-qr.jpg",
        category: "Tools",
        tags: ["JS", "Tools"],
        lynk: "https://lynk.id/qr-tools",
        demo: "Asset/qr-tool-demo.jpg"
    }
];

/* =========================
   Inisialisasi aplikasi
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
    // Inisialisasi Theme Manager
    window.themeManager = new ThemeManager();
    
    // Inisialisasi tahun
    document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());
    document.getElementById("year2") && (document.getElementById("year2").textContent = new Date().getFullYear());

    // Setup back button jika ada
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (document.referrer.includes(window.location.hostname)) {
                window.history.back();
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    // Render categories
    const cats = ["All", ...new Set(PRODUCTS.map(p => p.category))];
    const catList = document.getElementById("categoryList");
    if (catList) {
        cats.forEach(cat => {
            const btn = document.createElement("button");
            btn.className = "category-btn" + (cat === "All" ? " active" : "");
            btn.textContent = cat;
            btn.dataset.cat = cat;
            btn.addEventListener("click", () => {
                document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                renderProducts({category: cat});
            });
            catList.appendChild(btn);
        });
    }

    // Search functionality
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            renderProducts({query: searchInput.value});
        });
    }

    // Render initial products
    renderProducts();

    // Check if we're on product detail page
    if (window.location.search.includes("id=")) {
        initProductDetail();
    }
});

/* =============
   Render products
   ============= */
function renderProducts(options = {}) {
    const grid = document.getElementById("productGrid");
    if (!grid) return;
    
    const category = options.category || (document.querySelector(".category-btn.active") ? 
        document.querySelector(".category-btn.active").dataset.cat : "All");
    const query = (options.query || "").toLowerCase();

    const filtered = PRODUCTS.filter(p => {
        if (category && category !== "All" && p.category !== category) return false;
        if (query) {
            return p.title.toLowerCase().includes(query) || 
                   p.desc.toLowerCase().includes(query) || 
                   (p.tags && p.tags.join(" ").toLowerCase().includes(query));
        }
        return true;
    });

    grid.innerHTML = "";
    filtered.forEach(p => {
        const el = document.createElement("article");
        el.className = "card";
        el.innerHTML = `
            <img loading="lazy" src="${p.img}" alt="${escapeHtml(p.title)}" onerror="this.src='https://images.unsplash.com/photo-1558655146-364adaf1fcc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'">
            <h3>${escapeHtml(p.title)}</h3>
            <p class="muted">${escapeHtml(p.desc.substring(0,110))}...</p>
            <div class="meta">
                <div class="price">${p.price}</div>
                <div>
                    <a class="btn" href="product.html?id=${p.id}">Lihat</a>
                    <a class="btn primary" href="${p.lynk}" target="_blank" rel="noopener">Beli</a>
                </div>
            </div>
        `;
        grid.appendChild(el);
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="muted">Produk tidak ditemukan.</div>`;
    }
}

/* =========================
   Product detail page
   ========================= */
function initProductDetail(){
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (!id) {
        document.querySelector(".product-detail").innerHTML = "<p class='muted'>Produk tidak ditemukan.</p>";
        return;
    }

    const prod = PRODUCTS.find(p => p.id === id);
    if (!prod) {
        document.querySelector(".product-detail").innerHTML = "<p class='muted'>Produk tidak ditemukan.</p>";
        return;
    }

    // Update page title
    document.title = `${prod.title} • DigitalStore`;

    // Update product details
    document.getElementById("productImage").src = prod.img;
    document.getElementById("productTitle").textContent = prod.title;
    document.getElementById("productPrice").textContent = prod.price;
    document.getElementById("productDescription").textContent = prod.desc;
    document.getElementById("productCategory").textContent = prod.category;

    const tagsWrap = document.getElementById("productTags");
    tagsWrap.innerHTML = "";
    (prod.tags || []).forEach(t => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = t;
        tagsWrap.appendChild(span);
    });

    const buyBtn = document.getElementById("buyBtn");
    buyBtn.href = prod.lynk;

    // Demo button functionality
    const demoBtn = document.getElementById("previewDemo");
    const demoArea = document.getElementById("demoArea");
    if (demoBtn && demoArea) {
        demoBtn.addEventListener("click", () => {
            if (demoArea.hidden) {
                demoArea.hidden = false;
                const demoImage = prod.demo || prod.img;
                demoArea.innerHTML = `
                    <h4>Preview Demo</h4>
                    <p>Berikut adalah preview dari produk ${escapeHtml(prod.title)}:</p>
                    <img src="${demoImage}" alt="Demo ${escapeHtml(prod.title)}" style="width:100%; max-width:400px; border-radius:8px; margin-top:12px; border:2px solid var(--accent)">
                    <p style="margin-top:12px; font-size:0.9rem; color:var(--muted)">Gambar di atas menunjukkan contoh penggunaan produk.</p>
                `;
                demoBtn.textContent = "Sembunyikan Demo";
            } else {
                demoArea.hidden = true;
                demoBtn.textContent = "Lihat Demo";
            }
        });
    }
}

/* ==============
   Utility functions
   ============== */
function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
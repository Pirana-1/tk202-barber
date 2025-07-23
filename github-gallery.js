/**
 * TK202 Barber - GitHub Galeri Sistemi
 * GitHub API ile dinamik galeri yükleme
 */

class GithubGallery {
    constructor(containerId = 'gallery-container', loadingId = 'gallery-loading') {
        this.username = 'Pirana-1';       // GitHub kullanıcı adınız
        this.repo = 'tk202-barber';       // Repository adınız
        this.galleryPath = 'assets/gallery';
        this.apiBase = `https://api.github.com/repos/${this.username}/${this.repo}/contents`;
        this.githubToken = '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'; // GitHub Personal Access Token
        this.categories = {
            'sac-kesimi': 'Saç Kesimi',
            'sakal-trasi': 'Sakal Tıraşı',
            'sac-boyama': 'Saç Boyama',
            'salon': 'Salon'
        };
        this.containerId = containerId;
        this.loadingId = loadingId;
        this.container = null;
        this.loadingElement = null;
    }

    // Loading göster/gizle
    showLoading() {
        const loadingEl = document.getElementById(this.loadingId) || document.querySelector('.gallery-loading');
        if (loadingEl) {
            loadingEl.style.display = 'block';
        }
    }

    hideLoading() {
        const loadingEl = document.getElementById(this.loadingId) || document.querySelector('.gallery-loading');
        if (loadingEl) {
            loadingEl.style.display = 'none';
        }
    }

    // GitHub API'den klasör içeriğini çek
    async fetchFolderContents(folderPath) {
        try {
            const headers = {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${this.githubToken}`,
                'User-Agent': 'TK202-Barber-Gallery'
            };
            
            const response = await fetch(`${this.apiBase}/${folderPath}`, {
                method: 'GET',
                headers: headers
            });
            
            if (!response.ok) {
                return [];
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            return [];
        }
    }

    // Medya dosyalarını filtrele (resim + video)
    filterImages(files) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const videoExtensions = ['.mp4', '.webm', '.mov'];
        const allExtensions = [...imageExtensions, ...videoExtensions];
        
        return files.filter(file =>
            file.type === 'file' &&
            allExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
        );
    }

    // Galeri öğesi HTML'i oluştur (resim + video desteği)
    createGalleryItem(image, category) {
        const categoryName = this.categories[category] || category;
        const imageName = image.name.replace(/\.[^/.]+$/, ""); // Uzantıyı kaldır
        const formattedName = imageName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        // Video mu resim mi kontrol et
        const videoExtensions = ['.mp4', '.webm', '.mov'];
        const isVideo = videoExtensions.some(ext => image.name.toLowerCase().endsWith(ext));
        
        const mediaElement = isVideo ?
            `<video src="${image.download_url}" controls muted preload="auto" crossorigin="anonymous">
                <source src="${image.download_url}" type="video/${image.name.split('.').pop()}">
                Video desteklenmiyor.
            </video>` :
            `<img src="${image.download_url}" alt="${formattedName}" loading="lazy">`;
        
        return `
            <div class="gallery-item ${isVideo ? 'video-item' : 'image-item'}" data-category="${category}">
                ${mediaElement}
                <div class="overlay">
                    <h3>${formattedName}</h3>
                    <p>${categoryName}</p>
                </div>
            </div>
        `;
    }

    // Belirli kategoriden fotoğrafları çek
    async fetchPhotosFromCategory(category) {
        try {
            const folderPath = `${this.galleryPath}/${category}`;
            const files = await this.fetchFolderContents(folderPath);
            const images = this.filterImages(files);
            
            return images.map(image => ({
                ...image,
                category: category
            }));
        } catch (error) {
            return [];
        }
    }

    // Tüm kategorileri yükle
    async loadAllCategories() {
        this.showLoading();
        this.container = document.getElementById(this.containerId) || document.querySelector('.gallery-container');
        
        if (!this.container) {
            this.hideLoading();
            return;
        }

        // Mevcut static içeriği temizle
        this.container.innerHTML = '';

        let totalImages = 0;

        for (const [categoryKey, categoryName] of Object.entries(this.categories)) {
            try {
                const folderPath = `${this.galleryPath}/${categoryKey}`;
                const files = await this.fetchFolderContents(folderPath);
                const images = this.filterImages(files);
                
                if (images.length > 0) {
                    // Her resim için HTML oluştur
                    images.forEach(image => {
                        const galleryItemHTML = this.createGalleryItem(image, categoryKey);
                        this.container.insertAdjacentHTML('beforeend', galleryItemHTML);
                        totalImages++;
                    });
                }
            } catch (error) {
                // Sessizce devam et
            }
        }

        this.hideLoading();

        // Galeri header'ını güncelle
        this.updateGalleryHeader(totalImages);

        if (totalImages === 0) {
            this.showEmptyMessage();
        } else {
            this.initializeFilters();
        }
    }

    // Hata durumunu göster
    showError() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="gallery-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Yükleme Hatası</h3>
                    <p>Galeri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
                </div>
            `;
        }
    }

    // Boş durum göster
    showEmptyState() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="gallery-empty">
                    <i class="fas fa-images"></i>
                    <h3>Henüz Fotoğraf Yok</h3>
                    <p>Bu kategoride henüz fotoğraf bulunmuyor.</p>
                </div>
            `;
        }
    }

    // Boş galeri mesajı göster
    showEmptyMessage() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="empty-gallery">
                    <i class="fas fa-images"></i>
                    <h3>Galeri Boş</h3>
                    <p>Henüz fotoğraf yüklenmemiş. GitHub repository'ye fotoğraf ekleyin.</p>
                    <div class="github-guide">
                        <h4>Fotoğraf Ekleme Adımları:</h4>
                        <ol>
                            <li>GitHub repository'nize gidin</li>
                            <li>assets/gallery/ klasörünü açın</li>
                            <li>Uygun kategori klasörünü seçin</li>
                            <li>Fotoğrafları sürükle-bırak ile yükleyin</li>
                        </ol>
                    </div>
                </div>
            `;
        }
    }

    // Galeri header'ını güncelle
    updateGalleryHeader(totalImages) {
        const galleryInfo = document.querySelector('.gallery-info p');
        if (galleryInfo) {
            if (totalImages > 0) {
                galleryInfo.innerHTML = `Yüklendi`;
            } else {
                galleryInfo.innerHTML = `Yükleniyor...`;
            }
        }
    }

    // Galeriyi başlat
    init() {
        this.container = document.getElementById(this.containerId) || document.querySelector('.gallery-container');
        this.loadAllCategories();
    }

    // Galeriyi yenile (alias)
    refreshGallery() {
        this.loadAllCategories();
    }

    // Filtre sistemini başlat
    initializeFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Aktif filtre butonunu güncelle
                filterBtns.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Seçilen kategoriyi al
                const filterValue = this.getAttribute('data-filter');
                
                // Galeri öğelerini filtrele
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.3s ease-in-out';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Galeriyi yenile
    async refresh() {
        await this.loadAllCategories();
    }

}

// Sayfa yüklendiğinde galeriyi başlat (sadece galeri sayfasında)
document.addEventListener('DOMContentLoaded', function() {
    // Ana sayfa kontrolü - ana sayfada kendi sistemi çalışıyor
    const isHomepage = document.querySelector('#homepage-gallery-container');
    if (isHomepage) {
        return; // Ana sayfada çalıştırma
    }

    // Normal galeri sayfası için
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        const gallery = new GithubGallery();
        gallery.init();

        // Manuel yenileme butonu varsa
        const refreshBtn = document.getElementById('refresh-gallery');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                gallery.refreshGallery();
            });
        }
    }
});

// Global export (başka dosyalardan kullanmak için)
window.GithubGallery = GithubGallery;

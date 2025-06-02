// Site İçerik Yönetimi - Admin Panel Eklentisi
document.addEventListener('DOMContentLoaded', function() {
    
    // Site İçerik Yönetimi Fonksiyonları
    window.SiteContentManager = {
        
        // Ana sayfa içeriğini güncelle
        updateHomeContent() {
            Swal.fire({
                title: 'Ana Sayfa İçeriği',
                html: `
                    <div style="text-align: left;">
                        <label>Başlık</label>
                        <input type="text" id="homeTitle" class="swal2-input" placeholder="TK202 Barber'a Hoş Geldiniz">
                        
                        <label>Alt Başlık</label>
                        <input type="text" id="homeSubtitle" class="swal2-input" placeholder="Profesyonel berber hizmetleri">
                        
                        <label>Açıklama</label>
                        <textarea id="homeDescription" class="swal2-textarea" placeholder="Ana sayfa açıklama metni"></textarea>
                        
                        <label>Çalışma Saatleri</label>
                        <input type="text" id="workingHours" class="swal2-input" placeholder="Pazartesi - Cumartesi: 09:00 - 20:00">
                        
                        <label>Telefon</label>
                        <input type="tel" id="phone" class="swal2-input" placeholder="0212 123 45 67">
                        
                        <label>Adres</label>
                        <input type="text" id="address" class="swal2-input" placeholder="Kadıköy, İstanbul">
                    </div>
                `,
                confirmButtonText: 'Güncelle',
                confirmButtonColor: '#f3b431',
                showCancelButton: true,
                cancelButtonText: 'İptal',
                width: '600px',
                preConfirm: () => {
                    return {
                        title: document.getElementById('homeTitle').value,
                        subtitle: document.getElementById('homeSubtitle').value,
                        description: document.getElementById('homeDescription').value,
                        workingHours: document.getElementById('workingHours').value,
                        phone: document.getElementById('phone').value,
                        address: document.getElementById('address').value
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    SiteContent.updateHomePage(result.value);
                    showNotification('Ana sayfa içeriği güncellendi!', 'success');
                }
            });
        },

        // Hizmet fiyatlarını güncelle
        updateServicePrices() {
            // Mevcut hizmetleri al
            const services = dataStore.services;
            
            let html = '<div style="text-align: left; max-height: 400px; overflow-y: auto;">';
            services.forEach(service => {
                html += `
                    <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                        <h4>${service.name}</h4>
                        <input type="number" 
                               id="price_${service.id}" 
                               class="swal2-input" 
                               value="${service.price}" 
                               placeholder="Fiyat (₺)"
                               style="width: 150px; display: inline-block;">
                        <span style="margin-left: 10px;">₺</span>
                    </div>
                `;
            });
            html += '</div>';

            Swal.fire({
                title: 'Hizmet Fiyatlarını Güncelle',
                html: html,
                confirmButtonText: 'Tüm Fiyatları Güncelle',
                confirmButtonColor: '#f3b431',
                showCancelButton: true,
                cancelButtonText: 'İptal',
                width: '500px',
                preConfirm: () => {
                    const updatedPrices = {};
                    services.forEach(service => {
                        const newPrice = document.getElementById(`price_${service.id}`).value;
                        if (newPrice) {
                            updatedPrices[service.id] = parseInt(newPrice);
                        }
                    });
                    return updatedPrices;
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // Fiyatları güncelle
                    Object.entries(result.value).forEach(([serviceId, newPrice]) => {
                        dataStore.updateItem('services', parseInt(serviceId), { price: newPrice });
                    });
                    
                    // Site içeriğini güncelle
                    SiteContent.updatePrices(result.value);
                    
                    // Hizmetler listesini yenile
                    renderServicesList();
                    
                    showNotification('Fiyatlar güncellendi!', 'success');
                }
            });
        },

        // Galeri yönetimi
        manageGallery() {
            const gallery = dataStore.gallery;
            
            let html = `
                <div style="text-align: left;">
                    <button class="btn-primary" onclick="SiteContentManager.addGalleryImage()" style="margin-bottom: 20px;">
                        <i class="fas fa-plus"></i> Yeni Görsel Ekle
                    </button>
                    <div style="max-height: 400px; overflow-y: auto;">
            `;
            
            gallery.forEach(item => {
                html += `
                    <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; display: flex; align-items: center;">
                        <img src="${item.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px; margin-right: 15px;">
                        <div style="flex: 1;">
                            <h4>${item.title}</h4>
                            <p style="margin: 0; color: #666;">${getCategoryName(item.category)}</p>
                        </div>
                        <div>
                            <button class="btn-icon" onclick="SiteContentManager.editGalleryImage(${item.id})" title="Düzenle">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon danger" onclick="SiteContentManager.deleteGalleryImage(${item.id})" title="Sil">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            html += '</div></div>';

            Swal.fire({
                title: 'Galeri Yönetimi',
                html: html,
                showConfirmButton: false,
                showCancelButton: true,
                cancelButtonText: 'Kapat',
                width: '600px'
            });
        },

        // Galeri görseli ekle
        addGalleryImage() {
            Swal.fire({
                title: 'Yeni Görsel Ekle',
                html: `
                    <input type="text" id="imageUrl" class="swal2-input" placeholder="Görsel URL'si">
                    <input type="text" id="imageTitle" class="swal2-input" placeholder="Başlık">
                    <select id="imageCategory" class="swal2-input">
                        <option value="">Kategori Seçin</option>
                        <option value="hair">Saç Modelleri</option>
                        <option value="beard">Sakal Modelleri</option>
                        <option value="shop">Dükkan</option>
                        <option value="team">Ekip</option>
                    </select>
                `,
                confirmButtonText: 'Ekle',
                confirmButtonColor: '#f3b431',
                showCancelButton: true,
                cancelButtonText: 'İptal',
                preConfirm: () => {
                    const url = document.getElementById('imageUrl').value;
                    const title = document.getElementById('imageTitle').value;
                    const category = document.getElementById('imageCategory').value;
                    
                    if (!url || !title || !category) {
                        Swal.showValidationMessage('Tüm alanları doldurun');
                        return false;
                    }
                    
                    return { image: url, title, category };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    dataStore.addItem('gallery', result.value);
                    
                    // Site galerisi güncelle
                    const allGallery = dataStore.gallery;
                    SiteContent.updateGallery(allGallery);
                    
                    showNotification('Görsel eklendi!', 'success');
                    
                    // Galeri yönetimini yeniden aç
                    setTimeout(() => this.manageGallery(), 500);
                }
            });
        },

        // İletişim bilgilerini güncelle
        updateContactInfo() {
            const currentContact = SiteContent.getContent('contact') || {};
            
            Swal.fire({
                title: 'İletişim Bilgileri',
                html: `
                    <div style="text-align: left;">
                        <label>Telefon</label>
                        <input type="tel" id="contactPhone" class="swal2-input" value="${currentContact.phone || ''}" placeholder="0212 123 45 67">
                        
                        <label>WhatsApp</label>
                        <input type="tel" id="contactWhatsapp" class="swal2-input" value="${currentContact.whatsapp || ''}" placeholder="0532 123 45 67">
                        
                        <label>E-posta</label>
                        <input type="email" id="contactEmail" class="swal2-input" value="${currentContact.email || ''}" placeholder="info@tk202barber.com">
                        
                        <label>Adres</label>
                        <textarea id="contactAddress" class="swal2-textarea" placeholder="Tam adres">${currentContact.address || ''}</textarea>
                        
                        <label>Google Maps Embed Kodu</label>
                        <textarea id="contactMap" class="swal2-textarea" placeholder="<iframe...></iframe>">${currentContact.mapEmbed || ''}</textarea>
                        
                        <label>Instagram</label>
                        <input type="text" id="contactInstagram" class="swal2-input" value="${currentContact.instagram || ''}" placeholder="@tk202barber">
                        
                        <label>Facebook</label>
                        <input type="text" id="contactFacebook" class="swal2-input" value="${currentContact.facebook || ''}" placeholder="facebook.com/tk202barber">
                    </div>
                `,
                confirmButtonText: 'Güncelle',
                confirmButtonColor: '#f3b431',
                showCancelButton: true,
                cancelButtonText: 'İptal',
                width: '600px',
                preConfirm: () => {
                    return {
                        phone: document.getElementById('contactPhone').value,
                        whatsapp: document.getElementById('contactWhatsapp').value,
                        email: document.getElementById('contactEmail').value,
                        address: document.getElementById('contactAddress').value,
                        mapEmbed: document.getElementById('contactMap').value,
                        instagram: document.getElementById('contactInstagram').value,
                        facebook: document.getElementById('contactFacebook').value
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    SiteContent.updateContact(result.value);
                    showNotification('İletişim bilgileri güncellendi!', 'success');
                }
            });
        },

        // API ayarlarını güncelle
        updateAPISettings() {
            const currentConfig = APIConfig.getConfig();
            
            Swal.fire({
                title: 'API Ayarları',
                html: `
                    <div style="text-align: left;">
                        <h4>Ana API</h4>
                        <label>API URL</label>
                        <input type="url" id="apiUrl" class="swal2-input" value="${currentConfig.apiUrl}" placeholder="https://api.example.com">
                        
                        <label>API Anahtarı</label>
                        <input type="text" id="apiKey" class="swal2-input" value="${currentConfig.apiKey}" placeholder="API anahtarınız">
                        
                        <h4 style="margin-top: 20px;">SMS API</h4>
                        <label>SMS API URL</label>
                        <input type="url" id="smsApiUrl" class="swal2-input" value="${currentConfig.smsApiUrl}" placeholder="https://sms.provider.com/api">
                        
                        <label>SMS API Anahtarı</label>
                        <input type="text" id="smsApiKey" class="swal2-input" value="${currentConfig.smsApiKey}" placeholder="SMS API anahtarınız">
                        
                        <h4 style="margin-top: 20px;">Webhook</h4>
                        <label>Webhook URL</label>
                        <input type="url" id="webhookUrl" class="swal2-input" value="${currentConfig.webhookUrl}" placeholder="https://yoursite.com/webhook">
                        
                        <div style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                            <p style="margin: 0; font-size: 14px; color: #666;">
                                <i class="fas fa-info-circle"></i> API bağlantısı kurulduktan sonra tüm veriler otomatik senkronize edilecektir.
                            </p>
                        </div>
                    </div>
                `,
                confirmButtonText: 'Kaydet ve Test Et',
                confirmButtonColor: '#f3b431',
                showCancelButton: true,
                cancelButtonText: 'İptal',
                width: '600px',
                preConfirm: () => {
                    return {
                        apiUrl: document.getElementById('apiUrl').value,
                        apiKey: document.getElementById('apiKey').value,
                        smsApiUrl: document.getElementById('smsApiUrl').value,
                        smsApiKey: document.getElementById('smsApiKey').value,
                        webhookUrl: document.getElementById('webhookUrl').value
                    };
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // Ayarları kaydet
                    APIConfig.saveConfig(result.value);
                    
                    // API'yi test et
                    if (result.value.apiUrl) {
                        try {
                            Swal.fire({
                                title: 'API Test Ediliyor...',
                                text: 'Lütfen bekleyin...',
                                allowOutsideClick: false,
                                didOpen: () => {
                                    Swal.showLoading();
                                }
                            });
                            
                            // Test isteği gönder
                            const testResult = await DynamicAPI.request('/test');
                            
                            Swal.fire({
                                icon: 'success',
                                title: 'Bağlantı Başarılı!',
                                text: 'API bağlantısı kuruldu.',
                                confirmButtonColor: '#f3b431'
                            });
                        } catch (error) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Bağlantı Hatası',
                                text: 'API bağlantısı kurulamadı. Lütfen bilgileri kontrol edin.',
                                confirmButtonColor: '#e74c3c'
                            });
                        }
                    } else {
                        showNotification('API ayarları kaydedildi', 'success');
                    }
                }
            });
        }
    };

    // Admin panele yeni butonlar ekle
    function addContentManagementButtons() {
        // Settings bölümüne site yönetimi sekmesi ekle
        const settingsTabs = document.querySelector('.settings-tabs');
        if (settingsTabs && !document.querySelector('[data-tab="site-content"]')) {
            const newTab = document.createElement('button');
            newTab.className = 'tab-btn';
            newTab.setAttribute('data-tab', 'site-content');
            newTab.textContent = 'Site İçeriği';
            settingsTabs.appendChild(newTab);
            
            // Tab içeriği ekle
            const settingsContent = document.querySelector('.settings-content');
            const tabContent = document.createElement('div');
            tabContent.className = 'tab-content';
            tabContent.id = 'site-content-tab';
            tabContent.innerHTML = `
                <h3>Site İçerik Yönetimi</h3>
                <div class="content-management-grid">
                    <div class="content-card">
                        <h4><i class="fas fa-home"></i> Ana Sayfa</h4>
                        <p>Ana sayfa başlık, açıklama ve içeriklerini düzenleyin.</p>
                        <button class="btn-primary" onclick="SiteContentManager.updateHomeContent()">
                            <i class="fas fa-edit"></i> Düzenle
                        </button>
                    </div>
                    
                    <div class="content-card">
                        <h4><i class="fas fa-tag"></i> Fiyatlar</h4>
                        <p>Hizmet fiyatlarını güncelleyin.</p>
                        <button class="btn-primary" onclick="SiteContentManager.updateServicePrices()">
                            <i class="fas fa-edit"></i> Fiyatları Güncelle
                        </button>
                    </div>
                    
                    <div class="content-card">
                        <h4><i class="fas fa-images"></i> Galeri</h4>
                        <p>Site galerisindeki görselleri yönetin.</p>
                        <button class="btn-primary" onclick="SiteContentManager.manageGallery()">
                            <i class="fas fa-edit"></i> Galeriyi Yönet
                        </button>
                    </div>
                    
                    <div class="content-card">
                        <h4><i class="fas fa-phone"></i> İletişim</h4>
                        <p>İletişim bilgilerini ve sosyal medya hesaplarını güncelleyin.</p>
                        <button class="btn-primary" onclick="SiteContentManager.updateContactInfo()">
                            <i class="fas fa-edit"></i> Bilgileri Güncelle
                        </button>
                    </div>
                    
                    <div class="content-card">
                        <h4><i class="fas fa-plug"></i> API Ayarları</h4>
                        <p>API bağlantı ayarlarını yapılandırın.</p>
                        <button class="btn-primary" onclick="SiteContentManager.updateAPISettings()">
                            <i class="fas fa-cog"></i> API Ayarları
                        </button>
                    </div>
                    
                    <div class="content-card">
                        <h4><i class="fas fa-sync"></i> Senkronizasyon</h4>
                        <p>Tüm verileri API ile senkronize edin.</p>
                        <button class="btn-secondary" onclick="SiteContentManager.syncAllData()">
                            <i class="fas fa-sync"></i> Şimdi Senkronize Et
                        </button>
                    </div>
                </div>
                
                <style>
                    .content-management-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                        gap: 20px;
                        margin-top: 20px;
                    }
                    
                    .content-card {
                        background: var(--dark-bg);
                        border: 1px solid var(--dark-border);
                        border-radius: 10px;
                        padding: 20px;
                        text-align: center;
                    }
                    
                    .content-card h4 {
                        margin-bottom: 10px;
                        color: var(--primary-color);
                    }
                    
                    .content-card p {
                        color: var(--dark-text-secondary);
                        margin-bottom: 15px;
                        font-size: 0.9rem;
                    }
                    
                    .content-card button {
                        width: 100%;
                    }
                </style>
            `;
            settingsContent.appendChild(tabContent);
            
            // Tab event listener ekle
            newTab.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                
                // Tab butonlarını güncelle
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Tab içeriklerini güncelle
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                const targetTab = document.getElementById(tabName + '-tab');
                if (targetTab) {
                    targetTab.classList.add('active');
                }
            });
        }
    }

    // Sayfa yüklendiğinde butonları ekle
    setTimeout(addContentManagementButtons, 1000);
});

// Helper fonksiyonlar
function getCategoryName(category) {
    const categories = {
        'hair': 'Saç Modelleri',
        'beard': 'Sakal Modelleri',
        'shop': 'Dükkan',
        'team': 'Ekip'
    };
    return categories[category] || category;
}

function showNotification(message, type) {
    if (typeof notificationManager !== 'undefined') {
        notificationManager.show(message, type);
    } else {
        // Fallback
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        
        Toast.fire({
            icon: type,
            title: message
        });
    }
}

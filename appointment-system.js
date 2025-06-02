// LocalStorage ile randevu kaydetme
function saveAppointment(appointmentData) {
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointmentData.id = 'TK' + Date.now().toString().slice(-4);
    appointmentData.createdAt = new Date().toISOString();
    appointmentData.status = 'Bekliyor';
    appointments.push(appointmentData);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    return appointmentData.id;
}

// LocalStorage'dan randevuları alma
function getAppointments() {
    return JSON.parse(localStorage.getItem('appointments')) || [];
}

// Randevu durumunu güncelleme
function updateAppointmentStatus(appointmentId, status) {
    let appointments = getAppointments();
    const appointmentIndex = appointments.findIndex(app => app.id === appointmentId);
    
    if (appointmentIndex !== -1) {
        appointments[appointmentIndex].status = status;
        localStorage.setItem('appointments', JSON.stringify(appointments));
        return true;
    }
    return false;
}

// Randevu silme
function deleteAppointment(appointmentId) {
    let appointments = getAppointments();
    appointments = appointments.filter(app => app.id !== appointmentId);
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

// LocalStorage ile yorum kaydetme
function saveReview(reviewData) {
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviewData.id = 'REV' + Date.now();
    reviewData.createdAt = new Date().toISOString();
    reviewData.status = 'Bekliyor';
    reviews.push(reviewData);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    return reviewData.id;
}

// LocalStorage'dan yorumları alma
function getReviews() {
    return JSON.parse(localStorage.getItem('reviews')) || [];
}

// Yorum durumunu güncelleme
function updateReviewStatus(reviewId, status) {
    let reviews = getReviews();
    const reviewIndex = reviews.findIndex(rev => rev.id === reviewId);
    
    if (reviewIndex !== -1) {
        reviews[reviewIndex].status = status;
        localStorage.setItem('reviews', JSON.stringify(reviews));
        return true;
    }
    return false;
}

// Yorum silme
function deleteReview(reviewId) {
    let reviews = getReviews();
    reviews = reviews.filter(rev => rev.id !== reviewId);
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

// Hizmet bilgilerini alma
function getServiceInfo(serviceKey) {
    const services = {
        'sac-kesimi': { name: 'Saç Kesimi', duration: '30 dakika', price: '₺100' },
        'sakal-trasi': { name: 'Sakal Tıraşı', duration: '20 dakika', price: '₺80' },
        'sac-boyama': { name: 'Saç Boyama', duration: '90 dakika', price: '₺250' },
        'sac-bakimi': { name: 'Saç Bakımı', duration: '45 dakika', price: '₺150' },
        'cocuk-kesimi': { name: 'Çocuk Kesimi', duration: '20 dakika', price: '₺70' },
        'ozel-paket': { name: 'Özel Paket', duration: '60 dakika', price: '₺200' }
    };
    return services[serviceKey] || { name: 'Bilinmeyen', duration: '-', price: '-' };
}

// Berber bilgilerini alma
function getBarberInfo(barberKey) {
    const barbers = {
        'kazim': { name: 'Kazım Erol', title: 'Dükkan Sahibi' },
        'samet': { name: 'Samet', title: 'Kıdemli Berber' },
        'burak': { name: 'Burak', title: 'Stilist' }
    };
    return barbers[barberKey] || { name: 'Bilinmeyen', title: '-' };
}

// Tarih formatını düzenleme
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
}

// Saat formatını düzenleme
function formatTime(timeString) {
    return timeString || '-';
}

// Admin paneli için randevuları yükleme
function loadAppointmentsForAdmin() {
    const appointments = getAppointments();
    const appointmentsContainer = document.getElementById('appointments-list');
    
    if (!appointmentsContainer) return;
    
    if (appointments.length === 0) {
        appointmentsContainer.innerHTML = '<p>Henüz randevu bulunmuyor.</p>';
        return;
    }
    
    let html = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Tarih</th>
                    <th>Saat</th>
                    <th>Müşteri</th>
                    <th>Telefon</th>
                    <th>Hizmet</th>
                    <th>Berber</th>
                    <th>Durum</th>
                    <th>İşlemler</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    appointments.forEach(appointment => {
        const serviceInfo = getServiceInfo(appointment.service);
        const barberInfo = getBarberInfo(appointment.barber);
        
        html += `
            <tr data-appointment-id="${appointment.id}">
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>${appointment.name}</td>
                <td>${appointment.phone}</td>
                <td>${serviceInfo.name}</td>
                <td>${barberInfo.name}</td>
                <td><span class="status ${appointment.status.toLowerCase()}">${appointment.status}</span></td>
                <td>
                    <button class="btn-approve" onclick="approveAppointment('${appointment.id}')">Onayla</button>
                    <button class="btn-cancel" onclick="cancelAppointment('${appointment.id}')">İptal</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    appointmentsContainer.innerHTML = html;
}

// Admin paneli için yorumları yükleme
function loadReviewsForAdmin() {
    const reviews = getReviews();
    const reviewsContainer = document.getElementById('reviews-list');
    
    if (!reviewsContainer) return;
    
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p>Henüz yorum bulunmuyor.</p>';
        return;
    }
    
    let html = '';
    
    reviews.forEach(review => {
        const serviceInfo = getServiceInfo(review.service);
        const barberInfo = getBarberInfo(review.barber);
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        html += `
            <div class="review-item ${review.status.toLowerCase()}" data-review-id="${review.id}">
                <div class="review-header">
                    <div class="review-rating">${stars}</div>
                    <div class="review-date">${formatDate(review.createdAt)}</div>
                </div>
                <div class="review-content">
                    <p><strong>Hizmet:</strong> ${serviceInfo.name}</p>
                    <p><strong>Berber:</strong> ${barberInfo.name}</p>
                    <p><strong>Yorum:</strong> ${review.comment}</p>
                </div>
                <div class="review-actions">
                    <span class="status">${review.status}</span>
                    <button class="btn-approve" onclick="approveReview('${review.id}')">Onayla</button>
                    <button class="btn-delete" onclick="deleteReviewAdmin('${review.id}')">Sil</button>
                </div>
            </div>
        `;
    });
    
    reviewsContainer.innerHTML = html;
}

// Randevu onaylama
function approveAppointment(appointmentId) {
    if (updateAppointmentStatus(appointmentId, 'Onaylandı')) {
        loadAppointmentsForAdmin();
        showNotification('Randevu onaylandı!', 'success');
    }
}

// Randevu iptal etme
function cancelAppointment(appointmentId) {
    if (updateAppointmentStatus(appointmentId, 'İptal Edildi')) {
        loadAppointmentsForAdmin();
        showNotification('Randevu iptal edildi!', 'info');
    }
}

// Yorum onaylama
function approveReview(reviewId) {
    if (updateReviewStatus(reviewId, 'Onaylandı')) {
        loadReviewsForAdmin();
        showNotification('Yorum onaylandı!', 'success');
    }
}

// Yorum silme (admin)
function deleteReviewAdmin(reviewId) {
    if (confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
        deleteReview(reviewId);
        loadReviewsForAdmin();
        showNotification('Yorum silindi!', 'info');
    }
}

// Bildirim gösterme
function showNotification(message, type = 'info') {
    // Mevcut bildirimi kaldır
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Yeni bildirim oluştur
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Sayfaya ekle
    document.body.appendChild(notification);
    
    // 3 saniye sonra kaldır
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    // Admin paneli sayfasındaysak
    if (window.location.pathname.includes('admin.html')) {
        loadAppointmentsForAdmin();
        loadReviewsForAdmin();
        
        // Sekme değiştirme
        const tabs = document.querySelectorAll('.admin-tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Aktif sekmeyi güncelle
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // İçeriği göster/gizle
                tabContents.forEach(content => {
                    if (content.id === targetTab) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });
    }
    
    // Yorum formu varsa
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const reviewData = {};
            
            for (const [key, value] of formData.entries()) {
                reviewData[key] = value;
            }
            
            // Yıldız derecelendirmesini al
            const selectedStars = document.querySelectorAll('.star-rating .star.active');
            reviewData.rating = selectedStars.length;
            
            if (reviewData.rating === 0) {
                showNotification('Lütfen bir yıldız derecelendirmesi seçin!', 'error');
                return;
            }
            
            // Yorumu kaydet
            const reviewId = saveReview(reviewData);
            
            showNotification('Yorumunuz başarıyla gönderildi! İncelendikten sonra yayınlanacaktır.', 'success');
            
            // Formu sıfırla
            this.reset();
            document.querySelectorAll('.star-rating .star').forEach(star => {
                star.classList.remove('active');
            });
        });
        
        // Yıldız derecelendirme sistemi
        const stars = document.querySelectorAll('.star-rating .star');
        stars.forEach((star, index) => {
            star.addEventListener('click', function() {
                // Tüm yıldızları temizle
                stars.forEach(s => s.classList.remove('active'));
                
                // Seçilen yıldıza kadar olan tüm yıldızları aktif et
                for (let i = 0; i <= index; i++) {
                    stars[i].classList.add('active');
                }
            });
        });
    }
});

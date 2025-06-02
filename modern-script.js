// Modern TK202 Barber JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM elementlerini seçme
    const menuBtn = document.querySelector('.menu-btn');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');
    const modeToggle = document.querySelector('.mode-toggle');
    const header = document.querySelector('header');

    // Sayfa yüklendiğinde tema kontrolü - VARSAYILAN KARANLIK MOD
    // Eğer kullanıcı daha önce light mode seçmişse, onu uygula
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        if (modeToggle) {
            const icon = modeToggle.querySelector('i');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    // İlk ziyarette veya dark mode seçiliyse, karanlık modda başla
    else {
        document.body.classList.remove('light-mode');
        if (modeToggle) {
            const icon = modeToggle.querySelector('i');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
        // İlk ziyarette tema tercihini kaydet
        if (!localStorage.getItem('theme')) {
            localStorage.setItem('theme', 'dark');
        }
    }
    
    // Light/Dark mode toggle
    if (modeToggle) {
        modeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            
            // İkonu güncelle
            const icon = modeToggle.querySelector('i');
            if (document.body.classList.contains('light-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    
   // Mobil menü toggle
if (menuBtn) {
    menuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        menuBtn.classList.toggle('fa-times');
        document.body.classList.toggle('menu-open'); // Bu satırı ekleyin
    });
}


   // Menü linklerine tıklandığında mobil menüyü kapat
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        if (nav) {
            nav.classList.remove('active');
        }
        if (menuBtn) {
            menuBtn.classList.remove('fa-times');
        }
        document.body.classList.remove('menu-open'); // Bu satırı ekleyin
            
            // Aktif link sınıfını güncelle
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            
            // Sayfa içi linkler için kaydırma animasyonu
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Sayfa içi kaydırma animasyonu
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sayfa kaydırıldığında header'ı güncelle
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll animasyonları
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Animasyon için elementleri gözlemle
    document.querySelectorAll('.service-box, .gallery-item, .team-member, .testimonial, .info-item').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Service card hover efektleri
    document.querySelectorAll('.service-box').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Gallery item hover efektleri
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            const img = this.querySelector('img');
            const overlay = this.querySelector('.overlay');
            if (img) img.style.transform = 'scale(1.1)';
            if (overlay) overlay.style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            const overlay = this.querySelector('.overlay');
            if (img) img.style.transform = 'scale(1)';
            if (overlay) overlay.style.opacity = '0';
        });
    });

    // Aktif menü öğesini güncelle
    function updateActiveMenuOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', function() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    updateActiveMenuOnScroll();

    // Smooth reveal animasyonu
    const revealElements = document.querySelectorAll('.section-title h2, .section-title p');
    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        el.style.transitionDelay = `${index * 0.2}s`;
        
        observer.observe(el);
    });

    // Parallax efekti
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Button hover efektleri
    document.querySelectorAll('.btn, .btn-randevu').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Loading animasyonu (sayfa yüklendiğinde)
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // Typing animasyonu (hero başlık için)
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid rgba(255,255,255,0.7)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }

    // Sayfa performansı için lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Konsola modern mesaj
    console.log('%c🔥 TK202 Barber - Modern Web Sitesi', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%c✨ Glassmorphism & Modern Design', 'color: #f093fb; font-size: 14px;');
    console.log('%c🌙 Varsayılan: Karanlık Mod', 'color: #ffd700; font-size: 14px;');
});

// CSS animasyonları için yardımcı fonksiyonlar
function addGlowEffect(element) {
    element.style.filter = 'drop-shadow(0 0 20px rgba(102, 126, 234, 0.5))';
}

function removeGlowEffect(element) {
    element.style.filter = 'none';
}

// Modern notification sistemi
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 15px;
        padding: 15px 20px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animasyon
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Otomatik kaldırma
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 400);
    }, 3000);
}

// Sayfa değişikliklerini dinle
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        // Sayfa değiştiğinde animasyonları yeniden başlat
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.remove('animated');
        });
    }
}).observe(document, {subtree: true, childList: true});

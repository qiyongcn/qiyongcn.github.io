// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// File Upload Functionality
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const filesList = document.getElementById('filesList');

let uploadedFiles = [];

// Drag and drop events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    uploadArea.classList.add('dragover');
}

function unhighlight() {
    uploadArea.classList.remove('dragover');
}

// Handle dropped files
uploadArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// Handle file input change
fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    const fileArray = Array.from(files);
    fileArray.forEach(uploadFile);
}

function uploadFile(file) {
    // Simulate upload progress
    uploadProgress.style.display = 'block';
    
    const reader = new FileReader();
    let progress = 0;
    
    reader.onloadstart = () => {
        progress = 0;
        updateProgress(progress);
    };
    
    reader.onprogress = (e) => {
        if (e.lengthComputable) {
            progress = (e.loaded / e.total) * 100;
            updateProgress(progress);
        }
    };
    
    reader.onload = (e) => {
        progress = 100;
        updateProgress(progress);
        
        // Add file to the list
        const fileData = {
            id: Date.now(),
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type,
            data: e.target.result,
            timestamp: new Date().toLocaleString()
        };
        
        uploadedFiles.push(fileData);
        displayFiles();
        
        // Hide progress after a short delay
        setTimeout(() => {
            uploadProgress.style.display = 'none';
            progressFill.style.width = '0%';
            progressText.textContent = '0%';
        }, 1000);
    };
    
    reader.readAsDataURL(file);
}

function updateProgress(progress) {
    progressFill.style.width = progress + '%';
    progressText.textContent = Math.round(progress) + '%';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function displayFiles() {
    filesList.innerHTML = '';
    
    uploadedFiles.forEach(file => {
        const fileElement = createFileElement(file);
        filesList.appendChild(fileElement);
    });
    
    // Save to localStorage
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
}

function createFileElement(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const iconClass = getFileIcon(file.type);
    
    fileItem.innerHTML = `
        <i class="fas ${iconClass} file-icon"></i>
        <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${file.size} • ${file.timestamp}</div>
        </div>
        <button class="file-remove" onclick="removeFile(${file.id})">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add click handler for images
    if (file.type.startsWith('image/')) {
        fileItem.style.cursor = 'pointer';
        fileItem.addEventListener('click', () => openLightbox(file.data, file.name));
    }
    
    return fileItem;
}

function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'fa-image';
    if (fileType === 'application/pdf') return 'fa-file-pdf';
    if (fileType.includes('word')) return 'fa-file-word';
    if (fileType.includes('text')) return 'fa-file-text';
    return 'fa-file';
}

function removeFile(fileId) {
    uploadedFiles = uploadedFiles.filter(file => file.id !== fileId);
    displayFiles();
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
}

// Load saved files on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
        uploadedFiles = JSON.parse(savedFiles);
        displayFiles();
    }
});

// Gallery Functionality
const galleryGrid = document.getElementById('galleryGrid');
const galleryButtons = document.querySelectorAll('.gallery-btn');

// Sample gallery images (in a real app, these would come from uploaded files)
const galleryImages = [
    { src: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Research+1', category: 'research', title: 'Research Activity 1' },
    { src: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=Conference+1', category: 'conference', title: 'Conference 2023' },
    { src: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Lab+1', category: 'lab', title: 'Laboratory View' },
    { src: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=Research+2', category: 'research', title: 'Research Activity 2' },
    { src: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Conference+2', category: 'conference', title: 'Conference 2022' },
    { src: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=Lab+2', category: 'lab', title: 'Lab Equipment' }
];

function populateGallery(filter = 'all') {
    galleryGrid.innerHTML = '';
    
    const filteredImages = filter === 'all' 
        ? galleryImages 
        : galleryImages.filter(img => img.category === filter);
    
    filteredImages.forEach(img => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${img.src}" alt="${img.title}">
            <div class="gallery-item-overlay">
                <h4>${img.title}</h4>
            </div>
        `;
        
        galleryItem.addEventListener('click', () => openLightbox(img.src, img.title));
        galleryGrid.appendChild(galleryItem);
    });
    
    // Add uploaded images to gallery
    const imageFiles = uploadedFiles.filter(file => file.type.startsWith('image/'));
    imageFiles.forEach(file => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${file.data}" alt="${file.name}">
            <div class="gallery-item-overlay">
                <h4>${file.name}</h4>
            </div>
        `;
        
        galleryItem.addEventListener('click', () => openLightbox(file.data, file.name));
        galleryGrid.appendChild(galleryItem);
    });
}

// Gallery filtering
galleryButtons.forEach(button => {
    button.addEventListener('click', () => {
        galleryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        populateGallery(button.dataset.filter);
    });
});

// Lightbox functionality
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightbox = document.querySelector('.close-lightbox');

function openLightbox(src, caption) {
    lightboxModal.style.display = 'block';
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    document.body.style.overflow = 'hidden';
}

function closeLightboxHandler() {
    lightboxModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

closeLightbox.addEventListener('click', closeLightboxHandler);

lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
        closeLightboxHandler();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.style.display === 'block') {
        closeLightboxHandler();
    }
});

// Initialize gallery
window.addEventListener('DOMContentLoaded', () => {
    populateGallery();
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect on page load
window.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 500);
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Form validation for contact forms (if added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    display: none;
    z-index: 1000;
    transition: all 0.3s ease;
`;

document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', debounce(() => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.display = 'block';
    } else {
        scrollTopBtn.style.display = 'none';
    }
}, 100));
let map;
let markersLayer;
let currentModal = null;
let currentImageIndex = 0;
let currentSketch = null;
let allSketches = [];
let filteredSketches = [];
let initialView = { center: [20, 0], zoom: 2 };

export function initializeSketchesMap() {
    // Initialize the map
    map = L.map('sketches-map').setView([20, 0], 2);
    
    // Add modern Carto Light tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
        subdomains: 'abcd'
    }).addTo(map);
    
    // Initialize marker clustering
    markersLayer = L.markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 80,
        iconCreateFunction: function(cluster) {
            const count = cluster.getChildCount();
            return L.divIcon({
                html: `<div class="sketch-cluster"><span>${count}</span></div>`,
                className: 'sketch-cluster-icon',
                iconSize: [40, 40]
            });
        }
    });
    
    // Load sketches data and create markers
    loadSketchesData();
    
    // Add markers layer to map
    map.addLayer(markersLayer);
    
    // Add custom reset zoom control
    addResetZoomControl();
    
    // Set up modal event listeners
    setupModalEvents();
    
    // Generate year filter buttons and set up event listeners
    generateYearFilters();
    setupFilterEvents();
}

async function loadSketchesData() {
    try {
        // Use the sketches data passed from Eleventy
        if (window.sketchesData && window.sketchesData.sketches) {
            allSketches = window.sketchesData.sketches;
            filteredSketches = [...allSketches];
            createMarkers(filteredSketches);
        } else {
            console.error('No sketches data found');
        }
    } catch (error) {
        console.error('Error loading sketches data:', error);
    }
}

function createMarkers(sketches) {
    sketches.forEach(sketch => {
        const marker = L.marker([sketch.latitude, sketch.longitude], {
            icon: L.divIcon({
                html: `<div class="sketch-marker">
                    <div class="sketch-marker__dot"></div>
                    <div class="sketch-marker__count">${sketch.images.length}</div>
                </div>`,
                className: 'sketch-marker-icon',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        });
        
        marker.on('click', () => openSketchModal(sketch));
        markersLayer.addLayer(marker);
    });
}

function openSketchModal(sketch) {
    const modal = document.getElementById('sketch-modal');
    const imagesContainer = modal.querySelector('.sketch-modal__images');
    const locationElement = modal.querySelector('.sketch-modal__location');
    const dateElement = modal.querySelector('.sketch-modal__date');
    
    currentSketch = sketch;
    currentImageIndex = 0;
    
    // Set location and date with icons
    locationElement.innerHTML = `
        <svg class="location-icon" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <span>${sketch.location}</span>
    `;
    
    dateElement.innerHTML = `
        <svg class="date-icon" viewBox="0 0 24 24">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
        <span>${new Date(sketch.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}</span>
    `;
    
    // Show current image
    showCurrentImage();
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    currentModal = sketch;
}

function showCurrentImage(animate = false) {
    const modal = document.getElementById('sketch-modal');
    const imagesContainer = modal.querySelector('.sketch-modal__images');
    const imageInfoContainer = modal.querySelector('.sketch-modal__image-info');
    const prevButton = document.getElementById('prev-image');
    const nextButton = document.getElementById('next-image');
    
    if (!currentSketch || !currentSketch.images || currentSketch.images.length === 0) return;
    
    const currentImage = currentSketch.images[currentImageIndex];
    const isSingleImage = currentSketch.images.length === 1;
    
    if (animate) {
        // Add transition classes
        const existingImage = imagesContainer.querySelector('.sketch-modal__image');
        if (existingImage) {
            existingImage.classList.add('transitioning-out');
        }
        imageInfoContainer.classList.add('transitioning');
        
        // Wait for transition, then update content
        setTimeout(() => {
            updateImageContent();
        }, 75); // Half of transition duration
        
        setTimeout(() => {
            // Remove transition classes after animation completes
            const newImage = imagesContainer.querySelector('.sketch-modal__image');
            if (newImage) {
                newImage.classList.remove('transitioning-in');
            }
            imageInfoContainer.classList.remove('transitioning');
        }, 150);
    } else {
        updateImageContent();
    }
    
    function updateImageContent() {
        // Clear and update image container
        imagesContainer.innerHTML = '';
        const imageElement = document.createElement('div');
        imageElement.className = `sketch-modal__image ${isSingleImage ? 'single-image' : ''} ${animate ? 'transitioning-in' : ''}`;
        imageElement.innerHTML = `<img src="${currentImage.path}" alt="${currentImage.title}" loading="lazy">`;
        imagesContainer.appendChild(imageElement);
        
        // Update image info in sidebar
        imageInfoContainer.innerHTML = `
            <h4>${currentImage.title}</h4>
            ${currentImage.description ? `<p>${currentImage.description}</p>` : ''}
        `;
        
        // Update navigation buttons
        prevButton.disabled = currentImageIndex === 0;
        nextButton.disabled = currentImageIndex === currentSketch.images.length - 1;
        
        // Hide navigation if only one image
        const navigation = modal.querySelector('.sketch-modal__navigation');
        navigation.style.display = isSingleImage ? 'none' : 'flex';
    }
}

function navigateImage(direction) {
    if (!currentSketch) return;
    
    const newIndex = currentImageIndex + direction;
    if (newIndex >= 0 && newIndex < currentSketch.images.length) {
        currentImageIndex = newIndex;
        showCurrentImage(true); // Enable animation for navigation
    }
}

function closeSketchModal() {
    const modal = document.getElementById('sketch-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    currentModal = null;
}

function setupModalEvents() {
    const modal = document.getElementById('sketch-modal');
    const closeButton = modal.querySelector('.sketch-modal__close');
    const overlay = modal.querySelector('.sketch-modal__overlay');
    const prevButton = document.getElementById('prev-image');
    const nextButton = document.getElementById('next-image');
    
    closeButton.addEventListener('click', closeSketchModal);
    overlay.addEventListener('click', closeSketchModal);
    prevButton.addEventListener('click', () => navigateImage(-1));
    nextButton.addEventListener('click', () => navigateImage(1));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (currentModal) {
            if (e.key === 'Escape') {
                closeSketchModal();
            } else if (e.key === 'ArrowLeft') {
                navigateImage(-1);
            } else if (e.key === 'ArrowRight') {
                navigateImage(1);
            }
        }
    });
}

function setupFilterEvents() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const selectedYear = button.dataset.year;
            filterSketchesByYear(selectedYear);
        });
    });
}

function filterSketchesByYear(year) {
    if (year === 'all') {
        filteredSketches = [...allSketches];
    } else {
        filteredSketches = allSketches.filter(sketch => {
            const sketchYear = new Date(sketch.date).getFullYear().toString();
            return sketchYear === year;
        });
    }
    
    // Clear existing markers
    markersLayer.clearLayers();
    
    // Create new markers with filtered data
    createMarkers(filteredSketches);
}

function addResetZoomControl() {
    // Create custom reset zoom control
    const ResetZoomControl = L.Control.extend({
        onAdd: function(map) {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
            
            container.style.backgroundColor = 'white';
            container.style.width = '30px';
            container.style.height = '30px';
            container.style.cursor = 'pointer';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            container.style.fontSize = '14px';
            container.style.fontWeight = 'bold';
            container.innerHTML = '⌂';
            container.title = 'Reset to initial view';
            
            container.onclick = function() {
                map.setView(initialView.center, initialView.zoom);
            }
            
            return container;
        },
        onRemove: function(map) {
            // Nothing to do here
        }
    });
    
    // Add the control to the map
    map.addControl(new ResetZoomControl({ position: 'topleft' }));
}

function generateYearFilters() {
    if (!allSketches.length) return;
    
    // Extract unique years from sketch dates
    const years = [...new Set(allSketches.map(sketch => {
        return new Date(sketch.date).getFullYear();
    }))].sort((a, b) => b - a); // Sort descending (newest first)
    
    const filtersContainer = document.getElementById('year-filters');
    
    // Add "ALL" button
    const allButton = document.createElement('button');
    allButton.className = 'filter-btn active';
    allButton.dataset.year = 'all';
    allButton.textContent = 'ALL';
    filtersContainer.appendChild(allButton);
    
    // Add year buttons
    years.forEach(year => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.dataset.year = year.toString();
        button.textContent = year.toString();
        filtersContainer.appendChild(button);
    });
}
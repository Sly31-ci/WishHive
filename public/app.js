// Configuration - À remplacer par vos vraies valeurs
const API_BASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

// Get wishlist slug from URL
const wishlistSlug = window.location.pathname.split('/').pop() || window.location.pathname.split('/w/')[1];

// State
let wishlistData = null;

// ========================================
// MAIN INITIALIZATION
// ========================================
async function init() {
    try {
        showLoading();

        // Fetch wishlist data
        wishlistData = await fetchWishlist(wishlistSlug);

        if (!wishlistData) {
            showError('Cette wishlist n\'existe pas ou est privée.');
            return;
        }

        // Apply theme
        if (wishlistData.theme) {
            applyTheme(wishlistData.theme);
        }

        // Render content
        renderWishlist(wishlistData);

        hideLoading();
        showContent();

    } catch (error) {
        console.error('Error loading wishlist:', error);
        showError('Une erreur est survenue lors du chargement.');
    }
}

// ========================================
// API CALLS
// ========================================
async function fetchWishlist(slug) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/rest/v1/wishlists?slug=eq.${slug}&privacy=eq.public&select=*,items:wishlist_items(*),owner:profiles(username,avatar_url)`,
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch wishlist');
        }

        const data = await response.json();
        return data[0] || null;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// ========================================
// THEME APPLICATION
// ========================================
function applyTheme(theme) {
    if (!theme) return;

    const root = document.documentElement;

    // Colors
    if (theme.primaryColor) root.style.setProperty('--primary-color', theme.primaryColor);
    if (theme.secondaryColor) root.style.setProperty('--secondary-color', theme.secondaryColor);
    if (theme.accentColor) root.style.setProperty('--accent-color', theme.accentColor);

    // Typography
    if (theme.typography) {
        const typo = theme.typography;
        if (typo.fontFamily) root.style.setProperty('--font-family', getFontFamily(typo.fontFamily));
        if (typo.fontSize) root.style.setProperty('--font-size', `${typo.fontSize}px`);
        if (typo.color) root.style.setProperty('--text-color', typo.color);
        if (typo.alignment) root.style.setProperty('--text-align', typo.alignment);
        if (typo.letterSpacing) root.style.setProperty('--letter-spacing', `${typo.letterSpacing}px`);
        if (typo.lineHeight) root.style.setProperty('--line-height', typo.lineHeight);
        if (typo.bold) root.style.setProperty('--font-weight', '700');
    }

    // Background
    if (theme.background) {
        applyBackground(theme.background);
    }

    // Card Style
    if (theme.cardStyle) {
        const card = theme.cardStyle;
        if (card.borderRadius !== undefined) root.style.setProperty('--card-radius', `${card.borderRadius}px`);
        if (card.borderWidth !== undefined) root.style.setProperty('--card-border-width', `${card.borderWidth}px`);
        if (card.borderColor) root.style.setProperty('--card-border-color', card.borderColor);

        // Shadow intensity
        const shadowMap = {
            light: '0 2px 8px rgba(0, 0, 0, 0.1)',
            medium: '0 4px 16px rgba(0, 0, 0, 0.15)',
            strong: '0 8px 24px rgba(0, 0, 0, 0.2)'
        };
        if (card.shadowIntensity && shadowMap[card.shadowIntensity]) {
            root.style.setProperty('--card-shadow', shadowMap[card.shadowIntensity]);
        }
    }
}

function getFontFamily(family) {
    const fontMap = {
        system: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fun: '"Comic Sans MS", "Chalkboard SE", cursive',
        minimal: '"Helvetica Neue", Arial, sans-serif',
        handwritten: '"Brush Script MT", cursive',
        elegant: '"Playfair Display", serif',
        modern: '"Inter", "Roboto", sans-serif'
    };
    return fontMap[family] || fontMap.system;
}

function applyBackground(bg) {
    const bgLayer = document.getElementById('background-layer');
    if (!bgLayer) return;

    switch (bg.type) {
        case 'solid':
            bgLayer.className = 'background-layer solid';
            bgLayer.style.backgroundColor = bg.solidColor || '#FFFFFF';
            break;

        case 'gradient':
            bgLayer.className = 'background-layer gradient';
            if (bg.gradientColors && bg.gradientColors.length >= 2) {
                const direction = bg.gradientDirection === 'vertical' ? '180deg' :
                    bg.gradientDirection === 'horizontal' ? '90deg' : '135deg';
                bgLayer.style.background = `linear-gradient(${direction}, ${bg.gradientColors.join(', ')})`;
            }
            break;

        case 'image':
            bgLayer.className = 'background-layer image';
            if (bg.imageUrl || bg.imagePreset) {
                const imageUrl = bg.imageUrl || getPresetImageUrl(bg.imagePreset);
                bgLayer.style.backgroundImage = `url(${imageUrl})`;

                // Apply filters if specified
                if (bg.imageFilter) {
                    applyImageFilters(bgLayer, bg.imageFilter);
                }
            }
            break;

        case 'emoji':
            bgLayer.className = 'background-layer emoji-wall';
            renderEmojiWall(bg);
            break;

        default:
            bgLayer.className = 'background-layer solid';
            bgLayer.style.backgroundColor = '#FFFFFF';
    }
}

function getPresetImageUrl(preset) {
    const presetMap = {
        christmas: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543',
        birthday: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
        wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552',
        gaming: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
        kawaii: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
        luxury: 'https://images.unsplash.com/photo-1549298916-b41d501d3772'
    };
    return presetMap[preset] || '';
}

function applyImageFilters(element, filter) {
    let filterString = '';
    if (filter.blur) filterString += `blur(${filter.blur}px) `;
    if (filter.brightness) filterString += `brightness(${filter.brightness}) `;
    if (filter.contrast) filterString += `contrast(${filter.contrast}) `;

    if (filterString) {
        element.style.filter = filterString.trim();
    }
}

function renderEmojiWall(bg) {
    const bgLayer = document.getElementById('background-layer');
    if (!bgLayer) return;

    bgLayer.innerHTML = '';

    const densityMap = { low: 20, medium: 40, high: 60 };
    const count = densityMap[bg.emojiDensity || 'medium'];
    const emojis = bg.emojis || ['🎁'];

    for (let i = 0; i < count; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'emoji-item';
        emoji.textContent = emojis[i % emojis.length];

        // Position
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.style.top = `${Math.random() * 100}%`;

        // Size
        emoji.style.fontSize = `${bg.emojiSize || 40}px`;

        // Opacity
        emoji.style.opacity = bg.emojiOpacity || 0.15;

        // Rotation
        if (bg.emojiRotation) {
            emoji.style.transform = `rotate(${Math.random() * 360}deg)`;
        }

        bgLayer.appendChild(emoji);
    }
}

// ========================================
// CONTENT RENDERING
// ========================================
function renderWishlist(data) {
    // Page title
    document.getElementById('page-title').textContent = `${data.title} - WishHive`;

    // Meta tags for social sharing
    updateMetaTags(data);

    // Creator info
    if (data.owner) {
        const avatarEl = document.getElementById('creator-avatar');
        const nameEl = document.getElementById('creator-name');

        avatarEl.src = data.owner.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (data.owner.username || 'default');
        avatarEl.alt = data.owner.username || 'Créateur';
        nameEl.textContent = data.owner.username || 'Anonyme';
    }

    // Wishlist title
    const emojiEl = document.getElementById('wishlist-emoji');
    const textEl = document.getElementById('wishlist-text');

    if (data.theme && data.theme.emoji) {
        emojiEl.textContent = data.theme.emoji;
    }
    textEl.textContent = data.title;

    // Description
    const descEl = document.getElementById('wishlist-description');
    if (data.description) {
        descEl.textContent = data.description;
        descEl.style.display = 'block';
    } else {
        descEl.style.display = 'none';
    }

    // Stats
    const itemCountEl = document.getElementById('item-count');
    itemCountEl.textContent = data.items?.length || 0;

    // Items
    renderItems(data.items || []);
}

function updateMetaTags(data) {
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');

    if (ogTitle) ogTitle.content = data.title;
    if (ogDesc) ogDesc.content = data.description || `Découvrez la wishlist de ${data.owner?.username || 'quelqu\'un'}`;
}

function renderItems(items) {
    const grid = document.getElementById('items-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #6B7280; grid-column: 1/-1;">Aucun cadeau pour le moment</p>';
        return;
    }

    // Sort by order if available
    const sortedItems = items.sort((a, b) => (a.order || 0) - (b.order || 0));

    sortedItems.forEach(item => {
        const card = createItemCard(item);
        grid.appendChild(card);
    });
}

function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';

    // Apply card effect if specified in theme
    if (wishlistData.theme?.cardStyle?.effect && wishlistData.theme.cardStyle.effect !== 'none') {
        card.classList.add(wishlistData.theme.cardStyle.effect);
    }

    // Build card HTML
    let html = '';

    // Image
    if (item.image_url) {
        html += `<img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.title)}" class="item-image" onerror="this.style.display='none'">`;
    }

    // Content
    html += '<div class="item-content">';

    // Header (title + priority)
    html += '<div class="item-header">';
    html += `<h3 class="item-title">${escapeHtml(item.title)}</h3>`;
    if (item.priority) {
        html += `<span class="priority-badge">${getPriorityEmoji(item.priority)}</span>`;
    }
    html += '</div>';

    // Description
    if (item.description) {
        html += `<p class="item-description">${escapeHtml(item.description)}</p>`;
    }

    // Footer (price + link)
    html += '<div class="item-footer">';
    if (item.price) {
        html += `<span class="item-price">${item.price} €</span>`;
    }
    if (item.url) {
        html += `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="item-link">Voir 🔗</a>`;
    }
    html += '</div>';

    html += '</div>'; // Close item-content

    card.innerHTML = html;
    return card;
}

function getPriorityEmoji(priority) {
    const emojiMap = {
        high: '🔥',
        medium: '⭐',
        low: '💡'
    };
    return emojiMap[priority] || '';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// UI STATE MANAGEMENT
// ========================================
function showLoading() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const content = document.getElementById('content');

    if (loading) loading.classList.remove('hidden');
    if (error) error.classList.add('hidden');
    if (content) content.classList.add('hidden');
}

function showError(message) {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const content = document.getElementById('content');
    const errorMsg = document.getElementById('error-message');

    if (errorMsg) errorMsg.textContent = message;
    if (loading) loading.classList.add('hidden');
    if (error) error.classList.remove('hidden');
    if (content) content.classList.add('hidden');
}

function showContent() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const content = document.getElementById('content');

    if (loading) loading.classList.add('hidden');
    if (error) error.classList.add('hidden');
    if (content) content.classList.remove('hidden');
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.add('hidden');
}

// ========================================
// INITIALIZE
// ========================================
document.addEventListener('DOMContentLoaded', init);

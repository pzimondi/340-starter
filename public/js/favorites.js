/**
 * Favorites JavaScript
 * Enhancement: Vehicle Favorites/Wishlist System
 * Handles client-side favorite interactions
 */

'use strict';

// Initialize favorites functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeFavorites();
});

/**
 * Initialize all favorite-related functionality
 */
function initializeFavorites() {
  const favoriteButtons = document.querySelectorAll('.favorite-btn');
  
  favoriteButtons.forEach(button => {
    // Check if user is logged in (button will have data-logged-in attribute)
    if (button.dataset.loggedIn === 'true') {
      // Load favorite status for this vehicle
      loadFavoriteStatus(button);
    }
    
    // Add click handler
    button.addEventListener('click', handleFavoriteClick);
  });
}

/**
 * Load favorite status from server
 */
async function loadFavoriteStatus(button) {
  const invId = button.dataset.invId;
  
  try {
    const response = await fetch(`/favorites/status/${invId}`);
    const data = await response.json();
    
    if (data.isFavorite) {
      button.classList.add('favorited');
      button.innerHTML = '❤️ Favorited';
      button.setAttribute('aria-label', 'Remove from favorites');
    } else {
      button.classList.remove('favorited');
      button.innerHTML = '🤍 Add to Favorites';
      button.setAttribute('aria-label', 'Add to favorites');
    }
  } catch (error) {
    console.error('Error loading favorite status:', error);
  }
}

/**
 * Handle favorite button click
 */
async function handleFavoriteClick(event) {
  event.preventDefault();
  const button = event.currentTarget;
  const invId = button.dataset.invId;
  const isLoggedIn = button.dataset.loggedIn === 'true';
  
  // Check if user is logged in
  if (!isLoggedIn) {
    // Redirect to login with return URL
    const currentUrl = encodeURIComponent(window.location.pathname);
    window.location.href = `/account/login?redirect=${currentUrl}`;
    return;
  }
  
  // Disable button during request
  button.disabled = true;
  
  try {
    const response = await fetch('/favorites/toggle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inv_id: invId })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Update button appearance
      if (data.isFavorite) {
        button.classList.add('favorited');
        button.innerHTML = '❤️ Favorited';
        button.setAttribute('aria-label', 'Remove from favorites');
        showNotification(data.message || 'Added to favorites!', 'success');
      } else {
        button.classList.remove('favorited');
        button.innerHTML = '🤍 Add to Favorites';
        button.setAttribute('aria-label', 'Add to favorites');
        showNotification(data.message || 'Removed from favorites', 'info');
      }
      
      // Update favorites count if element exists
      updateFavoritesCount(data.favoriteCount);
    } else {
      showNotification(data.message || 'Failed to update favorites', 'error');
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    showNotification('An error occurred. Please try again.', 'error');
  } finally {
    button.disabled = false;
  }
}

/**
 * Update favorites count in navigation or header
 */
function updateFavoritesCount(count) {
  const countElement = document.querySelector('.favorites-count-badge');
  if (countElement && count !== undefined) {
    countElement.textContent = count;
    countElement.style.display = count > 0 ? 'inline' : 'none';
  }
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.favorite-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `favorite-notification favorite-notification-${type}`;
  notification.textContent = message;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'polite');
  
  // Add to page
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add CSS for notifications dynamically
const style = document.createElement('style');
style.textContent = `
.favorite-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  font-weight: 600;
  z-index: 10000;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  max-width: 300px;
}

.favorite-notification.show {
  opacity: 1;
  transform: translateY(0);
}

.favorite-notification-success {
  background: #10b981;
  color: white;
}

.favorite-notification-error {
  background: #ef4444;
  color: white;
}

.favorite-notification-info {
  background: #3b82f6;
  color: white;
}

.favorite-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 2px solid var(--teal, #0ea5b7);
  color: var(--teal, #0ea5b7);
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
  text-decoration: none;
}

.favorite-btn:hover:not(:disabled) {
  background: var(--teal, #0ea5b7);
  color: white;
}

.favorite-btn.favorited {
  background: #fecaca;
  border-color: #ef4444;
  color: #dc2626;
}

.favorite-btn.favorited:hover:not(:disabled) {
  background: #ef4444;
  color: white;
}

.favorite-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.favorites-count-badge {
  display: inline-block;
  background: #ef4444;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: 5px;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .favorite-notification {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
`;
document.head.appendChild(style);
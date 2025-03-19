/**
 * Tulabe Filimu - Streaming Platform
 * JavaScript for interactive elements and responsive behavior
 */

// Global variables
const arrows = document.querySelectorAll(".arrow");
const movieLists = document.querySelectorAll(".movie-list");
let isAnimating = false;

// Initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initNavbarBehavior();
  initArrowNavigation();
  initCategorySelector();
  initMovieItemHovers();
  initResponsiveAdjustments();
  
  // New futuristic features
  initFuturisticLoader();
  initSectionAnimations();
  initScrollEffects();
  initParallaxEffect();
  initDynamicGlowEffects();
});

// Handle navbar behavior
function initNavbarBehavior() {
  const navbar = document.querySelector('.navbar');
  
  // Change navbar appearance on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // Handle menu item clicks on mobile
  const navLinks = document.querySelectorAll('.menu-list-item');
  const menuToggle = document.querySelector('.navbar-toggler');
  const navbarContent = document.getElementById('navbarContent');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Add ripple effect to menu clicks
      createRippleEffect(link);
      
      // Make menu items clickable as navigation
      document.querySelectorAll('.menu-list-item').forEach(item => {
        item.classList.remove('active');
      });
      link.classList.add('active');
      
      // Close the mobile menu when a link is clicked
      if (window.innerWidth < 992 && navbarContent.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarContent);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
}

// Set up responsive adjustments for different screen sizes
function initResponsiveAdjustments() {
  adjustMovieItemsDisplay();
  
  // Update on window resize
  window.addEventListener('resize', debounce(() => {
    adjustMovieItemsDisplay();
  }, 250));
  
  // Initial check for screen size to adjust hover behavior
  checkScreenSize();
  window.addEventListener('resize', debounce(checkScreenSize, 250));
}

// Debounce function to limit excessive function calls
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

// Check screen size and adjust behavior accordingly
function checkScreenSize() {
  const isMobile = window.innerWidth < 768;
  
  // Adjust movie item hover behavior for mobile
  if (isMobile) {
    document.querySelectorAll('.movie-list-item').forEach(item => {
      item.dataset.hoverDisabled = 'true';
      
      // For mobile: show info on tap, hide on second tap
      item.addEventListener('click', toggleMovieInfo);
    });
  } else {
    document.querySelectorAll('.movie-list-item').forEach(item => {
      item.dataset.hoverDisabled = 'false';
      item.removeEventListener('click', toggleMovieInfo);
    });
  }
}

// Toggle movie info panel on mobile
function toggleMovieInfo(e) {
  // Don't toggle if clicking on a button
  if (e.target.closest('.movie-list-item-button')) {
    return;
  }
  
  const movieInfo = this.querySelector('.movie-info');
  
  if (movieInfo.style.opacity === '1') {
    movieInfo.style.opacity = '0';
    movieInfo.style.bottom = '-60px';
  } else {
    // First hide all other open movie infos
    document.querySelectorAll('.movie-info').forEach(info => {
      if (info !== movieInfo) {
        info.style.opacity = '0';
        info.style.bottom = '-60px';
      }
    });
    
    // Then show this one
    movieInfo.style.opacity = '1';
    movieInfo.style.bottom = '0';
  }
}

// Handle movie item hover effects
function initMovieItemHovers() {
  const movieItems = document.querySelectorAll('.movie-list-item');
  
  movieItems.forEach(item => {
    // Add a more subtle hover effect for better UX
    item.addEventListener('mouseenter', function() {
      if (this.dataset.hoverDisabled === 'true') return;
      
      const siblings = Array.from(this.parentNode.children);
      siblings.forEach(sibling => {
        if (sibling !== this) {
          sibling.style.opacity = '0.7';
          sibling.style.transform = 'scale(0.95)';
        }
      });
      
      this.style.transform = 'scale(1.15)';
      this.style.zIndex = '10';
    });
    
    item.addEventListener('mouseleave', function() {
      if (this.dataset.hoverDisabled === 'true') return;
      
      const siblings = Array.from(this.parentNode.children);
      siblings.forEach(sibling => {
        sibling.style.opacity = '1';
        sibling.style.transform = 'scale(1)';
      });
      
      this.style.zIndex = '1';
    });
  });
}

// Adjust movie items display based on screen size
function adjustMovieItemsDisplay() {
  const isSmallScreen = window.innerWidth < 768;
  
  // For small screens, make sure the movie lists show properly
  if (isSmallScreen) {
    movieLists.forEach(list => {
      // Reset any transforms that might be applied
      list.style.transform = 'translateX(0)';
    });
    
    // Make arrows disappear on small screens
    arrows.forEach(arrow => {
      arrow.classList.add('d-none');
    });
  } else {
    arrows.forEach(arrow => {
      if (arrow.classList.contains('d-none')) {
        arrow.classList.remove('d-none');
        arrow.classList.add('d-flex');
      }
    });
  }
}

// Handle arrow navigation for movie lists
function initArrowNavigation() {
  arrows.forEach((arrow, i) => {
    const movieList = movieLists[i];
    const itemCount = movieList.querySelectorAll(".movie-list-item").length;
    let clickCounter = 0;
    
    arrow.addEventListener("click", () => {
      if (isAnimating) return;
      isAnimating = true;
      
      // Calculate visible items based on screen width
      const visibleItems = calculateVisibleItems();
      
      // Direction: left arrow moves forward (right), right arrow moves backward (left)
      // This might seem counterintuitive but matches Netflix UX
      const direction = arrow.classList.contains("left") ? 1 : -1;
      clickCounter = clickCounter - direction;
      
      // Calculate the maximum number of "pages"
      const maxClickCount = Math.ceil(itemCount / visibleItems) - 1;
      
      // Loop back to beginning or end
      if (clickCounter < 0) clickCounter = maxClickCount;
      if (clickCounter > maxClickCount) clickCounter = 0;
      
      // Get width of one movie item including margin
      const movieItem = movieList.querySelector(".movie-list-item");
      const movieItemStyle = getComputedStyle(movieItem);
      const itemWidth = movieItem.offsetWidth + 
                        parseInt(movieItemStyle.marginRight);
      
      // Calculate the translation distance
      const translateValue = -clickCounter * visibleItems * itemWidth;
      
      // Add animation effect
      arrow.style.transform = 'scale(0.95)';
      setTimeout(() => { arrow.style.transform = 'scale(1)'; }, 100);
      
      // Apply the transform
      movieList.style.transform = `translateX(${translateValue}px)`;
      
      // Re-enable click after animation completes
      setTimeout(() => {
        isAnimating = false;
      }, 500); // Match the transition duration from CSS
    });
  });
}

// Calculate how many items should be visible based on screen width
function calculateVisibleItems() {
  const width = window.innerWidth;
  
  if (width >= 1400) return 6;       // xxl
  else if (width >= 1200) return 5;  // xl
  else if (width >= 992) return 4;   // lg
  else if (width >= 768) return 3;   // md
  else if (width >= 576) return 2;   // sm
  else return 1;                     // xs
}

// Initialize category selector functionality
function initCategorySelector() {
  const categoryOptions = document.querySelectorAll('.category-option');
  
  categoryOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove active class from all options
      categoryOptions.forEach(opt => {
        opt.classList.remove('active');
      });
      
      // Add active class to clicked option
      option.classList.add('active');
      
      // Get selected category
      const selectedCategory = option.getAttribute('data-category');
      
      // Filter movie items based on category
      document.querySelectorAll('.movie-list-item').forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (selectedCategory === 'all' || selectedCategory === itemCategory) {
          // Show items matching the category with a fade-in effect
          item.style.display = 'block';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
          }, 50);
        } else {
          // Hide non-matching items with a fade-out effect
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
      
      // Reset list positions after filtering
      movieLists.forEach(list => {
        list.style.transform = 'translateX(0)';
      });
    });
  });
}

// Add enhanced accessibility for keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    // Add focus styles for keyboard users
    document.body.classList.add('keyboard-nav');
  }
});

// Remove focus styles when using mouse
document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// Futuristic loader animation
function initFuturisticLoader() {
  const body = document.body;
  
  // Create loader element
  const loaderDiv = document.createElement('div');
  loaderDiv.className = 'futuristic-loader';
  
  const loaderIcon = document.createElement('div');
  loaderIcon.className = 'loader-icon';
  
  // Create three animated circles
  for (let i = 0; i < 3; i++) {
    const circle = document.createElement('div');
    circle.className = 'loader-circle';
    loaderIcon.appendChild(circle);
  }
  
  loaderDiv.appendChild(loaderIcon);
  body.appendChild(loaderDiv);
  
  // Hide loader after content is loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      loaderDiv.classList.add('hidden');
    }, 800);
  });
}

// Initialize section appearance animations
function initSectionAnimations() {
  const movieListContainers = document.querySelectorAll('.movie-list-container');
  
  // Set initial delay for staggered animation
  let delay = 100;
  
  // Create observer for scrolling animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add appear class with delay for staggered effect
        setTimeout(() => {
          entry.target.classList.add('appear');
        }, delay);
        delay += 150; // Increase delay for next section
        
        // Unobserve after animation is added
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 }); // Trigger when 10% of element is visible
  
  // Observe all movie list containers
  movieListContainers.forEach(container => {
    observer.observe(container);
  });
}

// Initialize scroll effects and indicators
function initScrollEffects() {
  // Create scroll indicator
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'scroll-indicator';
  scrollIndicator.innerHTML = '<i class="fas fa-chevron-up"></i>';
  document.body.appendChild(scrollIndicator);
  
  // Handle scroll events
  window.addEventListener('scroll', debounce(() => {
    // Show/hide scroll indicator
    if (window.scrollY > 300) {
      scrollIndicator.classList.add('visible');
    } else {
      scrollIndicator.classList.remove('visible');
    }
    
    // Animate elements as they come into view
    animateElementsOnScroll();
  }, 100));
  
  // Scroll to top when indicator is clicked
  scrollIndicator.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Animate elements as they come into view while scrolling
function animateElementsOnScroll() {
  const fadeElements = document.querySelectorAll('.fade-in-section');
  
  fadeElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementTop < windowHeight * 0.9) { // When element is 90% into viewport
      element.classList.add('is-visible');
    }
  });
}

// Parallax effect for featured content
function initParallaxEffect() {
  const featuredContent = document.querySelector('.featured-content');
  
  if (!featuredContent) return;
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    // Only apply effect if the featured content is in view
    if (scrollPosition < featuredContent.offsetHeight) {
      // Create parallax effect by moving background position
      const yPos = scrollPosition * 0.3;
      featuredContent.style.backgroundPosition = `center ${30 + yPos}%`;
    }
  });
  
  // Mouse movement parallax for enhanced effect
  featuredContent.addEventListener('mousemove', (e) => {
    const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
    const yPos = (e.clientY / window.innerHeight - 0.5) * 10;
    
    featuredContent.style.backgroundPosition = `calc(center + ${xPos}px) calc(30% + ${yPos}px)`;
  });
}

// Dynamic glow effects that follow mouse
function initDynamicGlowEffects() {
  const buttons = document.querySelectorAll('.featured-button, .movie-list-item-button');
  const logo = document.querySelector('.logo');
  
  // Add glow effect to interactive elements
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      
      // Calculate distance from mouse to button
      const distance = Math.sqrt(
        Math.pow(mouseX - btnCenterX, 2) + 
        Math.pow(mouseY - btnCenterY, 2)
      );
      
      if (distance < 100) {
        // Closer mouse = stronger glow
        const intensity = 1 - (distance / 100);
        button.style.boxShadow = `0 8px 20px rgba(0, 0, 0, 0.5), 0 0 ${15 + intensity * 15}px ${2 + intensity * 2}px var(--primary-glow)`;
      } else {
        button.style.boxShadow = '';
      }
    });
    
    // Dynamic logo effect
    if (logo) {
      const rect = logo.getBoundingClientRect();
      const logoCenterX = rect.left + rect.width / 2;
      const logoCenterY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(mouseX - logoCenterX, 2) + 
        Math.pow(mouseY - logoCenterY, 2)
      );
      
      if (distance < 150) {
        const intensity = 1 - (distance / 150);
        logo.style.boxShadow = `0 8px 20px rgba(0, 0, 0, 0.5), 0 0 ${15 + intensity * 15}px ${2 + intensity * 2}px var(--primary-glow)`;
      } else {
        logo.style.boxShadow = '';
      }
    }
  });
}

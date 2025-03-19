const arrows = document.querySelectorAll(".arrow");
const movieLists = document.querySelectorAll(".movie-list");

// Initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initHoverEffects();
});

// Scroll behavior for navbar with enhanced effects
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Add subtle particle background effect to featured content
function initParticles() {
  const featuredContent = document.querySelector('.featured-content');
  if (!featuredContent) return;
  
  const particlesContainer = document.createElement('div');
  particlesContainer.classList.add('particles-container');
  particlesContainer.style.position = 'absolute';
  particlesContainer.style.top = '0';
  particlesContainer.style.left = '0';
  particlesContainer.style.width = '100%';
  particlesContainer.style.height = '100%';
  particlesContainer.style.pointerEvents = 'none';
  particlesContainer.style.zIndex = '1';
  
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random positioning
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Random size
    const size = Math.random() * 2 + 1;
    
    // Styling
    particle.style.position = 'absolute';
    particle.style.top = `${y}%`;
    particle.style.left = `${x}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = 'rgba(255, 255, 255, 0.3)';
    particle.style.borderRadius = '50%';
    particle.style.opacity = '0.5';
    particle.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.5)';
    
    // Animation
    const duration = Math.random() * 20 + 10;
    particle.style.animation = `float ${duration}s infinite ease-in-out`;
    
    particlesContainer.appendChild(particle);
  }
  
  // Create the keyframe animation
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes float {
      0%, 100% {
        transform: translateY(0) translateX(0);
      }
      50% {
        transform: translateY(-20px) translateX(10px);
      }
    }
  `;
  document.head.appendChild(style);
  
  featuredContent.insertBefore(particlesContainer, featuredContent.firstChild);
}

// Add hover effects for a more futuristic feel
function initHoverEffects() {
  // Pulse effect for buttons
  document.querySelectorAll('.featured-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
    });
  });
}

// Set up responsive behavior
function calculateItemsToShow() {
  if (window.innerWidth >= 1400) return 6;
  if (window.innerWidth >= 1200) return 5;
  if (window.innerWidth >= 992) return 4;
  if (window.innerWidth >= 768) return 3;
  if (window.innerWidth >= 576) return 2;
  return 1;
}

// Set the width of movie items based on screen size
function adjustMovieItemsWidth() {
  const movieItems = document.querySelectorAll('.movie-list-item');
  const containerWidth = document.querySelector('.content-container').offsetWidth;
  const itemsToShow = calculateItemsToShow();
  const margins = 10; // margin-right of each item
  
  const itemWidth = (containerWidth - (margins * itemsToShow)) / itemsToShow;
  
  movieItems.forEach(item => {
    item.style.width = `${itemWidth}px`;
  });
}

// Initialize and handle window resize events
adjustMovieItemsWidth();
window.addEventListener('resize', () => {
  adjustMovieItemsWidth();
});

// Set up arrow navigation for movie lists with enhanced transitions
arrows.forEach((arrow, i) => {
  const movieList = movieLists[i];
  const itemCount = movieList.querySelectorAll(".movie-list-item").length;
  const itemsToShow = calculateItemsToShow();
  const itemWidth = movieList.querySelector(".movie-list-item").offsetWidth + 10; // Width plus margin
  
  let clickCounter = 0;
  
  arrow.addEventListener("click", () => {
    // Add click effect
    arrow.style.transform = 'scale(0.95)';
    setTimeout(() => {
      arrow.style.transform = 'scale(1)';
    }, 100);
    
    const direction = arrow.classList.contains('left') ? 1 : -1;
    clickCounter -= direction;
    
    const maxClicks = Math.ceil(itemCount / itemsToShow) - 1;
    
    // Loop back to beginning or end
    if (clickCounter < 0) {
      clickCounter = maxClicks;
    } else if (clickCounter > maxClicks) {
      clickCounter = 0;
    }
    
    const translateX = -itemWidth * itemsToShow * clickCounter;
    movieList.style.transform = `translateX(${translateX}px)`;
  });
});

// Category selector functionality with enhanced UI feedback
document.querySelectorAll('.category-option').forEach(option => {
  option.addEventListener('click', () => {
    // Remove active class from all options
    document.querySelectorAll('.category-option').forEach(opt => {
      opt.classList.remove('active');
    });
    
    // Add active class to clicked option with a ripple effect
    option.classList.add('active');
    
    // Create ripple effect
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    // Create the keyframe animation for ripple if it doesn't exist
    if (!document.querySelector('#ripple-animation')) {
      const style = document.createElement('style');
      style.id = 'ripple-animation';
      style.innerHTML = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    option.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
    // Filter movie list based on category
    const category = option.getAttribute('data-category');
    movieLists.forEach(list => {
      list.querySelectorAll('.movie-list-item').forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});

// Theme toggle functionality
const ball = document.querySelector(".toggle-ball");
const items = document.querySelectorAll(
  ".container,.movie-list-title,.navbar-container,.sidebar,.left-menu-icon,.toggle,.navbar"
);

ball.addEventListener("click", () => {
  items.forEach((item) => {
    item.classList.toggle("active");
  });
  ball.classList.toggle("active");
});

// Handle navbar collapse on mobile
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.menu-list-item');
  const menuToggle = document.querySelector('.navbar-toggler');
  const navbarContent = document.getElementById('navbarContent');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarContent);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
});

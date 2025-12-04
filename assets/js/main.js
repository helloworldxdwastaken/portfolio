/* ==========================
   UI/UX Freelancer Portfolio Interactions
   OPTIMIZED FOR PERFORMANCE
   ========================== */

// Theme Detection & Toggle
(() => {
	const THEME_KEY = "portfolio-theme";
	
	// Swap brand logos for light/dark variants based on filename convention: name.svg -> name_light.svg
	const updateBrandLogos = (theme) => {
		const imgs = document.querySelectorAll(".brands-strip img, .brands-track img");
		imgs.forEach((img) => {
			// Cache base src and derived light src once
			if (!img.dataset.srcBase) {
				const current = img.getAttribute("src");
				img.dataset.srcBase = current;
				
				const dot = current.lastIndexOf(".");
				if (dot !== -1) {
					const lightSrc = `${current.slice(0, dot)}_light${current.slice(dot)}`;
					img.dataset.srcLight = lightSrc;
				}
			}
			
			const base = img.dataset.srcBase;
			const light = img.dataset.srcLight;
			const allowLight = light && img.dataset.hasLight !== "false";
			const useLight = theme === "light" && allowLight;
			const target = useLight ? light : base;
			
			// Swap with a safe fallback: if light variant 404s, revert to base
			if (useLight) {
				img.onerror = () => {
					img.onerror = null;
					img.dataset.hasLight = "false";
					img.src = base;
				};
			} else {
				img.onerror = null;
			}
			
			if (target && img.getAttribute("src") !== target) {
				img.setAttribute("src", target);
			}
		});
	};
	
	// Detect user's preferred theme
	const getPreferredTheme = () => {
		// Check localStorage first
		const saved = localStorage.getItem(THEME_KEY);
		if (saved) return saved;
		
		// Check system preference
		if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			return "dark";
		}
		if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
			return "light";
		}
		
		// Default to dark
		return "dark";
	};
	
	// Apply theme by adding/removing data-theme attribute
	const applyTheme = (theme) => {
		document.documentElement.setAttribute("data-theme", theme);
		document.documentElement.style.colorScheme = theme;
		localStorage.setItem(THEME_KEY, theme);
		updateBrandLogos(theme);
	};
	
	// Listen for system theme changes
	if (window.matchMedia) {
		const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
		darkModeQuery.addEventListener("change", (e) => {
			if (!localStorage.getItem(THEME_KEY)) {
				applyTheme(e.matches ? "dark" : "light");
			}
		});
		
		const lightModeQuery = window.matchMedia("(prefers-color-scheme: light)");
		lightModeQuery.addEventListener("change", (e) => {
			if (!localStorage.getItem(THEME_KEY)) {
				applyTheme(e.matches ? "light" : "dark");
			}
		});
	}
	
	// Initialize theme on page load
	const preferredTheme = getPreferredTheme();
	applyTheme(preferredTheme);
	
	const handleThemeToggle = () => {
		// Get current theme from the actual DOM attribute, not just localStorage
		const currentDataTheme = document.documentElement.getAttribute("data-theme");
		const currentTheme = currentDataTheme || localStorage.getItem(THEME_KEY) || preferredTheme;
		const newTheme = currentTheme === "light" ? "dark" : "light";
		applyTheme(newTheme);
		
		// Update meta theme-color
		const themeColor = document.getElementById("theme-color");
		if (themeColor) {
			themeColor.content = newTheme === "light" ? "#f8f7fc" : "#050507";
		}
		
		// Log for debugging
		console.log("Theme switched to:", newTheme);
	};
	
	// Theme toggle button handler (supports multiple buttons)
	const themeToggleButtons = document.querySelectorAll(".theme-toggle");
	if (themeToggleButtons.length) {
		themeToggleButtons.forEach((btn) => btn.addEventListener("click", handleThemeToggle));
	}
})();

// Utility selectors
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Set year and availability month
(() => {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    const yearFooter = $("#year-footer");
    if (yearFooter) yearFooter.textContent = String(new Date().getFullYear());
	const availability = $("#availability");
	if (availability) {
		const d = new Date();
		const month = d.toLocaleString(undefined, { month: "short" });
		availability.textContent = month;
	}
})();

// Mobile nav toggle and navbar shrink
(() => {
	const init = () => {
		const nav = $(".nav");
		const toggle = $(".nav-toggle");
		const header = $(".site-header");
		const menuLinks = $$(".nav-menu a");
		
		if (!nav || !toggle) return;
		
		const setOpen = (open) => {
			nav.classList.toggle("open", open);
			toggle.setAttribute("aria-expanded", String(open));
			document.body.style.overflow = open ? "hidden" : "";
		};
		
		// Toggle on button click
		toggle.addEventListener("click", (e) => {
			e.stopPropagation();
			setOpen(!nav.classList.contains("open"));
		});
		
		// Close on menu link click
		menuLinks.forEach((a) => a.addEventListener("click", () => setOpen(false)));
		
		// Close when clicking outside (on the overlay)
		document.addEventListener("click", (e) => {
			if (nav.classList.contains("open")) {
				const menu = $(".nav-menu");
				const isClickInsideMenu = menu && menu.contains(e.target);
				const isClickOnToggle = toggle.contains(e.target);
				
				if (!isClickInsideMenu && !isClickOnToggle) {
					setOpen(false);
				}
			}
		});
		
		// Close on ESC key
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && nav.classList.contains("open")) {
				setOpen(false);
			}
		});
		
		// Navbar shrink on scroll
		if (header) {
			window.addEventListener("scroll", () => {
				const currentScroll = window.pageYOffset;
				if (currentScroll > 50) {
					header.classList.add("scrolled");
				} else {
					header.classList.remove("scrolled");
				}
			}, { passive: true });
			
			// Navbar expand on hover when scrolled
			header.addEventListener("mouseenter", () => {
				if (header.classList.contains("scrolled")) {
					header.classList.add("hovered");
				}
			});
			
	header.addEventListener("mouseleave", () => {
		header.classList.remove("hovered");
	});

	// Make project cards clickable on mobile (when button is hidden)
	const workProjectCards = document.querySelectorAll('.work-page .project-card');
	if (workProjectCards.length > 0) {
		workProjectCards.forEach(card => {
			card.addEventListener('click', (e) => {
				// Only make card clickable on mobile (when button is hidden)
				const button = card.querySelector('.project-check');
				if (button && window.getComputedStyle(button).display === 'none') {
					// Don't trigger if clicking on a link inside the card
					if (!e.target.closest('a')) {
						const link = button.getAttribute('href');
						const isExternal = button.getAttribute('target') === '_blank';
						
						if (link) {
							if (isExternal) {
								window.open(link, '_blank', 'noopener,noreferrer');
							} else {
								window.location.href = link;
							}
						}
					}
				}
			});
		});
	}

	// Work page filtering functionality
	const filterButtons = document.querySelectorAll('.filter-btn');
	const projectCards = document.querySelectorAll('.project-card');

	if (filterButtons.length > 0 && projectCards.length > 0) {
		filterButtons.forEach(button => {
			button.addEventListener('click', () => {
				// Remove active class from all buttons
				filterButtons.forEach(btn => btn.classList.remove('active'));
				// Add active class to clicked button
				button.classList.add('active');

				const filterValue = button.getAttribute('data-filter');

				// Filter projects
				projectCards.forEach(card => {
					const categories = card.getAttribute('data-categories');
					
					if (filterValue === 'all' || categories.includes(filterValue)) {
						card.classList.remove('hidden');
					} else {
						card.classList.add('hidden');
					}
				});

				// Smooth scroll to projects section after filtering
				const workGrid = document.querySelector('.work-grid');
				if (workGrid) {
					workGrid.scrollIntoView({ 
						behavior: 'smooth',
						block: 'start'
					});
				}
			});
		});
	}
		}
	};
	
	// Wait for navbar to load if using components
	if ($(".site-header")) {
		init();
	} else {
		window.addEventListener('componentsLoaded', init);
	}
})();

// Rotating role text in hero
(() => {
    const el = document.getElementById('heroRole');
    if (!el) return;
    
    const roles = [
        'Web Designer',
        'Marketing designer',
        'UI/UX designer',
        '3D Designer',
        'Motion designer',
        'Video editor'
    ];
    // Ensure initial text matches the first role
    el.textContent = roles[0];
    // Prevent layout shift: set fixed width to longest role
    const longest = roles.reduce((a, b) => a.length >= b.length ? a : b, '');
    const meas = document.createElement('span');
    meas.style.position = 'absolute';
    meas.style.visibility = 'hidden';
    meas.style.whiteSpace = 'nowrap';
    meas.style.fontSize = getComputedStyle(el).fontSize;
    meas.style.fontWeight = getComputedStyle(el).fontWeight;
    meas.style.fontFamily = getComputedStyle(el).fontFamily;
    meas.style.letterSpacing = getComputedStyle(el).letterSpacing;
    meas.textContent = longest;
    document.body.appendChild(meas);
    el.style.display = 'inline-block';
    el.style.minWidth = `${Math.ceil(meas.getBoundingClientRect().width) + 10}px`;
    document.body.removeChild(meas);
    let i = 0;
    const rotate = () => {
        i = (i + 1) % roles.length;
        el.style.animation = 'none';
        el.offsetHeight;
        el.textContent = roles[i];
        el.style.animation = '';
    };
    if (roles.length > 1) {
        setInterval(rotate, 2400);
    }
})();

// Optimized scrollspy active state for nav
(() => {
    // Wait for components to load
    const initScrollSpy = () => {
        const links = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
        if (!links.length) return;

        const targets = links
            .map((a) => {
                const href = a.getAttribute('href');
                const el = document.querySelector(href);
                return el ? { a, el } : null;
            })
            .filter(Boolean);

        if (!targets.length) return;

        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const y = window.scrollY + 200;
                    let current = null;
                    
                    // Find which section we're in
                    for (const { a, el } of targets) {
                        if (el.offsetTop <= y) {
                            if (!current || el.offsetTop > current.el.offsetTop) {
                                current = { a, el };
                            }
                        }
                    }
                    
                    // Update active states
                    links.forEach((l) => {
                        l.classList.remove('is-active');
                        if (current && l === current.a) {
                            l.classList.add('is-active');
                        }
                    });
                    
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    };
    
    // Initialize after components are loaded
    if (document.querySelector('.nav-menu')) {
        initScrollSpy();
    } else {
        window.addEventListener('componentsLoaded', initScrollSpy);
    }
})();

// Smooth scrolling via Lenis - OPTIMIZED FOR PERFORMANCE
let lenis;
(() => {
	if (!window.Lenis) return;
	lenis = new Lenis({
		smoothWheel: true,
		syncTouch: false,
		smoothTouch: false,
		gestureOrientation: "vertical",
		lerp: 0.08,
		duration: 1.0,
		easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
		orientation: "vertical",
		touchMultiplier: 2,
		infinite: false
	});
	function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
	requestAnimationFrame(raf);
})();

// GSAP + ScrollTrigger animations - OPTIMIZED
(() => {
	// Check if mobile FIRST before doing anything with GSAP
	const isMobile = window.innerWidth <= 768;
	
	if (isMobile) {
		// MOBILE: Don't initialize GSAP at all
		console.log('📱 Mobile: GSAP disabled globally');
		return; // Exit early, skip all animations
	}
	
	// DESKTOP ONLY: Initialize GSAP
	if (!window.gsap) return;
	gsap.registerPlugin(ScrollTrigger);
	console.log('🖥️ Desktop: GSAP enabled');
	
	// Desktop animations only
	ScrollTrigger.config({ 
		autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
		refreshPriority: -1,
		limitCallbacks: true
	});
	
    // Hero + nav intro - SIMPLIFIED
    gsap.from(".site-header", { y: -20, autoAlpha: 0, duration: 0.5, ease: "power2.out" });
    gsap.from(".hero h1", { y: 20, autoAlpha: 0, duration: 0.7, ease: "power2.out" });
    gsap.from([".hero p", ".hero-cta"], { y: 15, autoAlpha: 0, duration: 0.6, ease: "power2.out", stagger: 0.1, delay: 0.2 });

    // Section reveals - SIMPLIFIED
	$$(".section").forEach((section) => {
		const head = section.querySelector(".section-head");
		if (head) {
			gsap.from(head, {
				y: 20, autoAlpha: 0, duration: 0.6, ease: "power2.out",
				scrollTrigger: { 
					trigger: section, 
					start: "top 80%",
					once: true
				}
			});
		}
        const cards = section.querySelectorAll(".about-card, .work-card, .project-row, .service-card");
		if (cards.length) {
			gsap.from(cards, {
				y: 20, autoAlpha: 0, duration: 0.5, ease: "power2.out", stagger: 0.1,
				scrollTrigger: { 
					trigger: section, 
					start: "top 75%",
					once: true
				}
			});
		}
	});

	// Testimonials carousel - FIXED AND OPTIMIZED
	const carousel = $(".testi-carousel .testi-list");
	if (carousel) {
		const cards = $$(".testi-carousel .testi-card");
		const total = cards.length;
		const viewport = $(".testi-carousel .testi-viewport");

		if (total === 0) return;

		let currentIndex = 0;
		let isAnimating = false;
		let autoScrollTimer;

		const updateCarousel = () => {
			if (isAnimating || total === 0) return;
			isAnimating = true;

			// Get actual card dimensions (responsive)
			const cardRect = cards[0].getBoundingClientRect();
			const cardWidth = cardRect.width || 380; // fallback to default width
			
			// Use responsive gap values that match CSS
			const gap = window.innerWidth <= 640 ? 12 : 24; // var(--space-2) on mobile, var(--space-4) on desktop
			
			const viewportWidth = viewport.offsetWidth;
			const viewportCenterX = viewportWidth / 2;
			
			// Calculate the position to center the current card
			const currentCardCenterX = (currentIndex * (cardWidth + gap)) + (cardWidth / 2);
			const translateX = viewportCenterX - currentCardCenterX;

			// Apply the transform
			carousel.style.transform = `translateX(${translateX}px)`;
			carousel.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

			// Update card states
			cards.forEach((card, i) => {
				card.classList.remove('is-center', 'is-side');

				const leftCardIndex = (currentIndex - 1 + total) % total;
				const centerCardIndex = currentIndex;
				const rightCardIndex = (currentIndex + 1) % total;

				if (i === centerCardIndex) {
					card.classList.add('is-center');
				} else if (i === leftCardIndex || i === rightCardIndex) {
					card.classList.add('is-side');
				}
			});

			setTimeout(() => { isAnimating = false; }, 800);
		};
		
		const nextSlide = () => {
			if (isAnimating) return;
			currentIndex = (currentIndex + 1) % total;
			updateCarousel();
		};
		
		const startAutoScroll = () => {
			clearInterval(autoScrollTimer);
			autoScrollTimer = setInterval(nextSlide, 3000);
		};
		
		const stopAutoScroll = () => {
			clearInterval(autoScrollTimer);
		};
		
		// Initialize carousel after DOM is ready
		setTimeout(() => {
			updateCarousel();
		}, 100);
		
		// Start auto-scroll after a longer delay
		setTimeout(() => {
			startAutoScroll();
		}, 2000);
		
		viewport.addEventListener('mouseenter', stopAutoScroll);
		viewport.addEventListener('mouseleave', startAutoScroll);
		
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				updateCarousel();
			}, 200);
		});

		window.addEventListener('load', () => {
			setTimeout(updateCarousel, 300);
		});
	}

    // Resolve logos for static brand rows
    const brandTracks = document.querySelectorAll('.brands-track');
    brandTracks.forEach((track) => {
        Array.from(track.querySelectorAll('img[data-domain]')).forEach((img) => {
            const domain = img.getAttribute('data-domain');
            img.src = `https://logo.clearbit.com/${domain}`;
            img.referrerPolicy = 'no-referrer';
        });
    });

	    // Resolve logos for the hero-adjacent marquee
	    const stripTrack = document.querySelector('.brands-strip-track');
	    if (stripTrack) {
	        Array.from(stripTrack.querySelectorAll('img[data-domain]')).forEach((img) => {
	            const domain = img.getAttribute('data-domain');
	            img.src = `https://logo.clearbit.com/${domain}`;
	            img.referrerPolicy = 'no-referrer';
	        });
	        const clones = Array.from(stripTrack.children).map((n) => n.cloneNode(true));
	        clones.forEach((c) => stripTrack.appendChild(c));
	        
	        // Re-run logo swapper to ensure clones use correct light/dark variant
	        const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
	        (function reapplyBrands(theme) {
	            const imgs = stripTrack.querySelectorAll("img");
	            imgs.forEach((img) => {
	                // If base not cached yet, cache it
	                if (!img.dataset.srcBase) {
	                    const current = img.getAttribute("src");
	                    img.dataset.srcBase = current;
	                    const dot = current.lastIndexOf(".");
	                    if (dot !== -1) {
	                        img.dataset.srcLight = `${current.slice(0, dot)}_light${current.slice(dot)}`;
	                    }
	                }
	                const base = img.dataset.srcBase;
	                const light = img.dataset.srcLight;
	                const allowLight = light && img.dataset.hasLight !== "false";
	                const useLight = theme === "light" && allowLight;
	                const target = useLight ? light : base;
	                if (useLight) {
	                    img.onerror = () => {
	                        img.onerror = null;
	                        img.dataset.hasLight = "false";
	                        img.src = base;
	                    };
	                } else {
	                    img.onerror = null;
	                }
	                if (target && img.getAttribute("src") !== target) {
	                    img.setAttribute("src", target);
	                }
	            });
	        })(currentTheme);
	    }
	})();

// Card tilt interaction - SIMPLIFIED
(() => {
	const cards = $$(".work-card");
	cards.forEach((card) => {
		let bounds = card.getBoundingClientRect();
		const onMove = (e) => {
			const x = (e.clientX - bounds.left) / bounds.width - 0.5;
			const y = (e.clientY - bounds.top) / bounds.height - 0.5;
			card.style.transform = `rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
		};
		const onEnter = () => { 
			bounds = card.getBoundingClientRect();
			card.style.transition = "transform .2s ease"; 
		};
		const onLeave = () => { 
			card.style.transition = "transform .6s cubic-bezier(.2,.8,.2,1)"; 
			card.style.transform = "rotateY(0) rotateX(0)"; 
		};
		card.addEventListener("mouseenter", onEnter);
		card.addEventListener("mousemove", onMove);
		card.addEventListener("mouseleave", onLeave);
	});
})();

// Noise effect removed for better performance

// Contact actions: copy email and dynamic mailto
(() => {
	const copyBtn = $("#copyEmail");
	const mailLink = $("#mailTo");
	const email = "info.dronx@gmail.com";
	if (copyBtn) {
		copyBtn.addEventListener("click", async () => {
			try {
				await navigator.clipboard.writeText(email);
				copyBtn.textContent = "Copied";
				copyBtn.classList.add("copied");
				setTimeout(() => { copyBtn.textContent = "Copy email"; copyBtn.classList.remove("copied"); }, 1500);
			} catch (e) {
				alert("Email: " + email);
			}
		});
	}
	if (mailLink) {
		mailLink.addEventListener("click", (e) => {
			e.preventDefault();
			const name = $("#name")?.value?.trim() || "";
			const from = $("#email")?.value?.trim() || "";
			const message = $("#message")?.value?.trim() || "";
			const subject = encodeURIComponent(`Project Inquiry${name ? ` from ${name}` : ""}`);
			const body = encodeURIComponent(`Hi,\n\n${message}\n\n— ${name}${from ? ` (${from})` : ""}`);
			
			// For GitHub Pages, let's try a different approach
			// First, try to copy the email with form data to clipboard
			const emailText = `To: ${email}\nSubject: ${decodeURIComponent(subject)}\n\n${decodeURIComponent(body)}`;
			
			navigator.clipboard.writeText(emailText).then(() => {
				// Show success message with instructions
				alert(`Email content copied to clipboard!\n\nPlease paste it into your email client and send to: ${email}\n\nOr click OK to try opening your email client directly.`);
				
				// Also try the mailto link as backup
				setTimeout(() => {
					window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
				}, 100);
			}).catch(() => {
				// If clipboard fails, show the email and try mailto
				alert(`Email: ${email}\n\nSubject: ${decodeURIComponent(subject)}\n\nMessage: ${decodeURIComponent(body)}\n\nClick OK to try opening your email client.`);
				window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
			});
		});
	}
})();

// Footer copy email
(() => {
    const copyFooter = $("#copyEmailFooter");
    const email = "info.dronx@gmail.com";
    if (!copyFooter) return;
    copyFooter.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(email);
            copyFooter.textContent = "Copied";
            setTimeout(() => { copyFooter.textContent = "Copy email"; }, 1400);
        } catch (e) {
            alert("Email: " + email);
        }
    });
})();

// Image fallback if missing
(() => {
	const fallbackSvg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='700'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='#8a5cff'/><stop offset='100%' stop-color='#22d3ee'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)' opacity='0.35'/><rect width='100%' height='100%' fill='#1a1a22'/></svg>`);
	$$('.project-media img').forEach((img) => {
		img.addEventListener('error', () => {
			img.src = `data:image/svg+xml;charset=utf-8,${fallbackSvg}`;
			img.style.background = 'linear-gradient(135deg, rgba(138,92,255,0.2), rgba(34,211,238,0.2))';
			img.style.minHeight = '300px';
		});
	});
})();

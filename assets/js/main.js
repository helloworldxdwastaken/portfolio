/* ==========================
   VEROX STUDIO - Interactions
   Light theme default
   ========================== */

// Theme Detection & Toggle (Light Default)
(() => {
	const THEME_KEY = "verox-theme";
	
	// Get preferred theme - defaults to LIGHT
	const getPreferredTheme = () => {
		// Check localStorage first
		const saved = localStorage.getItem(THEME_KEY);
		if (saved) return saved;
		
		// Default to light theme (no system preference check for default)
		return "light";
	};
	
	// Apply theme
	const applyTheme = (theme) => {
		document.documentElement.setAttribute("data-theme", theme);
		document.documentElement.style.colorScheme = theme;
		localStorage.setItem(THEME_KEY, theme);
		
		// Update meta theme-color
		const themeColor = document.getElementById("theme-color");
		if (themeColor) {
			themeColor.content = theme === "light" ? "#ffffff" : "#000000";
		}
	};
	
	// Initialize theme on page load
	const preferredTheme = getPreferredTheme();
	applyTheme(preferredTheme);
	
	// Theme toggle handler
	const handleThemeToggle = () => {
		const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
		const newTheme = currentTheme === "light" ? "dark" : "light";
		applyTheme(newTheme);
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

// Set year
(() => {
	const yearEl = $("#year");
	if (yearEl) yearEl.textContent = String(new Date().getFullYear());
	const yearFooter = $("#year-footer");
	if (yearFooter) yearFooter.textContent = String(new Date().getFullYear());
})();

// Mobile nav toggle and navbar scroll
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
		
		// Close when clicking outside
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
		
		// Navbar background on scroll
		if (header) {
			window.addEventListener("scroll", () => {
				if (window.pageYOffset > 50) {
					header.classList.add("scrolled");
				} else {
					header.classList.remove("scrolled");
				}
			}, { passive: true });
		}

		// Work page filtering
		const filterButtons = document.querySelectorAll('.filter-btn');
		const projectCards = document.querySelectorAll('.project-card');

		if (filterButtons.length > 0 && projectCards.length > 0) {
			filterButtons.forEach(button => {
				button.addEventListener('click', () => {
					filterButtons.forEach(btn => btn.classList.remove('active'));
					button.classList.add('active');

					const filterValue = button.getAttribute('data-filter');

					projectCards.forEach(card => {
						const categories = card.getAttribute('data-categories');
						
						if (filterValue === 'all' || categories.includes(filterValue)) {
							card.classList.remove('hidden');
						} else {
							card.classList.add('hidden');
						}
					});
				});
			});
		}
	};
	
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
		'Digital Experiences',
		'Brand Identities',
		'Web Applications',
		'Mobile Interfaces',
		'Motion Graphics',
		'Design Systems'
	];
	
	el.textContent = roles[0];
	
	// Measure longest role for consistent width
	const longest = roles.reduce((a, b) => a.length >= b.length ? a : b, '');
	const meas = document.createElement('span');
	meas.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:inherit';
	meas.style.fontSize = getComputedStyle(el).fontSize;
	meas.style.fontWeight = getComputedStyle(el).fontWeight;
	meas.style.fontFamily = getComputedStyle(el).fontFamily;
	meas.textContent = longest;
	document.body.appendChild(meas);
	el.style.display = 'inline-block';
	el.style.minWidth = `${Math.ceil(meas.getBoundingClientRect().width) + 10}px`;
	document.body.removeChild(meas);
	
	let i = 0;
	const rotate = () => {
		// Exit animation
		el.classList.add('exiting');
		
		setTimeout(() => {
			i = (i + 1) % roles.length;
			el.textContent = roles[i];
			el.classList.remove('exiting');
			
			// Trigger enter animation
			el.style.animation = 'none';
			el.offsetHeight;
			el.style.animation = '';
		}, 400);
	};
	
	if (roles.length > 1) {
		setInterval(rotate, 3000);
	}
})();

// Scrollspy for nav active state
(() => {
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
					
					for (const { a, el } of targets) {
						if (el.offsetTop <= y) {
							if (!current || el.offsetTop > current.el.offsetTop) {
								current = { a, el };
							}
						}
					}
					
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
	
	if (document.querySelector('.nav-menu')) {
		initScrollSpy();
	} else {
		window.addEventListener('componentsLoaded', initScrollSpy);
	}
})();

// Smooth scrolling via Lenis
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
		easing: (t) => 1 - Math.pow(1 - t, 3), // Smooth cubic ease-out
	});
	
	function raf(time) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}
	requestAnimationFrame(raf);
})();

// GSAP Animations - Elements visible by default, animations as enhancement
(() => {
	const isMobile = window.innerWidth <= 768;
	
	if (isMobile || !window.gsap) return;
	
	gsap.registerPlugin(ScrollTrigger);
	
	ScrollTrigger.config({ 
		autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
		limitCallbacks: true
	});
	
	// Set all animated elements visible first (failsafe)
	gsap.set(".site-header, .hero-eyebrow, .hero h1, .hero p, .hero-cta, .hero-brands, .section-head, .project-row, .service-card, .testi-card", {
		opacity: 1,
		visibility: "visible"
	});
	
	// Hero intro - subtle entrance animations
	gsap.fromTo(".site-header", 
		{ y: -15 }, 
		{ y: 0, duration: 0.5, ease: "power2.out" }
	);
	gsap.fromTo(".hero-eyebrow", 
		{ y: 15, opacity: 0.3 }, 
		{ y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.1 }
	);
	gsap.fromTo(".hero h1", 
		{ y: 20, opacity: 0.3 }, 
		{ y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.15 }
	);
	gsap.fromTo(".hero p", 
		{ y: 15, opacity: 0.3 }, 
		{ y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.25 }
	);
	gsap.fromTo(".hero-cta", 
		{ y: 15, opacity: 0.3 }, 
		{ y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.3 }
	);
	gsap.fromTo(".hero-brands", 
		{ y: 15, opacity: 0.3 }, 
		{ y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.35 }
	);

	// Section reveals - use fromTo for safer animations
	$$(".section").forEach((section) => {
		const head = section.querySelector(".section-head");
		if (head) {
			gsap.fromTo(head, 
				{ y: 20, opacity: 0.5 },
				{
					y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
					scrollTrigger: { 
						trigger: section, 
						start: "top 85%",
						once: true
					}
				}
			);
		}
		
		const cards = section.querySelectorAll(".project-row, .service-card");
		if (cards.length) {
			gsap.fromTo(cards, 
				{ y: 25, opacity: 0.5 },
				{
					y: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.1,
					scrollTrigger: { 
						trigger: section, 
						start: "top 80%",
						once: true
					}
				}
			);
		}
	});

	// Testimonials carousel
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

			const cardRect = cards[0].getBoundingClientRect();
			const cardWidth = cardRect.width || 400;
			const gap = window.innerWidth <= 640 ? 16 : 24;
			const viewportWidth = viewport.offsetWidth;
			const viewportCenterX = viewportWidth / 2;
			
			const currentCardCenterX = (currentIndex * (cardWidth + gap)) + (cardWidth / 2);
			const translateX = viewportCenterX - currentCardCenterX;

			carousel.style.transform = `translateX(${translateX}px)`;

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
			autoScrollTimer = setInterval(nextSlide, 4000);
		};
		
		const stopAutoScroll = () => {
			clearInterval(autoScrollTimer);
		};
		
		setTimeout(updateCarousel, 100);
		setTimeout(startAutoScroll, 2000);
		
		viewport.addEventListener('mouseenter', stopAutoScroll);
		viewport.addEventListener('mouseleave', startAutoScroll);
		
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(updateCarousel, 200);
		});
	}

	// Clone brand logos for infinite scroll
	const stripTrack = document.querySelector('.brands-strip-track');
	if (stripTrack) {
		const clones = Array.from(stripTrack.children).map((n) => n.cloneNode(true));
		clones.forEach((c) => stripTrack.appendChild(c));
	}
})();

// Contact actions
(() => {
	const copyBtn = $("#copyEmail");
	const mailLink = $("#mailTo");
	const email = "info.dronx@gmail.com";
	
	if (copyBtn) {
		copyBtn.addEventListener("click", async () => {
			try {
				await navigator.clipboard.writeText(email);
				copyBtn.textContent = "Copied!";
				setTimeout(() => { copyBtn.textContent = "Copy Email"; }, 1500);
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
			
			window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
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
			copyFooter.textContent = "Copied!";
			setTimeout(() => { copyFooter.textContent = "Copy Email"; }, 1400);
		} catch (e) {
			alert("Email: " + email);
		}
	});
})();

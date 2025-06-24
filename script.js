document.addEventListener('DOMContentLoaded', () => {
    const sectionLinks = document.querySelectorAll('.section');
    // const siteHeader = document.querySelector('.site-header'); // No longer needed to hide/show
    const mainContainer = document.querySelector('.container');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const animatedIconLoader = document.getElementById('animatedIconLoader');
    const backButtons = document.querySelectorAll('.back-button');
    
    const contactOverlayModal = document.getElementById('contact-overlay-modal');
    const pageContactButtons = document.querySelectorAll('.page-contact-button');
    const closeContactOverlayButton = document.querySelector('.close-contact-overlay');

    // Sound Synthesizers
    let hoverSynth, clickSynth, sectionClickSynth; 
    let audioStarted = false;

    function initAudio() {
        if (audioStarted) return;
        // Tone.start() is essential for starting the audio context in browsers.
        Tone.start().then(() => {
            console.log("Audio context started successfully.");

            hoverSynth = new Tone.Synth({
                oscillator: { type: 'sine' },
                envelope: { attack: 0.005, decay: 0.05, sustain: 0.01, release: 0.1 },
                volume: -22 
            }).toDestination();
            
            clickSynth = new Tone.MembraneSynth({ 
                pitchDecay: 0.008,
                octaves: 2.5,
                oscillator: { type: "sine" },
                envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.01 },
                volume: -18
            }).toDestination();

            sectionClickSynth = new Tone.PluckSynth({
                attackNoise: 0.5,
                dampening: 4000,
                resonance: 0.8,
                release: 0.8,
                volume: -10
            }).toDestination();

            audioStarted = true;
            console.log("Synths initialized.");
        }).catch(e => {
            console.error("Error starting Tone.js audio context:", e);
        });
    }

    const phase1AnimDuration = 500; 
    const phase2AnimDuration = 700; 
    const bgTransitionDuration = 600; 
    const revealPageDelay = Math.max(phase2AnimDuration, bgTransitionDuration) + 50; 

    function playHoverSound(note = 'C5') {
        if (audioStarted && hoverSynth) {
            try {
                hoverSynth.triggerAttackRelease(note, '32n', Tone.now());
            } catch (e) {
                console.error("Error playing hover sound:", e);
            }
        }
    }
    function playClickSound(note = 'C3') {
        if (audioStarted && clickSynth) {
            try {
                clickSynth.triggerAttackRelease(note, '8n', Tone.now());
            } catch(e) {
                console.error("Error playing click sound:", e);
            }
        }
    }

    sectionLinks.forEach(link => {
        link.addEventListener('mouseenter', () => playHoverSound('E5'));

        link.addEventListener('click', function(event) {
            event.preventDefault();
            if (!audioStarted) {
                initAudio(); // Initialize audio on first significant user interaction
                 // Give Tone.start() a moment if it's the very first click
                setTimeout(() => {
                    if (audioStarted && sectionClickSynth) {
                        sectionClickSynth.triggerAttackRelease('G3', Tone.now());
                    }
                }, 100);
            } else {
                if (sectionClickSynth) {
                    sectionClickSynth.triggerAttackRelease('G3', Tone.now());
                }
            }


            const iconName = this.dataset.icon;
            const targetPageId = this.dataset.targetPage;
            const targetPage = document.getElementById(targetPageId);
            const colorClass = this.dataset.colorClass;

            if (!targetPage) {
                console.error('Target page not found:', targetPageId);
                return;
            }

            mainContainer.style.opacity = '0';
            setTimeout(() => {
                mainContainer.classList.add('hidden');
            }, 300);

            animatedIconLoader.textContent = iconName;
            animatedIconLoader.className = 'material-symbols-outlined animated-icon anim-phase-1'; 
            loadingOverlay.className = 'loading-overlay'; 
            loadingOverlay.style.display = 'flex';
            
            void animatedIconLoader.offsetWidth;

            setTimeout(() => {
                animatedIconLoader.classList.remove('anim-phase-1');
                animatedIconLoader.classList.add('anim-phase-2'); 
                if (colorClass) {
                    loadingOverlay.classList.add(colorClass); 
                }
            }, phase1AnimDuration);

            setTimeout(() => {
                loadingOverlay.style.display = 'none'; 
                animatedIconLoader.className = 'material-symbols-outlined animated-icon'; 
                loadingOverlay.className = 'loading-overlay'; 

                targetPage.classList.add('visible'); 
                targetPage.scrollTop = 0; 
            }, phase1AnimDuration + revealPageDelay); 
        });
    });

    backButtons.forEach(button => {
        button.addEventListener('mouseenter', () => playHoverSound('C4'));
        button.addEventListener('click', function() {
            playClickSound("C3");
            const currentDetailPage = this.closest('.detail-page');
            if (currentDetailPage) {
                currentDetailPage.classList.remove('visible');
                setTimeout(() => {
                    currentDetailPage.style.display = 'none';
                }, 400); 
            }
            mainContainer.classList.remove('hidden');
            setTimeout(() => {
                mainContainer.style.opacity = '1';
            }, 50); 
        });
    });

    pageContactButtons.forEach(button => {
        button.addEventListener('mouseenter', () => playHoverSound('E4'));
        button.addEventListener('click', () => {
            if (!audioStarted) initAudio();
            playClickSound("E4");
            contactOverlayModal.classList.add('visible');
        });
    });

    if(closeContactOverlayButton) {
        closeContactOverlayButton.addEventListener('mouseenter', () => playHoverSound('A3'));
        closeContactOverlayButton.addEventListener('click', () => {
            playClickSound("A2");
            contactOverlayModal.classList.remove('visible');
        });
    }
    contactOverlayModal.addEventListener('click', function(event) {
        if (event.target === this) { 
            playClickSound("A2");
            contactOverlayModal.classList.remove('visible');
        }
    });

    document.querySelectorAll('.project-card, .tools-list li, .contact-links a').forEach(el => {
        el.addEventListener('mouseenter', () => playHoverSound('G4'));
    });
    document.querySelectorAll('.project-card, .contact-links a').forEach(el => {
         el.addEventListener('click', () => playClickSound('G3')); 
    });
    document.querySelectorAll('.tools-list li').forEach(el => {
         el.addEventListener('click', () => playClickSound('D3')); 
    });
});

/* 
   ANA & ANDERSON WEDDING WEBSITE
   Modern Interactivity
*/

document.addEventListener('DOMContentLoaded', () => {

    // 0. INVITATION OVERLAY LOGIC
    const invitationOverlay = document.getElementById('invitation-overlay');
    const openBtn = document.getElementById('open-invitation');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            // Stage 1: Unwrap ribbon & break seal
            invitationOverlay.classList.add('unwrapping');
            
            setTimeout(() => {
                // Stage 2: Open the box (slide up)
                invitationOverlay.classList.add('opened');
                
                setTimeout(() => {
                    document.body.classList.remove('loading');
                    // Re-trigger scroll reveal for hero
                    document.querySelector('.hero').classList.add('active');
                    startPetalAnimation();
                }, 1000);
            }, 1200);
        });
    }

    // PETAL ANIMATION GENERATOR
    function startPetalAnimation() {
        const container = document.getElementById('petals-container');
        const petalCount = 25;

        for (let i = 0; i < petalCount; i++) {
            createPetal(container);
        }
    }

    function createPetal(container) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        // Randomize petal properties
        const size = Math.random() * 15 + 10;
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = Math.random() * 5 + 7 + 's';
        petal.style.animationDelay = Math.random() * 5 + 's';
        petal.style.opacity = Math.random() * 0.5 + 0.3;

        container.appendChild(petal);

        // Remove and recreate petal after animation finishes to keep it infinite
        petal.addEventListener('animationiteration', () => {
            petal.style.left = Math.random() * 100 + 'vw';
        });
    }

    // 1. SCROLL REVEAL ANIMATION
    const revealElements = document.querySelectorAll('.reveal');
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 2. STICKY NAVBAR & FLOATING BUTTON
    const navbar = document.querySelector('.navbar');
    const floatBtn = document.querySelector('.btn-floating');

    window.addEventListener('scroll', () => {
        // Navbar
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Floating RSVP Button Visibility (only show after hero)
        if (window.scrollY > window.innerHeight * 0.8) {
            floatBtn.classList.add('visible');
        } else {
            floatBtn.classList.remove('visible');
        }
    });

    // 3. COUNTDOWN TIMER
    // Target Date: 2026-10-10 16:00:00
    const targetDate = new Date('October 10, 2026 16:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;

        if (difference < 0) {
            clearInterval(timerInterval);
            document.querySelector('.countdown').innerHTML = "O grande dia chegou!";
        }
    };

    const timerInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    // 4. RSVP FORM SUBMISSION (SIMULATED)
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = "Enviando...";
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = "Confirmado! Obrigado.";
                btn.style.backgroundColor = "#5d704d"; // Darker green
                rsvpForm.reset();
            }, 1500);
        });
    }

    // 5. MESSAGE FORM SUBMISSION (SIMULATED)
    const messageForm = document.getElementById('message-form');
    const messageList = document.getElementById('message-list');

    if (messageForm) {
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('msg-name').value;
            const message = document.getElementById('msg-text').value;

            // Create new message card
            const messageCard = document.createElement('div');
            messageCard.className = 'gift-card reveal active';
            messageCard.style.color = 'var(--clr-text-main)';
            messageCard.style.background = 'var(--clr-bg-alt)';
            messageCard.style.textAlign = 'left';
            messageCard.style.padding = '20px';
            messageCard.innerHTML = `
                <h4 style="font-family: var(--font-ui); font-weight: 700; margin-bottom: 5px;">${name}</h4>
                <p style="font-size: 0.95rem;">"${message}"</p>
            `;

            messageList.prepend(messageCard);
            messageForm.reset();

            // Success feedback
            const toast = document.createElement('div');
            toast.innerText = "Recado enviado com carinho!";
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.background = 'var(--clr-accent)';
            toast.style.color = 'white';
            toast.style.padding = '10px 20px';
            toast.style.borderRadius = '20px';
            toast.style.zIndex = '10000';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        });
    }
});

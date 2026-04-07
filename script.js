/*
   ANA & ANDERSON WEDDING WEBSITE
   Modern Interactivity
*/

// Carrossel auto-advance "Nossa História"
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.casal-images');
    if (!carousel) return;
    const imgs = carousel.querySelectorAll('img');
    if (imgs.length < 2) return;
    let idx = 0;
    let paused = false;
    const go = (i) => {
        idx = (i + imgs.length) % imgs.length;
        carousel.scrollTo({ left: imgs[idx].offsetLeft, behavior: 'smooth' });
    };
    const wrapper = carousel.parentElement;
    const prevBtn = wrapper.querySelector('.carousel-btn.prev');
    const nextBtn = wrapper.querySelector('.carousel-btn.next');
    if (prevBtn) prevBtn.addEventListener('click', () => go(idx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(idx + 1));
    wrapper.addEventListener('mouseenter', () => paused = true);
    wrapper.addEventListener('mouseleave', () => paused = false);
    setInterval(() => { if (!paused) go(idx + 1); }, 4000);
});

document.addEventListener('DOMContentLoaded', () => {

    // 0. INVITATION OVERLAY LOGIC
    const invitationOverlay = document.getElementById('invitation-overlay');
    const openBtn = document.getElementById('open-invitation');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            // Garante que o fundo da página (body) esteja no topo antes de revelar
            window.scrollTo(0, 0);
            
            // Stage 1: Unwrap ribbon & break seal
            invitationOverlay.classList.add('unwrapping');
            
            setTimeout(() => {
                // Stage 2: Open the box (slide up)
                invitationOverlay.classList.add('opened');
                
                setTimeout(() => {
                    document.body.classList.remove('loading');
                    const hero = document.querySelector('.hero');
                    if(hero) hero.classList.add('active');
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

    // 4. RSVP FORM SUBMISSION (LOCAL STORAGE)
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const attendanceInput = e.target.querySelector('input[name="attendance"]:checked');
            
            if (!attendanceInput) {
                alert("Por favor, selecione se irá ou não ao evento.");
                return;
            }
            
            const attendance = attendanceInput.value;

            // Create submission object
            const submission = {
                name,
                phone,
                attendance,
                date: new Date().toLocaleString()
            };

            const btn = e.target.querySelector('button');
            btn.innerText = "Enviando...";
            btn.disabled = true;

            const finish = () => {
                btn.innerText = "Confirmado! Obrigado.";
                btn.style.backgroundColor = "var(--clr-accent)";
                rsvpForm.reset();
                const toast = document.createElement('div');
                toast.innerText = "Presença confirmada com sucesso!";
                toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--clr-accent);color:#fff;padding:10px 20px;border-radius:20px;z-index:10000;';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
            };

            const fail = (err) => {
                console.error('RSVP error:', err);
                btn.innerText = "Erro ao enviar. Tente novamente.";
                btn.disabled = false;
                btn.style.backgroundColor = '#c0392b';
            };

            if (!window.db) {
                fail(new Error('Firebase não carregado'));
                return;
            }

            db.collection('rsvps').add({
                name,
                phone,
                attendance,
                date: new Date().toLocaleString('pt-BR'),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).then(finish).catch(fail);
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

    // 6. MODAL LISTA DE PRESENTES
    const modalLista = document.getElementById('modal-lista');
    const btnVerLista = document.getElementById('btn-ver-lista');
    const closeModal = document.querySelector('.close-modal');

    if (btnVerLista && modalLista) {
        btnVerLista.addEventListener('click', (e) => {
            e.preventDefault();
            modalLista.classList.add('show');
            document.body.style.overflow = 'hidden'; // impede scroll atrás do modal
        });

        closeModal.addEventListener('click', () => {
            modalLista.classList.remove('show');
            document.body.style.overflow = 'auto'; // restaura scroll
        });

        // Fechar ao clicar fora
        modalLista.addEventListener('click', (e) => {
            if (e.target === modalLista) {
                modalLista.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

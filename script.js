document.addEventListener("DOMContentLoaded", () => {
    
    // =====================================================
    // 1. SISTEMA DE AUDIO (SFX)
    // =====================================================
    const ringSound = document.getElementById('ringSound');
    
    // Função para tocar o som de anel (com volume ajustado)
    const playRingSound = () => {
        if (ringSound) {
            ringSound.currentTime = 0; // Reinicia o som se já estiver tocando
            ringSound.volume = 0.2;    // Volume agradável (não estoura o ouvido)
            ringSound.play().catch(e => console.log("Áudio aguardando interação do usuário"));
        }
    };

    // Adiciona som suave ao passar o mouse nos botões e links
    const hoverElements = document.querySelectorAll('.ring-hover');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            // Opcional: Se quiser som no hover, descomente a linha abaixo
            // playRingSound(); 
        });
    });

    // =====================================================
    // 2. SISTEMA DE DOPAMINA (COLETA DE ANÉIS & HUD)
    // =====================================================
    let ringCount = 0;
    const ringCounterDisplay = document.getElementById('ring-count');
    const collectibleRings = document.querySelectorAll('.collectible-ring');

    collectibleRings.forEach(ring => {
        ring.addEventListener('click', function() {
            // Se já foi coletado, ignora
            if (this.classList.contains('collected')) return;

            // 1. Toca o som
            playRingSound();

            // 2. Animação visual do anel (some subindo)
            this.classList.add('collected');

            // 3. Atualiza o Placar (HUD)
            ringCount++;
            ringCounterDisplay.innerText = ringCount;

            // 4. Efeito de "Pulso" no texto do placar (Dopamina Visual)
            ringCounterDisplay.style.color = "#ffff00"; // Amarelo Sonic
            ringCounterDisplay.style.transform = "scale(1.5)";
            
            // Retorna o placar ao normal após 200ms
            setTimeout(() => {
                ringCounterDisplay.style.color = "white";
                ringCounterDisplay.style.transform = "scale(1)";
            }, 200);

            // Log para debug
            console.log(`Anéis coletados: ${ringCount}`);
        });
    });

    // =====================================================
    // 3. OBSERVER DE ANIMAÇÃO (SCROLL REVEAL)
    // =====================================================
    // Configuração: A animação dispara quando 10% do elemento aparece na tela
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" 
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe .visible que contem o CSS 'opacity: 1' e 'transform: none'
                entry.target.classList.add('visible');
                // Para de observar o elemento (anima só uma vez)
                observer.unobserve(entry.target);
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Seleciona todos os elementos que devem animar
    const animatedElements = document.querySelectorAll(
        '.animate-pop-in, .animate-slide-left, .animate-up, .animate-zoom, .animate-bounce, .animate-slide-down'
    );
    
    animatedElements.forEach(el => scrollObserver.observe(el));

    // =====================================================
    // 4. MODAL DE VÍDEO (YOUTUBE POP-UP)
    // =====================================================
    const modalOverlay = document.getElementById('videoModalOverlay');
    const iframe = document.getElementById('youtubeIframe');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const videoTriggers = document.querySelectorAll('.video-trigger');

    // Função para abrir o modal
    const openModal = (videoId) => {
        // Monta a URL do YouTube com Autoplay
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        iframe.src = embedUrl;
        modalOverlay.classList.add('active');
    };

    // Função para fechar o modal
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        // Limpa o src do iframe para parar o som do vídeo imediatamente
        setTimeout(() => {
            iframe.src = "";
        }, 300); // Aguarda a animação de fade-out
    };

    // Adiciona cliques nos cards de vídeo
    videoTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            if (videoId) {
                openModal(videoId);
            }
        });
    });

    // Botão Fechar
    closeModalBtn.addEventListener('click', closeModal);

    // Fechar clicando no fundo escuro
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Fechar apertando a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

});
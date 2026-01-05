document.addEventListener("DOMContentLoaded", () => {
    
    // =====================================================
    // 1. SISTEMA DE AUDIO (SFX)
    // =====================================================
    const ringSound = document.getElementById('ringSound');
    
    // Função segura para tocar som (evita erros de bloqueio do navegador)
    const playRingSound = () => {
        if (ringSound) {
            ringSound.currentTime = 0; // Reinicia o áudio se já estiver tocando
            ringSound.volume = 0.3;    // Volume agradável (30%)
            // Tenta tocar
            ringSound.play().catch(error => {
                console.log("Autoplay de áudio bloqueado até interação do usuário.");
            });
        }
    };

    // Adiciona som suave ao passar o mouse nos botões principais (PC apenas)
    if (window.matchMedia("(min-width: 992px)").matches) {
        const hoverElements = document.querySelectorAll('.ring-hover');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                // Se quiser som no hover, descomente a linha abaixo:
                // playRingSound(); 
            });
        });
    }

    // =====================================================
    // 2. SISTEMA DE DOPAMINA (COLETA DE ANÉIS & HUD)
    // =====================================================
    let ringCount = 0;
    const ringCounterDisplay = document.getElementById('ring-count');
    const collectibleRings = document.querySelectorAll('.collectible-ring');

    collectibleRings.forEach(ring => {
        ring.addEventListener('click', function(e) {
            // Evita clique duplo ou propagação indesejada
            e.stopPropagation(); 

            // Se já foi coletado, ignora
            if (this.classList.contains('collected')) return;

            // 1. Toca o som clássico
            playRingSound();

            // 2. Animação visual do anel (some subindo e desaparece)
            this.classList.add('collected');

            // 3. Atualiza o Placar (HUD)
            ringCount++;
            if (ringCounterDisplay) {
                ringCounterDisplay.innerText = ringCount;

                // 4. Efeito de "Pulso" no texto do placar (Feedback Visual)
                ringCounterDisplay.style.color = "#ffff00"; // Amarelo Sonic
                ringCounterDisplay.style.transform = "scale(1.5)"; // Aumenta
                ringCounterDisplay.style.transition = "transform 0.2s, color 0.2s";
                
                // Retorna o placar ao normal após 200ms
                setTimeout(() => {
                    ringCounterDisplay.style.color = "white";
                    ringCounterDisplay.style.transform = "scale(1)";
                }, 200);
            }
        });
    });

    // =====================================================
    // 3. OBSERVER DE ANIMAÇÃO (SCROLL REVEAL)
    // =====================================================
    // Configura quando a animação deve disparar (10% do elemento visível)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" 
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe .visible que ativa o CSS (opacity: 1, transform: none)
                entry.target.classList.add('visible');
                // Para de observar o elemento (anima apenas uma vez)
                observer.unobserve(entry.target);
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Seleciona todos os elementos que possuem classes de animação
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
        if (!iframe) return;
        // Monta a URL do YouTube com Autoplay ativado
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
        iframe.src = embedUrl;
        modalOverlay.classList.add('active');
    };

    // Função para fechar o modal
    const closeModal = () => {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        
        // Limpa o src do iframe para parar o som do vídeo imediatamente
        // (Pequeno delay para não cortar a animação de fechar visualmente)
        setTimeout(() => {
            if (iframe) iframe.src = "";
        }, 300); 
    };

    // Adiciona evento de clique nos cards de vídeo
    videoTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            if (videoId) {
                openModal(videoId);
            }
        });
    });

    // Botão Fechar (X)
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Fechar clicando no fundo escuro (fora do vídeo)
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Fechar apertando a tecla ESC (Acessibilidade)
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

});
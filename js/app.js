document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded triggered."); // Esto debería aparecer en la consola
    const main = document.querySelector('main');
    
    // Prevenir rebote en iOS y scroll tembloroso
    let lastScroll = 0;
    document.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        
        if (currentScroll > maxScroll - 50) {
            window.scrollTo({
                top: maxScroll,
                behavior: 'smooth'
            });
        }
        
        lastScroll = currentScroll;
    });

    // Desactivar el comportamiento de rebote en móviles
    document.body.style.overscrollBehavior = 'none';

    // Ajusta la cantidad de elementos animados según el tamaño de pantalla
    const isMobile = window.innerWidth <= 768;

    function createHeart() {
        // Reduce la cantidad de corazones en móviles
        if (isMobile && document.querySelectorAll('.heart').length > 5) return;

        const heart = document.createElement('img');
        heart.loading = 'lazy'; // Carga diferida para optimizar recursos
        heart.src = 'images/heart.png';
        heart.classList.add('heart');
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * (window.innerWidth - 30) + 'px'; // Ajusta para el ancho del corazón
        heart.style.top = window.innerHeight + 'px';
        main.appendChild(heart);
        
        animateHeart(heart);
    }

    function animateHeart(heart) {
        const fallDuration = Math.random() * 3 + 2; // Duración entre 2 y 5 segundos
        gsap.to(heart, {
            duration: fallDuration,
            top: '0px',
            ease: "power1.in",
            onComplete: () => {
                if (heart && heart.parentElement) {
                    heart.style.opacity = 0;
                    heart.parentElement.removeChild(heart);
                } else {
                    console.log('El elemento heart ya fue removido.');
                }
            }
        });
    }

    function createSunflower() {
        const sunflower = document.createElement('img');
        sunflower.loading = 'lazy'; // Carga diferida para optimizar recursos
        sunflower.src = 'images/girasol.png'; // Asegúrate de tener la imagen optimizada en la carpeta images
        sunflower.classList.add('sunflower');
        sunflower.style.position = 'absolute';

        const sunflowerSize = 50; // Tamaño definido para el girasol
        sunflower.style.width = sunflowerSize + 'px';

        const maxLeft = window.innerWidth - sunflowerSize;
        sunflower.style.left = Math.random() * maxLeft + 'px';
        
        // Posicionar el girasol justo debajo del final de la pantalla
        sunflower.style.top = window.innerHeight - sunflowerSize + 'px';
        sunflower.style.transform = 'rotate(0deg)';
        main.appendChild(sunflower);
        
        animateSunflower(sunflower);
    }

    function animateSunflower(sunflower) {
        const fallDuration = Math.random() * 5 + 5; // Duración entre 5 y 10 segundos
        gsap.to(sunflower, {
            duration: fallDuration,
            top: '0px',
            rotation: 360,
            ease: "none",
            onComplete: () => {
                if (sunflower) {
                    sunflower.style.opacity = 0;
                    sunflower.remove();
                }
            }
        });
    }

    function createBalloon() {
        const balloon = document.createElement('img');
        balloon.loading = 'lazy'; // Carga diferida
        balloon.src = 'images/balloon.png'; // Asegúrate de tener la imagen en la ruta indicada
        balloon.classList.add('balloon');
        balloon.style.position = 'absolute';
        // Ajusta el tamaño del globo
        balloon.style.width = '80px'; // Tamaño reducido para que no se vea desproporcionado
        balloon.style.height = 'auto';
        // Posición inicial: ligeramente fuera de la pantalla inferior
        balloon.style.left = Math.random() * (window.innerWidth - 80) + 'px';
        balloon.style.top = (window.innerHeight * 0.85) + 'px';
        main.appendChild(balloon);
        
        animateBalloon(balloon);
    }

    function animateBalloon(balloon) {
        // Duración entre 2 y 5 segundos
        const riseDuration = Math.random() * 3 + 2;
        gsap.to(balloon, {
            duration: riseDuration,
            // La animación sube hasta una posición visible pero sin ocupar toda la pantalla
            top: (window.innerHeight * 0.3) + 'px',
            ease: "power1.out",
            onComplete: () => {
                if (balloon) {
                    balloon.style.opacity = 0;
                    balloon.remove();
                }
            }
        });
    }
    
    // Ajusta los intervalos según el dispositivo
    const heartInterval = isMobile ? 2000 : 1000;
    const sunflowerInterval = isMobile ? 4000 : 3000;
    const balloonInterval = isMobile ? 5000 : 4000;

    setInterval(createHeart, heartInterval);       // Crear un corazón cada 500ms
    setInterval(createSunflower, sunflowerInterval);    // Crear un girasol cada 3000ms
    setInterval(createBalloon, balloonInterval);  // Crea un globo cada 4 segundos

    // Nueva implementación alternativa para el botón de celebración
    const btn = document.querySelector('.icon-btn');
    btn.addEventListener('click', () => {
        // Inicia la música de fondo solo cuando se abre el overlay
        const music = document.getElementById('bg-music');

        // Crear el overlay temático con colores Hello Kitty
        const overlay = document.createElement('div');
        overlay.className = 'birthday-overlay';
        overlay.innerHTML = `
            <div class="birthday-container">
                <button class="close-btn">&times;</button>
                <div class="cake-container">
                    <img src="images/cake.png" alt="Pastel" class="animated-cake" loading="lazy">
                </div>
                <div class="message-container">
                    <h1>¡Feliz Cumpleaños, mi cielo!</h1>
                    <p>Hoy celebro el regalo de tu existencia con un toque de ternura y magia.</p>
                </div>
            </div>
        `;

        // Añadir manejador para cerrar overlay y detener música
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.classList.contains('close-btn')) {
                music.pause();
                music.currentTime = 0;
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => overlay.remove()
                });
            }
        });

        document.body.appendChild(overlay);

        // Reproducir música al mostrar overlay
        if (music) {
            music.play().catch(err => console.log("Error al reproducir la música:", err));
        }

        // Animar overlay con GSAP
        const tl = gsap.timeline();
        tl.fromTo(overlay, { opacity: 0 }, { duration: 1, opacity: 1 })
          .fromTo('.animated-cake', { scale: 0, rotation: -45 }, { duration: 1, scale: 1, rotation: 0, ease: "elastic.out(1, 0.5)" }, "-=0.5")
          .fromTo('.message-container h1', { opacity: 0, y: 30 }, { duration: 0.8, opacity: 1, y: 0 }, "-=0.3")
          .fromTo('.message-container p', { opacity: 0 }, { duration: 0.8, opacity: 1 }, "-=0.5");
        
        // Lanzar confeti con una paleta acorde a la temática Hello Kitty
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { x: 0.5, y: 0.3 },
            colors: ['#FFC0CB', '#FFB6C1', '#FF69B4']
        });
        
        // Cerrar overlay al hacer click
        overlay.addEventListener('click', () => {
            gsap.to(overlay, { duration: 0.8, opacity: 0, onComplete: () => overlay.remove() });
        });
    });

    // Selecciona el botón de "Feliz Cumpleaños"
    const birthdayBtn = document.querySelector('.boton-feliz-cumple .icon-btn');

    birthdayBtn.addEventListener('click', () => {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFC0CB', '#FFB6C1', '#FF69B4']
      });
    });

    gsap.fromTo(".boton-feliz-cumple .icon-btn", 
      { scale: 1 }, 
      { scale: 1.1, duration: 1, yoyo: true, repeat: -1, ease: "power1.inOut" }
    );

    // Función para el efecto parallax en el fondo
    function parallaxBackground() {
        const background = document.querySelector('.background-test');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        // Mueve el fondo a la mitad de la velocidad del scroll
        background.style.transform = `translateY(${scrollTop * 0.02}px)`;
    }

    // Asocia el evento scroll para actualizar el parallax
    window.addEventListener('scroll', parallaxBackground);

    gsap.registerPlugin(ScrollTrigger);


    gsap.from(".mensaje p", {
        duration: 1,
        opacity: 0,
        y: 20,
        stagger: 0.5,
        ease: "power3.out"
    });

    // Efecto hover en las imágenes del timeline
    document.querySelectorAll('.timeline-item img').forEach(img => {
      img.addEventListener('mouseenter', () => {
        gsap.to(img, { scale: 1.05, duration: 0.3, ease: "power1.out" });
      });
      
      img.addEventListener('mouseleave', () => {
        gsap.to(img, { scale: 1, duration: 0.3, ease: "power1.out" });
      });
    });

    // Función para actualizar el contador
    function updateCounter() {
        console.log("Ejecutando updateCounter"); // Para verificar que se ejecuta
        
        const startDate = new Date("2021-09-23T23:23:23");  // Formato ISO, correcto
        const now = new Date();
        const diff = now - startDate;
    
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
    
        const counterText = `${days} días, ${hours} horas, ${minutes} minutos, ${seconds} segundos`;
        document.getElementById("counter").innerHTML = counterText;
        console.log("Counter updated:", counterText);
    }
    
    updateCounter(); // Llamada inicial
    setInterval(updateCounter, 1000); // Actualiza cada segundo

});

// Mostrar/Ocultar el botón "Volver arriba" según el scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        gsap.to(".back-to-top", { opacity: 1, duration: 0.5 });
    } else {
        gsap.to(".back-to-top", { opacity: 0, duration: 0.5 });
    }
});

// Al hacer clic, desplaza la ventana suavemente hasta el tope
document.querySelector('.back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Asegúrate de que el listener de scroll esté correctamente declarado
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


// Escucha el evento load
window.addEventListener('load', () => {
    // Oculta el preloader
    gsap.to("#preloader", { 
        duration: 1, 
        opacity: 0, 
        ease: "power1.out",
        onComplete: () => {
            document.getElementById("preloader").style.display = "none";
            // Una vez oculto el preloader, inicializa AOS
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: false  // Se puede ejecutar cada vez que el elemento entra en el viewport
            });
            setTimeout(() => AOS.refresh(), 1000); // Actualiza AOS después de 1 segundo
        }
    });
});

// Añade detección de orientación
window.addEventListener('orientationchange', () => {
    // Refresca AOS cuando cambia la orientación
    setTimeout(() => {
        AOS.refresh();
    }, 100);
});

// Al final del archivo

// Reinicia cualquier transformación y opacidad para header h1
gsap.set("header h1", { clearProps: "all" });
// O forzar valores:
gsap.set("header h1", { transform: "scale(1)", opacity: 1 });

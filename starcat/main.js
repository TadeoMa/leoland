// Crear estrellas adicionales dinámicamente
function createStars() {
    const container = document.querySelector('.stars-bg');
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: white;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        container.appendChild(star);
    }
}

// Efecto de partículas al hacer clic en el planeta
function addPlanetClickEffect() {
    const planet = document.querySelector('.planet');
    
    planet.addEventListener('click', function(e) {
        // Crear efecto de explosión de estrellas
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            const angle = (Math.PI * 2 * i) / 20;
            const velocity = Math.random() * 100 + 50;
            
            particle.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${['#ff69b4', '#ffd700', '#9b59b6', '#fff'][Math.floor(Math.random() * 4)]};
                border-radius: 50%;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                pointer-events: none;
                z-index: 1000;
                box-shadow: 0 0 10px currentColor;
            `;
            
            document.body.appendChild(particle);
            
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
            ], {
                duration: 800,
                easing: 'ease-out'
            }).onfinish = () => particle.remove();
        }
    });
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    addPlanetClickEffect();
});

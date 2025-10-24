// =================================================================
// 1. LÓGICA DE CONEXÃO DO STREAM DA CÂMERA
// =================================================================

// SUBSTITUA AQUI pela URL pública gerada pelo ngrok
// Exemplo: 'https://abcd123.ngrok.io'
const API_BASE_URL = 'http://SEU_IP_COMPUTADOR:5000'; // Substitua pelo endereço ngrok ou IP local do seu PC


function conectarCamera() {
    const imgElement = document.getElementById('camera-feed');
    // Define o src da imagem para o endpoint de stream do seu servidor Python
    imgElement.src = `${API_BASE_URL}/video_feed`;
}

// =================================================================
// 2. PARTICULAS NO FUNDO (CÓDIGO ORIGINAL)
// =================================================================

// O efeito hover foi removido, pois não há botões de sugestão.
// O código do canvas foi ajustado para usar o ID 'fundoParticulas' do HTML.

const canvas = document.getElementById('fundoParticulas');
// Adiciona uma verificação para garantir que o canvas existe
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor(){
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random()*4 +1;
            this.speedX = Math.random()*1 -0.5;
            this.speedY = Math.random()*1 -0.5;
        }
        update(){
            this.x += this.speedX;
            this.y += this.speedY;
            if(this.x>canvas.width) this.x=0;
            if(this.x<0) this.x=canvas.width;
            if(this.y>canvas.height) this.y=0;
            if(this.y<0) this.y=canvas.height;
        }
        draw(){
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
            ctx.fill();
        }
    }

    function init(){
        particlesArray = [];
        for(let i=0;i<100;i++){
            particlesArray.push(new Particle());
        }
    }
    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        particlesArray.forEach(p=>{p.update();p.draw();});
        requestAnimationFrame(animate);
    }

    // =================================================================
    // INICIALIZAÇÃO
    // =================================================================

    document.addEventListener('DOMContentLoaded', () => {
        conectarCamera(); // Conecta o stream ao carregar a página
        init();
        animate();
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });
}
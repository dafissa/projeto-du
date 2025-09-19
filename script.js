// script.js
// seleciona o elemento canvas e obtem o contexto 2d para desenhar


































// função que cria um novo obsráculo (carro inimigo)
function createObstacle() {
    const width = 40 + Math.random() * 30;
    const heigth = 60 + Math.random() * 30;
    const x = Math.random() * (gameWidth - width); 
    const speed = 2 + Math.random() * 2.5; // posilçao x aleatoria dentro do canvas
    const color = '#c62828'; // cor do obstaculo
    return { x, y: -heigth, width, heigth, speed, color }; // retorna objeto obstaculo 
}

// função que reinicia o estado do jogo
function resetGame() {
    obstacles = []; // limpa obstaculos
    obstacleSpawnTimer = 0; // reseta o temporizador
    leftPressed = false;
    rightPressed = false; //reseta controles
    isRunning = true; // marca jogo rodando
    score = 0; //zera pontuação
    frameCount = 0; //zero contador de frames
    player.x = (gameWidth / 2) - player.width / 2; // centraliza o jogadpor
    gameOverDiv.classList.add('hidden'); //esconde o overlay de game over
    requestAnimationFrame(gameLoop); //inicia o loop do jogo novamente
 }

 // função para destacar colisão entre dois retangulos (AABB)
 function isColliding(a, b) {
    // colisão se as areas se sobrepoem em ambos os eixos
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.heigth &&
    )
 }
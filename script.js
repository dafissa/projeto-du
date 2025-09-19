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
        a.y + a.heigth > b.y
    );
 }

 // função para atulizar lógica do jogo em cada frame
 function update() {
    if (isRunning) return; //se o jogo acabou não atualiza

    // movimenta jogador conforme teclas pressionafas
    if (leftPressed) {
        player.x -= player.speed; //move para esquerda
    }
    if (rightPressed) {
        player.x += player.speed; //mpve opara a direita
    }

    // mantém o jogador dentrop dos limites do canvas
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > gameWidth) player.x = gameWidth - player.width;

    // gera obstaculos periodicamente
    obstacleSpawnTimer++;
    if (obstacleSpawnTimer > obstacleSpawnInterval) {
        obstacles.push(createObstacle()); //add novo obstaculo
        obstacleSpawnTimer = 0; //reseta temporizador
        // redus ligeiramente o intervalo para aumnetar dificuldades com o tempo
        if (obstacleSpawnInterval > 45) obstacleSpawnInterval -= 1;
    } 

    //atualiza obstaculos posição e checa colisao
    for (let i = obstacle.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.y += obs.speed; // move obstaculo para baixo

        // se o obstaculo saiu da tela, remove e aumenta pontuaçao
        if (obs.y > gameHeight) {
            obstacles.splice(i, 1); //remove o obstaculo do array
            score += 10; //pontuação por desviar
            continue; //pule para o proximo obstaculo
        }

        // checa a colisão com o jogador
        if (isColliding(player, obs)) {
            //se colidiu, termina o jogo
            endGame();
            return; //sai da função update
        }
    }

    // pontuação baseada no tempo (frames)
    frameCount++;
    if (frameCount % 60 === 0) {
        // a cada + ou - 60 aprox 1 segundo, aumenta um ponto extra
        score += 1;
    }
 }

// função para desenhar o jogador no canvas
function drawPlayer() {
    ctx.fillStyle = player.color; //define cor do carro do jogador
    //desenha o retangulo que representa o carro
    ctx.fillRect(player.x, player.y, player.width, player.heigth);
    //desenha "janelas" do carro(detalhe simples)
    ctx.fillStyle = '#rgba(255, 255, 255, 0.25)';
    ctx.fillRect(player.x + 6, player.y + 12, player.width - 12, 18);
}

//função para desenhar obstaculos
function drawObstacles() {
    for (const obs of obstacles) {
        
    }
}
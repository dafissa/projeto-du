// script.js
// seleciona o elemento canvas e obtem o contexto 2d para desenhar
const canvas = document.getElementById('gameCanvas'); // canvas do jogo
const ctx = canvas.getContext('2d');

//elemento overlay do game over
const gameOverDiv = document.getElementById('gameOver');






















let leftPressed = false;
let rightPressed = false;
let isRunning = false;




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
        ctx.fillStyle = obs.color; // cor do obstaculo
        ctx.fillRect(obs.x, obs.y, obs.width, obs.length); //desenha o retangulo
        //pewqueno brilho para dar profunidade
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(obs.x)
    }
}

// função de desenhar a estrada (faixas) e score
function drawBackgroundAndUI() {
    //limpa o canvas inteiro com um tom (fundo já definido no cc do canvas)
    ctx.clearRect(0, 0, gameWidth, gameHeight);

    // desenha faixas laterais (bordas da estrada)
    ctx.fillStyle = '#3e3e3e';
    ctx.fillRect(30, 0, gameWidth - 60, gameHeight); //area da estrada

    //desenha linhas centrais pontilhadas da estrada
    ctx.strokeStyle = '#f5f5f5';
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 18]) //traço / espaço
    ctx.beginPath();
    ctx.moveTo(gameWidth / 2, 0);
    ctx.lineTo(gameWidth / 2, gameHeight);
    ctx.stroke();
    ctx.setLineDash([]); // reseta dash

    //desenha a borda esquerda a direita (faixa de acostamento)
    ctx.fillStyle = '#606060';
    ctx.fillRect(0, 0, 30, gameHeight); //acostamento esquerdo
    ctx.fillRect(gameWidth - 30, 0, 30, gameHeight); //acostamento direito

    //mostra pontuação no topo
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.fillText(`Pontuação: ${score}`, 12, 24);
}

// função que encerra o jogo (mostra game over)
function endGame() {
    isRunning = false; //para o loop de atualização
    //atualiza o texto do overlay com a pontuação
    scoreText.textContent = `Pontuação: ${score}`;
    gamerOverDiv.classList.remove('hidden'); //mostra o overlay de gamer over
}

//loop principal do jogo (atualiza e desenha)
function gameLoop() {
    update(); //atualiza a logica
    drawBackgroundAndUI() //DESENHA o cenario e ui
    drawPlayer(); //desenha o jogado0r
    drawObstacles(); //DESENHA OS obstaculos

    //se o jogo ainda esta rodando, pede o proximo frame
    if (isRunning) {
        requestAnimationFrame(gameLoop);
    }
}

//-- contrioles de teclado --
//quando a tecla é pressionada
window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'Left') {
        leftPressed = true; // seta esquerda pressionada
} else if (e.key === 'ArrowRigth' || e.key === 'Right') {
    rightPressed = true; //seta que a tecla direita está pressionada
}
});

//quando a tecla é solta
window.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'Left') {
        leftPressed = false; //libera movimento da esquerda
    } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        rightPressed = false; //libera movimento da direita
    }
});

//suporte a toque: simples toque em metade squerda/direita do canvas
canvas.addEventListener('touchstart', function (e) {
    e.preventDefault(); //evita rolagem da tela
    const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    if (touchX < gameWidth / 2) {
        leftPressed = true; //toque esquerda = move esquerda
    } else {
        rightPressed = true; //toque direita = move direita
    }
});

//termina toque
canvas.addEventListener('touched', function (e) {
    leftPressed = false;
    rightPressed = false;
});

//reiniciar quando clicar no botão de reiniciar
restartBtn.addEventListener('click', function () {
    resetGame(); //chama função para reiniciar tudo
});

//inicia o jogo na primeira carga
requestAnimationFrame(gameLoop);
import { reverseCursor } from '/src/pages/RevCur/cursor.ts';

let score = 0;
let timer = null;
let currentBox = null;
let gameActive = false;

document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');
    const scoreScreen = document.getElementById('scoreScreen');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const sandboxMode = document.getElementById('sandboxMode');

    document.addEventListener('keydown', (e) => {
        switch (e.key.toLowerCase()) {
            case 's':
                if (!gameActive) {
                    startGame();
                }
                break;
            case 'r':
                if (!gameActive) {
                    restartGame();
                }
                break;
            case 'e':
                if (!gameActive) {
                    toggleSandboxMode();
                }
                break;
        }
    });

    sandboxMode.style.display = 'block';
    reverseCursor();

    function startGame() {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        score = 0;
        scoreDisplay.innerText = `Score: ${score}`;
        gameActive = true;
        startTimer(30);
        spawnBox();
    }

    function endGame() {
        gameActive = false;
        clearInterval(timer);
        gameScreen.style.display = 'none';
        scoreScreen.style.display = 'block';
        scoreElement.innerText = score.toString();
        if (currentBox) {
            currentBox.remove();
        }
    }

    function restartGame() {
        scoreScreen.style.display = 'none';
        startScreen.style.display = 'block';
    }

    function startTimer(duration) {
        let timeRemaining = duration;
        timerElement.innerText = `${timeRemaining}s`;

        timer = setInterval(() => {
            timeRemaining--;
            timerElement.innerText = `${timeRemaining}s`;

            if (timeRemaining <= 0) {
                endGame();
            }
        }, 1000);
    }

    function spawnBox() {
        if (currentBox) {
            currentBox.remove();
        }

        const box = document.createElement('div');
        box.className = 'box';
        box.style.left = `${Math.random() * 90}%`;
        box.style.top = `${Math.random() * 90}%`;
        box.onclick = () => {
            score++;
            scoreDisplay.innerText = `Score: ${score}`;
            spawnBox();
        };

        gameScreen.appendChild(box);
        currentBox = box;
    }

    function toggleSandboxMode() {
        const isSandbox = sandboxMode.style.display === 'block';
        sandboxMode.style.display = isSandbox ? 'none' : 'block';
    }
});

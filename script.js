const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const modeDisplay = document.getElementById('mode');
const resultDisplay = document.getElementById('result');

let score = 0;
let tapCount = 0; // 耐久モード用のタップ回数
let startTime;
let timerId;
let gameMode = 1; // 1:通常, 2:増殖, 3:移動, 4:耐久

// ブロックを作成する関数
function createBlock() {
    const newBlock = document.createElement('div');
    newBlock.classList.add('block');
    newBlock.style.left = `${Math.random() * (gameContainer.offsetWidth - 50)}px`;
    newBlock.style.top = `${Math.random() * (gameContainer.offsetHeight - 50)}px`;
    
    // モードに応じてスタイルを設定
    if (gameMode === 2) {
        newBlock.classList.add('mode-2');
    } else if (gameMode === 3) {
        newBlock.classList.add('mode-3');
    } else if (gameMode === 4) {
        newBlock.classList.add('mode-4');
        newBlock.dataset.taps = 0;
        newBlock.style.opacity = 1;
    }

    newBlock.addEventListener('click', () => {
        handleBlockClick(newBlock);
    });
    
    gameContainer.appendChild(newBlock);
}

// ブロックがクリックされたときの処理
function handleBlockClick(block) {
    if (score >= 50) return;

    if (gameMode === 4) {
        const taps = parseInt(block.dataset.taps);
        if (taps < 2) {
            block.dataset.taps = taps + 1;
            block.style.opacity = (1 - (taps + 1) * 0.3);
            return;
        }
    }

    block.remove();
    score++;
    scoreDisplay.textContent = score;

    // 10ポイントごとにモードを切り替え
    if (score % 10 === 0 && score < 50) {
        changeMode();
    }

    if (score >= 50) {
        endGame();
    } else if (gameMode === 2) {
        // 増殖モード: 3つ増える
        createBlock();
        createBlock();
        createBlock();
    } else {
        // 通常モード, 移動モード, 耐久モード: 1つ増える
        createBlock();
    }
}

// ゲームモードを切り替える関数
function changeMode() {
    gameMode = (gameMode % 4) + 1;
    let modeText;
    if (gameMode === 1) modeText = '通常モード';
    else if (gameMode === 2) modeText = '増殖モード';
    else if (gameMode === 3) modeText = '移動モード';
    else if (gameMode === 4) modeText = '耐久モード';
    modeDisplay.textContent = modeText;
    
    gameContainer.innerHTML = ''; // 画面をクリア
    createBlock();
}

// ゲーム終了時の処理
function endGame() {
    clearInterval(timerId);
    const finalTime = (performance.now() - startTime) / 1000;
    resultDisplay.textContent = `ゲームクリア！タイムは ${finalTime.toFixed(2)} 秒でした！`;
    gameContainer.innerHTML = '';
}

// タイマーを更新する関数
function updateTimer() {
    const currentTime = (performance.now() - startTime) / 1000;
    timerDisplay.textContent = currentTime.toFixed(2);
}

// ゲーム開始時の処理
window.onload = () => {
    // 最初のブロックを生成し、タイマーをスタート
    createBlock();
    startTime = performance.now();
    timerId = setInterval(updateTimer, 10); // 10ミリ秒ごとにタイマー更新
};
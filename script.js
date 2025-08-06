const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const modeDisplay = document.getElementById('mode');
const resultDisplay = document.getElementById('result');

let score = 0;
let tapCount = 0;
let startTime;
let timerId;
let gameMode = 1; // 1:通常, 2:増殖, 3:移動, 4:耐久, 5:消滅
let movingBlocks = []; // 移動モード用のブロック配列
let disappearingTimeout; // 消滅モード用のタイマー

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
        movingBlocks.push({
            element: newBlock,
            vx: (Math.random() - 0.5) * 4, // ランダムなX方向の速度
            vy: (Math.random() - 0.5) * 4  // ランダムなY方向の速度
        });
    } else if (gameMode === 4) {
        newBlock.classList.add('mode-4');
        newBlock.dataset.taps = 0;
        newBlock.style.opacity = 1;
    } else if (gameMode === 5) {
        newBlock.classList.add('mode-5');
        newBlock.addEventListener('click', () => {
            handleBlockClick(newBlock);
        });
        // 0.5秒後にブロックを消去するタイマーを設定
        disappearingTimeout = setTimeout(() => {
            newBlock.remove();
            createBlock(); // 新しい場所にブロックを生成
        }, 500);
    }
    
    // 消滅モード以外はクリックイベントを追加
    if (gameMode !== 5) {
        newBlock.addEventListener('click', () => {
            handleBlockClick(newBlock);
        });
    }

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
    } else if (gameMode === 5) {
        clearTimeout(disappearingTimeout);
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
        createBlock();
        createBlock();
        createBlock();
    } else {
        createBlock();
    }
}

// ゲームモードを切り替える関数
function changeMode() {
    // 50点に達したら何もしない
    if (score >= 50) return;

    gameMode = Math.floor(score / 10) + 1;
    let modeText;
    if (gameMode === 1) modeText = '通常モード';
    else if (gameMode === 2) modeText = '増殖モード';
    else if (gameMode === 3) modeText = '移動モード';
    else if (gameMode === 4) modeText = '耐久モード';
    else if (gameMode === 5) modeText = '消滅モード';
    modeDisplay.textContent = modeText;
    
    gameContainer.innerHTML = '';
    movingBlocks = [];
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

// 移動モードのブロックを更新する関数
function updateMovingBlocks() {
    if (gameMode !== 3) return;

    movingBlocks.forEach(block => {
        let x = parseFloat(block.element.style.left);
        let y = parseFloat(block.element.style.top);

        x += block.vx;
        y += block.vy;

        // 画面端で跳ね返る
        if (x + 50 > gameContainer.offsetWidth || x < 0) {
            block.vx *= -1;
        }
        if (y + 50 > gameContainer.offsetHeight || y < 0) {
            block.vy *= -1;
        }

        block.element.style.left = `${x}px`;
        block.element.style.top = `${y}px`;
    });
}

// ゲーム開始時の処理
window.onload = () => {
    createBlock();
    startTime = performance.now();
    timerId = setInterval(updateTimer, 10);
    setInterval(updateMovingBlocks, 20); // 移動ブロックを常に更新
};
const board = document.getElementById('board');
    const header = document.getElementById('head');
    const dice = document.getElementById('dice');
    const playerPositionText = document.getElementById('player-position');
    const rolledText = document.getElementById('rolled');
    const lines = document.getElementById('lines');
    const playerForm = document.getElementById('player-form');
    const gameContainer = document.getElementById('game-container');
    const numPlayersSelect = document.getElementById('num-players');
    const messageContainer = document.getElementById('message-container');
    const restartButton = document.getElementById('restart-button');

    let players = [];
    let currentPlayerIndex = 0;

    const snakes = {
        51: 32,
        64: 45,
        80: 42,
        92: 14
    };

    const ladders = {
        9: 33,
        17: 38,
        66: 87,
        78: 99
    };

    function startGame() {
        const numPlayers = parseInt(numPlayersSelect.value);
        players = []; // Reset players array
        currentPlayerIndex = 0; // Reset current player
        messageContainer.style.display = 'none'; // Hide the message container
        header.style.display = 'none';
        // Initialize players and set their starting position
        for (let i = 1; i <= numPlayers; i++) {
            const player = document.getElementById(`player-${i}`);
            player.style.display = 'block';
            player.style.top = '0px'; // Reset player position visually
            player.style.left = '0px'; // Reset player position visually
            players.push({ element: player, position: 1 });
        }

        playerForm.style.display = 'none'; // Hide form to select players
        gameContainer.style.display = 'flex'; // Show the game container
        gameContainer.style.justifyContent = 'space-around';
        header.style.display = 'block';

        updatePlayerPosition(); // Update initial player position on board
        drawSnakesAndLadders(); // Draw snakes and ladders on the board
    }

    function rollDice() {
        dice.style.transform = 'rotatez(360deg)';
        setTimeout(() => {
            const roll = Math.floor(Math.random() * 6) + 1;
            dice.textContent = roll;
            movePlayer(roll);
            dice.style.transform = 'rotatez(0deg)';
        }, 500);
    }

    function movePlayer(roll) {
        let player = players[currentPlayerIndex];
        let newPosition = player.position + roll;

        // Check if newPosition exceeds 100
        if (newPosition > 100) {
            newPosition = player.position; // Player remains in the same position
        } else {
            // Check for snakes or ladders
            if (snakes[newPosition]) {
                newPosition = snakes[newPosition];
            } else if (ladders[newPosition]) {
                newPosition = ladders[newPosition];
            }
        }

        player.position = newPosition;
        updatePlayerPosition();

        if (player.position === 100) {
            checkGameCompletion(); // Check if all players have completed the game
        }

        nextPlayer(); // Move to the next player
    }

    function nextPlayer() {
    // Check if all players have finished the game
    const unfinishedPlayers = players.filter(player => player.position < 100);
    
    if (unfinishedPlayers.length === 0) {
        // All players have finished, so the game should end
        checkGameCompletion();
        return;
    }

    // Move to the next player
    do {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    } while (players[currentPlayerIndex].position === 100); // Skip players who have finished
}


    function updatePlayerPosition() {
        players.forEach(player => {
            const cell = document.getElementById(`cell-${player.position}`);
            const rect = cell.getBoundingClientRect();
            const boardRect = board.getBoundingClientRect();
            player.element.style.top = `${rect.top - boardRect.top}px`;
            player.element.style.left = `${rect.left - boardRect.left}px`;
        });
        playerPositionText.textContent = `Player ${currentPlayerIndex + 1} Position: ${players[currentPlayerIndex].position}`;
        rolledText.textContent = `You rolled a ${dice.textContent}`;
    }

    function checkGameCompletion() {
        const allPlayersFinished = players.every(player => player.position === 100);
        if (allPlayersFinished) {
            showVictoryPage(); // Show the victory page
        }
    }

    function showVictoryPage() {
        header.style.display = 'none'; //Hide the header of the game
        gameContainer.style.display = 'none'; // Hide the game container
        messageContainer.style.display = 'block'; // Show the victory page
    }

    function refreshPage() {
        location.reload(); // Reload the page to restart the game
    }

    function restartGame() {
        playerForm.style.display = 'block'; // Show the player selection form
        gameContainer.style.display = 'none'; // Hide the game board
        header.style.display = 'none';// Hide the header of the game
        dice.textContent = 'Roll'; // Reset dice text
        numPlayersSelect.value = 2; // Reset to default 2 players
    }

    // Draw snakes and ladders
    function drawLine(x1, y1, x2, y2, color) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", 2);
        lines.appendChild(line);
    }

    function drawSnakesAndLadders() {
        for (const [start, end] of Object.entries(snakes)) {
            const startCell = document.getElementById(`cell-${start}`);
            const endCell = document.getElementById(`cell-${end}`);
            const startRect = startCell.getBoundingClientRect();
            const endRect = endCell.getBoundingClientRect();
            const boardRect = board.getBoundingClientRect();
            drawLine(
                startRect.left - boardRect.left + 25,
                startRect.top - boardRect.top + 25,
                endRect.left - boardRect.left + 25,
                endRect.top - boardRect.top + 25,
                'red'
            );
        }
        for (const [start, end] of Object.entries(ladders)) {
            const startCell = document.getElementById(`cell-${start}`);
            const endCell = document.getElementById(`cell-${end}`);
            const startRect = startCell.getBoundingClientRect();
            const endRect = endCell.getBoundingClientRect();
            const boardRect = board.getBoundingClientRect();
            drawLine(
                startRect.left - boardRect.left + 25,
                startRect.top - boardRect.top + 25,
                endRect.left - boardRect.left + 25,
                endRect.top - boardRect.top + 25,
                'green'
            );
        }
    }

   

window.onload = () => {
    drawSnakesAndLadders();
};
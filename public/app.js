// Connexion WebSocket
const ws = new WebSocket(`ws://${window.location.hostname}:3000`);

// Éléments du DOM
const newGameInput = document.getElementById('newGameInput');
const addGameBtn = document.getElementById('addGameBtn');
const gamesList = document.getElementById('gamesList');
const gameCount = document.getElementById('gameCount');
const nicknameInput = document.getElementById('nicknameInput');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const chatMessages = document.getElementById('chatMessages');

// État de l'application
let games = [];
let nickname = '';

// Fonctions
function updateGamesList() {
    gamesList.innerHTML = '';
    const activeGames = games.filter(game => !game.finished);
    gameCount.textContent = activeGames.length;

    games.forEach(game => {
        const li = document.createElement('li');
        li.className = 'game-item' + (game.finished ? ' finished' : '');
        
        li.innerHTML = `
            <span class="game-name">${game.name}</span>
            <span class="delete-btn" data-id="${game.id}">×</span>
        `;
        
        li.querySelector('.delete-btn').onclick = () => deleteGame(game.id);
        li.onclick = () => toggleGameStatus(game.id);
        
        gamesList.appendChild(li);
    });
}

function addGame(name) {
    const game = {
        id: Date.now(),
        name: name,
        finished: false
    };
    
    games.push(game);
    ws.send(JSON.stringify({ type: 'add', game }));
    updateGamesList();
}

function deleteGame(id) {
    games = games.filter(game => game.id !== id);
    ws.send(JSON.stringify({ type: 'delete', id }));
    updateGamesList();
}

function toggleGameStatus(id) {
    const game = games.find(g => g.id === id);
    if (game) {
        game.finished = !game.finished;
        ws.send(JSON.stringify({ type: 'update', game }));
        updateGamesList();
    }
}

// Fonctions du chat
function sendMessage() {
    const message = messageInput.value.trim();
    nickname = nicknameInput.value.trim() || 'Anonyme';
    
    if (message) {
        const chatMessage = {
            type: 'chat',
            nickname: nickname,
            message: message
        };
        ws.send(JSON.stringify(chatMessage));
        addMessageToChat(nickname, message);
        messageInput.value = '';
    }
}

function addMessageToChat(nickname, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `<span class="nickname">${nickname}:</span> ${message}`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Événements
addGameBtn.onclick = () => {
    const name = newGameInput.value.trim();
    if (name) {
        addGame(name);
        newGameInput.value = '';
    }
};

newGameInput.onkeypress = (e) => {
    if (e.key === 'Enter') {
        addGameBtn.click();
    }
};

// Événements du chat
sendMessageBtn.onclick = sendMessage;
messageInput.onkeypress = (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
};

// WebSocket events
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch(data.type) {
        case 'add':
            games.push(data.game);
            break;
        case 'delete':
            games = games.filter(game => game.id !== data.id);
            break;
        case 'update':
            const index = games.findIndex(g => g.id === data.game.id);
            if (index !== -1) {
                games[index] = data.game;
            }
            break;
        case 'chat':
            if (data.nickname !== nickname) {
                addMessageToChat(data.nickname, data.message);
            }
            break;
    }
    
    updateGamesList();
};

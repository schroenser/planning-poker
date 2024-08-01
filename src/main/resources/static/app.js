const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/gs-guide-websocket'
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/pokersession', (pokerSession) => {
        updatePokerSession(JSON.parse(pokerSession.body));
    });
};

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    $('#connect').prop('disabled', connected);
    $('#disconnect').prop('disabled', !connected);
    if (connected) {
        $('#conversation').show();
    }
    else {
        $('#conversation').hide();
    }
    $('#greetings').html('');
}

function connect() {
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log('Disconnected');
}

function add() {
    stompClient.publish({
        destination: '/app/add',
        body: $('#name').val()
    });
}

function sendVote() {
    stompClient.publish({
        destination: '/app/vote',
        body: JSON.stringify({
            name: $('#name').val(),
            vote: $('#vote').val()
        })
    });
}

function updatePokerSession(pokerSession) {
    let votes = $('#votes');
    votes.empty();
    for (const [name, vote] of Object.entries(pokerSession)) {
        votes.append('<tr><td>' + name + '</td><td>' + vote + '</td></tr>');
    }
}

$(function() {
    $('form').on('submit', (e) => e.preventDefault());
    $('#connect').click(() => connect());
    $('#disconnect').click(() => disconnect());
    $('#join').click(() => add());
    $('#sendVote').click(() => sendVote());
});

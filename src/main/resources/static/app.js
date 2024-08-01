const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/websocket'
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/' + window.location.hash.substring(1), (response) => {
        updateVotes(JSON.parse(response.body));
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

function join() {
    stompClient.publish({
        destination: '/app/' + window.location.hash.substring(1) + '/join',
        body: JSON.stringify({
            name: $('#name').val()
        })
    });
}

function reset() {
    stompClient.publish({
        destination: '/app/' + window.location.hash.substring(1) + '/reset'
    });
}

function vote() {
    stompClient.publish({
        destination: '/app/' + window.location.hash.substring(1) + '/vote',
        body: JSON.stringify({
            name: $('#name').val(),
            value: $('#value').val()
        })
    });
}

function updateVotes(values) {
    let votes = $('#votes');
    votes.empty();
    for (const [name, value] of Object.entries(values)) {
        votes.append('<tr><td>' + name + '</td><td>' + value + '</td></tr>');
    }
}

$(function() {
    $('form').on('submit', (e) => e.preventDefault());
    $('#connect').click(() => connect());
    $('#disconnect').click(() => disconnect());
    $('#join').click(() => join());
    $('#vote').click(() => vote());
});

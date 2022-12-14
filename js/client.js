const socket = io('http://localhost:8000');

const form = document.getElementById('send');
const msg_input = document.getElementById('msgInput');
const msg_container = document.querySelector('.container');

let audio = new Audio('noti.mp3');

const append = (message, status)=>{
    
    const  messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(status);
    msg_container.append(messageElement);

    msg_container.scrollTo(0, msg_container.scrollHeight);

    if (status == 'received'){
        audio.play();
    }

};

const name = sessionStorage.getItem('name');

if (name){

    const name = sessionStorage.getItem('name');
    socket.emit('new-user-joined', name);

} else {

    swal("Enter Your Name:", {
        content: "input",
    })
    .then((name) => {
        swal(`Welcome to the chat ${name}`);
        socket.emit('new-user-joined', name);
        sessionStorage.setItem('name', name);
    });

}  

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = msg_input.value;
    if (message != ""  && message != " "){

        append(`You: ${message}`, 'sent');
        socket.emit('send', message);
        msg_input.value = "";
    }
});

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'alert');
});

socket.on('receive', data => {
    append(`${data.name} : ${data.message}`, 'received');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'alert');
});

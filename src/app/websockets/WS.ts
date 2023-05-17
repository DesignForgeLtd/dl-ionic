import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})

export class WS {

    private socket: WebSocket;

    constructor() {
        this.socket = new WebSocket('ws://localhost:443/');
        
        this.socket.onmessage = (event) => {
            // console.log(event)
            console.log('Message from WS server: ' + event.data);
        };
    };

    message(text)
    {
        this.socket.send(JSON.stringify({'action': 'message', 'message': text}));        
    }

    heroMove(data)
    {
        this.socket.send(JSON.stringify({'action': 'heroMove', 'data': data}));
    }
}
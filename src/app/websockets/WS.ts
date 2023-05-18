import { EventEmitter, Injectable, Output } from "@angular/core";

@Injectable({providedIn: 'root'})

export class WS {

    @Output() heroMoveRegistered : EventEmitter<any> = new EventEmitter();


    private socket: WebSocket;

    constructor() {
        this.socket = new WebSocket('ws://localhost:443/');
        
        this.socket.onmessage = (event) => {
            console.log(event.data)
            console.log(typeof event.data)
            console.log('Message from WS server: ' + event.data);

            this.heroMoveRegistered.emit(event.data);
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
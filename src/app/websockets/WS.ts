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

    send(text)
    {
        this.socket.send(text)        
    }
}
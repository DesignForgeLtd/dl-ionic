import { EventEmitter, Injectable, Output } from "@angular/core";
import { environment } from './../../environments/environment';

@Injectable({providedIn: 'root'})

export class WS {

    @Output() heroUpdateEvent : EventEmitter<any> = new EventEmitter();


    private socket: WebSocket;

    constructor() {
        console.log("Connecting to WS at: " + environment.webSocketURL);
        this.socket = new WebSocket(environment.webSocketURL);
        
        this.socket.onmessage = (event) => {
            const dataString = event.data;
            const data = JSON.parse(dataString);
            console.log('Received from WS: ')
            console.log(data)
            switch (data.action)
            {
              case 'message': 
                console.log('Message from WS server: ' + data.message);
                break;
              case 'heroMove':
              case 'heroDisappear':
                this.heroUpdateEvent.emit(data);
                break;
            }
            
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

    heroDisappear(data)
    {
        console.log('heroDis:');
        console.log(data);
        this.socket.send(JSON.stringify({'action': 'heroDisappear', 'data': data}));
    }
}
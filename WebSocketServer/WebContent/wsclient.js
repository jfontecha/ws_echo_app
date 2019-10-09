var client = null;

function onConnectClick(){
	
	var ws_protocol = document.getElementById("protocol").value;
    var ws_hostname = document.getElementById("hostname").value;
    var ws_port     = document.getElementById("port").value;
    var ws_endpoint = document.getElementById("endpoint").value;
    
	//var client = new WebSocketClient('ws', '127.0.0.1', 80, '/WebSocketServer/echo');
    client = new WebSocketClient(ws_protocol, ws_hostname, ws_port, '/WebSocketServer/' + ws_endpoint);
    client.connect();
    
    document.getElementById("btnSend").disabled       = false;
    document.getElementById("btnConnect").disabled    = true;
    document.getElementById("btnDisconnect").disabled = false;
}

function onDisconnectClick(){
	
	client.disconnect();
	
	document.getElementById("btnSend").disabled       = true;
    document.getElementById("btnConnect").disabled    = false;
    document.getElementById("btnDisconnect").disabled = true;
}

function onSendClick(){
	
    var msg = document.getElementById("message").value;
    client.send(msg);
}

/***********************************************/
//USAGE:
//1. var client = new WebSocketClient('ws', '127.0.0.1', 8080, '/WebSocketServer/endpoint');
//2. client.connect();
//3. client.send('Hello Server!');
//4. client.disconnect();
//Nota: se deberá modificar el html de acuerdo a poder usar este cliente JS embebido en una clase
/***********************************************/
class WebSocketClient {

    constructor(protocol, hostname, port, endpoint) {

        this.webSocket = null;

        this.protocol = protocol;
        this.hostname = hostname;
        this.port     = port;
        this.endpoint = endpoint;
    }

    getServerUrl() {
        return this.protocol + "://" + this.hostname + ":" + this.port + this.endpoint;
    }

    connect() {
        try {
            this.webSocket = new WebSocket(this.getServerUrl());

            //
            // Implement WebSocket event handlers!
            //
            this.webSocket.onopen = function(event) {
                console.log('onopen::' + JSON.stringify(event, null, 4));
            }

            this.webSocket.onmessage = function(event) {
                var msg = event.data;
                console.log('onmessage::' + JSON.stringify(msg, null, 4));
                
                if (msg.indexOf("error") > 0) {
                    document.getElementById("incomingMsgOutput").value += "error: " + msg.error + "\r\n";
                } else {
                    document.getElementById("incomingMsgOutput").value += "message: " + msg + "\r\n";
                }
            }
            this.webSocket.onclose = function(event) {
                console.log('onclose::' + JSON.stringify(event, null, 4));
            }
            this.webSocket.onerror = function(event) {
                console.log('onerror::' + JSON.stringify(event, null, 4));
            }

        } catch (exception) {
            console.error(exception);
        }
    }

    getStatus() {
        return this.webSocket.readyState;
    }
    send(message) {

        if (this.webSocket.readyState == WebSocket.OPEN) {
            this.webSocket.send(message);

        } else {
            console.error('webSocket is not open. readyState=' + this.webSocket.readyState);
        }
    }
    disconnect() {
        if (this.webSocket.readyState == WebSocket.OPEN) {
            this.webSocket.close();

        } else {
            console.error('webSocket is not open. readyState=' + this.webSocket.readyState);
        }
    }
}
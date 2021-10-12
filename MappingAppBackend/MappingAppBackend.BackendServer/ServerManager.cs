using MQTTnet;
using MQTTnet.Client.Connecting;
using MQTTnet.Client.Disconnecting;
using MQTTnet.Client.Receiving;
using System;
using System.Collections.Generic;
using System.Text;

namespace MappingAppBackend.BackendServer
{
    public class ServerManager
    {
        private ServerHandler _serverHandler;
        private Dictionary<string, ClientHandler> _clientHandlers;       

        public void Start()
        {
            Console.WriteLine("ServerManager Start() called.");
            _clientHandlers = new Dictionary<string, ClientHandler>();

            ConnectBackendServerAddress();  
        }
        public void Stop()
        { 
            Console.WriteLine("ServerManager Stop() called.");       
            foreach (var client in _clientHandlers)
            {                
                client.Value.ClientHandlerMqttClient.Disconnect();
            }
            _serverHandler.ServerHandlerMqttClient?.Disconnect();
        }

        private void ConnectBackendServerAddress()
        {
            _serverHandler = new ServerHandler(ServerConfigs._brokerUri, ServerConfigs._brokerBackendConnectAddress);

            _serverHandler.ServerHandlerMqttClient.Client.ConnectedHandler = new MqttClientConnectedHandlerDelegate(OnConnected);
            _serverHandler.ServerHandlerMqttClient.Client.ApplicationMessageReceivedHandler = new MqttApplicationMessageReceivedHandlerDelegate(OnMsgReceived);
            _serverHandler.ServerHandlerMqttClient.Client.DisconnectedHandler = new MqttClientDisconnectedHandlerDelegate(OnDisconnected);

            _serverHandler.Connect(); // Connecting and subscribe to default topic
        }


        //ServerHandler Event Wiring
        private void OnMsgReceived(MqttApplicationMessageReceivedEventArgs e)
        {
            Console.WriteLine("Successfully OnMsgReceived ServerManager.");

            var clientMessage = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);
            Console.WriteLine($"### RECEIVED APPLICATION MESSAGE ###");
            Console.WriteLine($"+ Topic = {e.ApplicationMessage.Topic}");
            Console.WriteLine($"+ Payload = {clientMessage}");
            Console.WriteLine();

            //var receivedData = Encoding.UTF8.GetString(e.Message, 0, e.Message.Length);
            //var clientMessage = JsonConvert.DeserializeObject<ClientMessage>(receivedData);
            //SetupClientHandler(clientMessage);

            //Typically this will be a connection request from a client-app e.g. a webApp. (todo truckClient?)
            //So we are setting up a Clienthandler which will manage that client-app requests.
            SetupClientHandler(clientMessage);
        }
        private void OnConnected(MqttClientConnectedEventArgs obj)
        {
            Console.WriteLine("Successfully connected.");
        }
        private void OnDisconnected(MqttClientDisconnectedEventArgs obj)
        {
            Console.WriteLine($"{_serverHandler.Id}Disconnected.");
        }
        private void SetupClientHandler(string clientMessage)
        {
            //TODO Handle
            Console.WriteLine(clientMessage);

            var publishingGuid = Guid.NewGuid().ToString("N");
            var listeningGuid = Guid.NewGuid().ToString("N");
            var clientHandlerId = $"setupClientHandler-{ Guid.NewGuid()}"; //clientMessage.ClientId

            Console.WriteLine($"{clientHandlerId}");

            //var clientHandler = new ClientHandler(
            //    _brokerUri, 
            //    publishingGuid, 
            //    listeningGuid,
            //    clientHandlerId
            //    );

            //if (_clientHandlers.ContainsKey(clientHandlerId))
            //{
            //    // close existing mqtt connections
            //    _clientHandlers[clientHandlerId].Dispose();
            //    _clientHandlers[clientMessage.ClientId] = clientHandler;
            //}
            //else
            //{
            //    _clientHandlers.Add(clientMessage.ClientId, clientHandler);
            //}
            //clientHandler.OnReceivedData += ClientHandler_OnReceivedData;
            //clientHandler.OnConnected += ClientHandler_OnConnected;
            //clientHandler.OnDisconnected += ClientHandler_OnDisconnected;
            //clientHandler.Connect();
        }

        public void DisplayServerManagerInfo()
        {
            Console.WriteLine($"ClientHandlers: {_clientHandlers.Count}");
        }
    }
}

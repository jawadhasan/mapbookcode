using MappingAppBackend.BackendServer;
using MqttCommon;
using System;
using System.Threading;

namespace MappingAppBackend.ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {

            Console.WriteLine("ConsoleApp");

            //serverManager
            var serverManasger = new ServerManager();
            serverManasger.Start();

            //TestclientHandler
            var clientHandler = new ClientHandler(
                ServerConfigs._brokerUri,
                Guid.NewGuid().ToString("N"),
                Guid.NewGuid().ToString("N"),
                "clientHandler-1");
            clientHandler.Connect();

            //TruckClietHandler //TODO: Should be specialized
            var truckClientHandler1 = new ClientHandler(
                ServerConfigs._brokerUri,
                Guid.NewGuid().ToString("N"),
                Guid.NewGuid().ToString("N"),
                "tuckHandler-1");
            truckClientHandler1.Connect();


            //WebApiClientHandler
            var webApiClientHandler = new ClientHandler(
                ServerConfigs._brokerUri,
                Guid.NewGuid().ToString("N"),
                Guid.NewGuid().ToString("N"),
                "webApiHandler");
            webApiClientHandler.Connect();

            //var clientMessage = new ClientMessage
            //{
            //    ClientId = "webApiHandler",
            //    ClientReturnGuid = WebApiClientHandler.ListeningGuid                 
            //};

            Console.WriteLine("Sending Message to Server");
            var simpleMessage = webApiClientHandler.BuildMqttMessage("test is test from webApiClientHandler", ServerConfigs._backendConnectAddress);
            webApiClientHandler.ClientHandlerMqttClient.Client.PublishAsync(simpleMessage, CancellationToken.None);


            serverManasger.DisplayServerManagerInfo();

            Console.WriteLine("Close ConsoleApp [Press Key]");
            Console.ReadLine();
            serverManasger.Stop();


            Console.ReadLine();
        }
    }
}

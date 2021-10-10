using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Client.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace MappingAppBackend.BackendServer
{
    public class TestMqttClient
    {
        private static IMqttClient _client;
        private static IMqttClientOptions _options;    

        public TestMqttClient()
        {
        }       

        public void Start()
        {
            this.BuildClient();

            Console.WriteLine("Start called.");
            _client?.ConnectAsync(_options).Wait();
           Console.WriteLine($"ClientId: {_client.Options.ClientId} started.");
        }
        public void Stop()
        {
            Console.WriteLine("Stop called.");
            _client?.DisconnectAsync().Wait();
        }

        private void BuildClient()
        {
            var factory = new MqttFactory();
            _client = factory.CreateMqttClient();

            var clientId = Guid.NewGuid().ToString("N");

            //configure options
            _options = new MqttClientOptionsBuilder()
                .WithClientId(clientId)
                .WithTcpServer("localhost", 1884)
                .WithCleanSession()
                .Build();
        }
    }
}

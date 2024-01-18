using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Client.Options;
using System;

namespace MqttCommon
{
    public class BaseMqttClient
    {
        public IMqttClient Client;
        public string Id { get; }


        private IMqttClientOptions _options;
        private string _brokerUri;

        public BaseMqttClient(string brokerUri, string id)
        {
            _brokerUri = brokerUri;
            Id = id;

            this.BuildClient();
        }

        public void Connect()
        {
            Client?.ConnectAsync(_options).Wait();
            Console.WriteLine($"Id: {Id} connected.");
        }
        public void Disconnect()
        {
            Console.WriteLine($"{Id} Disconnect called.");
            Client?.DisconnectAsync().Wait();
        }

        private void BuildClient()
        {
            var factory = new MqttFactory();
            Client = factory.CreateMqttClient();

            //configure options
            _options = new MqttClientOptionsBuilder()
                .WithClientId(Id)
                .WithTcpServer(_brokerUri, 1884)
                .WithCleanSession()
                .Build();
        }


    }
}

using MQTTnet;
using MQTTnet.Client.Subscribing;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MappingAppBackend.BackendServer
{
    public class ServerHandler
    {
        private string _brokerBackendConnectAddress;
        public string Id { get; } = "backendServerHandler";

        public BaseMqttClient ServerHandlerMqttClient { get; private set; }       

        public ServerHandler(string brokerUri, string brokerBackendConnectAddress)            
        {            
            _brokerBackendConnectAddress = brokerBackendConnectAddress;            
            ServerHandlerMqttClient = new BaseMqttClient(brokerUri, this.Id);
            
        }

        public void Connect()
        {
            ServerHandlerMqttClient.Connect();

            //Immediately start listening on DefaultTopic
            SubscribeToDefaultTopic();
        }

        private void SubscribeToDefaultTopic()
        {
            var defaultSubscription = new MqttClientSubscribeOptionsBuilder()
                .WithTopicFilter(new MqttTopicFilterBuilder()
                .WithTopic(_brokerBackendConnectAddress)
                .WithQualityOfServiceLevel(MQTTnet.Protocol.MqttQualityOfServiceLevel.ExactlyOnce)
                .Build())
                .Build();

            ServerHandlerMqttClient.Client.SubscribeAsync(defaultSubscription, CancellationToken.None);   
        }
    }
}

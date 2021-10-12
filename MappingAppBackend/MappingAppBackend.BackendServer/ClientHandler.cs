using MQTTnet;
using MQTTnet.Client.Subscribing;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace MappingAppBackend.BackendServer
{
    public class ClientHandler
    {
        //These events, call-code can use
        public event EventHandler OnConnected;


        public string Id { get; }
        public BaseMqttClient ClientHandlerMqttClient { get; private set; }
        public string ListeningGuid { get; private set; }
        public string PublishingGuid { get; private set; }

        public ClientHandler(string brokerUri, string publishingGuid, string listeningGuid, string id)
        {
            ClientHandlerMqttClient = new BaseMqttClient(brokerUri, id);
            Id = id;
            PublishingGuid = publishingGuid;
            ListeningGuid = listeningGuid;
        }

        public void Connect()
        {
            ClientHandlerMqttClient.Connect();


            //_mqttClientManager.Connect();
            //_mqttClientManager.MqttClient.MqttMsgPublishReceived += _mqttClient_MqttMsgPublishReceived;
            //_mqttClientManager.MqttClient.MqttMsgSubscribed += _mqttClient_MqttMsgSubscribed;
            //_mqttClientManager.MqttClient.MqttMsgPublished += _mqttClient_MqttMsgPublished;
            //_mqttClientManager.MqttClient.ConnectionClosed += _mqttClient_ConnectionClosed;
            //_mqttClientManager.MqttClient.Subscribe(new[] { ListeningGuid }, new[] { MqttMsgBase.QOS_LEVEL_EXACTLY_ONCE });
            //OnConnected?.Invoke(this, EventArgs.Empty);

            //Start listening to default topic: Listening GUID
            SubscribeToDefaultTopic();


            //Callback
            OnConnected?.Invoke(this, EventArgs.Empty);

        }


        //Client is byDefault listening on its topic (ListeningGuid)
        //Every client will have its own ListeningGuid, Thats how client will recieve incoming msgs.
        private void SubscribeToDefaultTopic()
        {
            var defaultSubscription = new MqttClientSubscribeOptionsBuilder()
                .WithTopicFilter(new MqttTopicFilterBuilder()
                .WithTopic(ListeningGuid)
                .WithQualityOfServiceLevel(MQTTnet.Protocol.MqttQualityOfServiceLevel.ExactlyOnce)
                .Build())
                .Build();

            ClientHandlerMqttClient.Client.SubscribeAsync(defaultSubscription, CancellationToken.None);


        }




        public MqttApplicationMessage BuildMqttMessage(string message, string topic)
        {

            var testMessage = new MqttApplicationMessageBuilder()
                 .WithTopic(topic)
                 .WithPayload(message)
                 .WithExactlyOnceQoS()
                 .WithRetainFlag()
                 .Build();

            return testMessage;
        }

    }
}

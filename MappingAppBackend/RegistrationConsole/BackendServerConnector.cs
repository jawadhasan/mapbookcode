using MqttCommon;
using MqttCommon.Messages;
using System;
using System.Collections.Generic;
using System.Text;

namespace RegistrationConsole
{
    public class BackendServerConnector
    {       
        public BaseMqttClient BackendServerConnectorMqttClient { get; private set; }


        public bool GetNewTempDeviceId(string sessionIdentifier)
        {
            BackendServerConnectorMqttClient = new BaseMqttClient(ServerConfigs._brokerUri, ServerConfigs._backendConnectAddress);
            BackendServerConnectorMqttClient.Connect();




            //Send A command to get a connection-id
            var cmd = new GetDeviceConnectId(sessionIdentifier);
            var payload = CommandBuilder.BuildTransferData(cmd);
            Console.WriteLine(payload);
            //return _clientConnector.SendData(payload);

            return true;
        }
    }
}

using MqttCommon;
using System;
using System.Collections.Generic;
using System.Text;

namespace RegistrationConsole
{
    public class RegistrationManager
    {
        private readonly BackendServerConnector _backendServerConnector;
        private readonly Dictionary<string, BackendServerWaitHandler> _dictBackendServerWaitHandlers;
             
        public RegistrationManager()
        {
            _backendServerConnector = new BackendServerConnector();
            _dictBackendServerWaitHandlers = new Dictionary<string, BackendServerWaitHandler>();
        }
        public string GetNewTempDeviceId()
        {
            try
            {
                var sessionId = $"{Guid.NewGuid():N}";

                var backEndServerReadWaitHandler = new BackendServerWaitHandler();
                _dictBackendServerWaitHandlers.Add(sessionId, backEndServerReadWaitHandler);

                bool success = _backendServerConnector.GetNewTempDeviceId(sessionId);
                if (success)
                {
                    Console.WriteLine("No connection to backend server");
                    return "Backendserver error";
                }

                backEndServerReadWaitHandler.WaitForResponse();
                var response = (string)backEndServerReadWaitHandler.ReturnValue;

                _dictBackendServerWaitHandlers.Remove(sessionId);
                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw ex;
            }
        }
    }
}

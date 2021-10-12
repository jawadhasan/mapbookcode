using System;
using System.Collections.Generic;
using System.Text;

namespace MappingAppBackend.BackendServer
{
    public class ClientMessage
    {
        public string ClientId { get; set; }
        public string ClientReturnGuid { get; set; }
        public string ServerPublishingGuid { get; set; }
        public string ServerListeningGuid { get; set; }
    }
}

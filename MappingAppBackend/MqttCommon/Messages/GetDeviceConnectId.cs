namespace MqttCommon.Messages
{
    public class GetDeviceConnectId : CommandBase
    {
        public string SessionIdentifier { get; set; }

        public GetDeviceConnectId(string sessionIdentifier)
            :base(CommandIdentifier.CmdGetDeviceConnectIdRequest, CommandCategory.WebApi)
        {
            SessionIdentifier = sessionIdentifier;
        }
    }
}

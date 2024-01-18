namespace MqttCommon.Messages
{
    public enum CommandCategory
    {
        Reserve = 1,
        Location = 2,
        Reserve2 = 3,
        VehicleMobile = 4,
        WebApi = 5,
        Test = 6,
        FileTransfer = 7,
    }

    public enum CommandIdentifier
    {
        CmdGetDeviceConnectIdRequest = 1,
        CmdSendMessageToVehicleMobile = 2,
        CmdWebApiClientInit = 3,
    }
}

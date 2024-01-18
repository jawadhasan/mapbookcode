namespace MqttCommon.Messages
{
    public class CommandBase
    {
        public CommandIdentifier CommandIdentifier { get; private set; }
        public CommandCategory CommandCategory { get; private set; }

        public CommandBase(CommandIdentifier commandIdentifier, CommandCategory commandCategory)
        {
            CommandIdentifier = commandIdentifier;
            CommandCategory = commandCategory;
        }
    }
}

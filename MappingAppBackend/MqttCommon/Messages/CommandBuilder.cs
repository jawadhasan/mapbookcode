using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace MqttCommon.Messages
{
    public class CommandBuilder
    {
        public static byte[] BuildTransferData(CommandBase cmd)
        {
            var jsonData = GetJsonData(cmd);
            var data = Encoding.UTF8.GetBytes(jsonData);
            List<byte> result = new List<byte>
            {               
                (byte) cmd.CommandCategory,
                (byte) cmd.CommandIdentifier
            };
            result.AddRange(data);
            return result.ToArray();
        }

        private static string GetJsonData(CommandBase cmd)
        {
            string json = JsonConvert.SerializeObject(cmd, Formatting.None);
            return json;
        }
    }
}

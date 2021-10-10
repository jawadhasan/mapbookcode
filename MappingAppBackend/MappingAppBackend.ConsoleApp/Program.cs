using MappingAppBackend.BackendServer;
using System;

namespace MappingAppBackend.ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {

            Console.WriteLine("ConsoleApp");

            var testMqttClient = new TestMqttClient();
            testMqttClient.Start();

            Console.WriteLine("Press key to stop the testMqttClient");
            
            Console.ReadLine();
            testMqttClient.Stop();

            Console.WriteLine("Press key to exit the ConsoleApp");
            Console.ReadLine();
        }
    }
}

using System;
using System.Threading;

namespace RegistrationConsole
{
    public class BackendServerWaitHandler
    {
        public ManualResetEvent ManualResetEvent { get; }
        public object ReturnValue { get; set; }

        public BackendServerWaitHandler()
        {
            ManualResetEvent = new ManualResetEvent(false);
        }
        public void WaitForResponse()
        {
            ManualResetEvent.WaitOne(TimeSpan.FromSeconds(10));
        }

        public void CancelWait(object returnValue)
        {
            ReturnValue = returnValue;
            ManualResetEvent.Set();
        }
    }
}

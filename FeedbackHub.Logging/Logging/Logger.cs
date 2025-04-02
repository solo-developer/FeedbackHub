using Microsoft.Extensions.Configuration;
using Serilog;
using Serilog.Core;
using Serilog.Events;
using Serilog.Formatting.Json;

namespace FeedbackHub.Logging
{
    public static class SerilogLogger
    {
        public static Logger? Logger { get; private set; }

        public static void ConfigureLogger(IConfiguration configuration)
        {
            Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(configuration)
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
                .CreateLogger();

            Log.Logger = Logger;
        }
    }

}

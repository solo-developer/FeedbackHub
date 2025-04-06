using FeedbackHub.Server.Enums;
using System.Text.Json;

namespace FeedbackHub.Server.Helpers
{
    public class JsonWrapper
    {
        public static string BuildSuccessJson(object data)
        {
            var apiData = new { ResponseMessageType = ResponseMessageType.Success.ToString(), Message = string.Empty, Data = data };
            return JsonSerializer.Serialize(apiData);
        }
        public static string BuildSuccessJson(string message)
        {
            var apiData = new { ResponseMessageType = ResponseMessageType.Success.ToString(), Message = message, Data = new { } };
            return JsonSerializer.Serialize(apiData);
        }

        public static string BuildErrorJson(string error)
        {
            var apiMessage = new { ResponseMessageType = ResponseMessageType.Error.ToString(), Message = error };
            return JsonSerializer.Serialize(apiMessage);
        }

        public static string BuildInfoJson(string info)
        {
            var apiMessage = new { ResponseMessageType = ResponseMessageType.Info.ToString(), Message = info };
            return JsonSerializer.Serialize(apiMessage);
        }
    }
}

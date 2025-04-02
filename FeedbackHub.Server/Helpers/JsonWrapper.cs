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

        public static string BuildErrorJson(string error)
        {
            var apiMessage = new { ResponseMessageType = ResponseMessageType.Success.ToString(), Message = error };
            return JsonSerializer.Serialize(apiMessage);
        }

        public static string BuildInfoJson(string info)
        {
            var apiMessage = new { ResponseMessageType = ResponseMessageType.Success.ToString(), Message = info };
            return JsonSerializer.Serialize(apiMessage);
        }
    }
}

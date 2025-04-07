using FeedbackHub.Server.Enums;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace FeedbackHub.Server.Helpers
{
    public static class ApiResponse
    {
        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
           // PropertyNamingPolicy = JsonNamingPolicy.P,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            WriteIndented = EnvironmentExtensions.IsDevelopment()
        };

        public record ApiResponseBase<T>(
            [property: JsonConverter(typeof(JsonStringEnumConverter))]
            ResponseMessageType ResponseMessageType,
            string? Message = null,
            T? Data = default);

        // Success responses
        public static IActionResult Success<T>(T data) =>
            new JsonResult(
                new ApiResponseBase<T>(ResponseMessageType.Success, Data: data),
                _jsonOptions);

        public static IActionResult Success(string message) =>
            new JsonResult(
                new ApiResponseBase<object>(ResponseMessageType.Success, message),
                _jsonOptions);

        public static IActionResult Success<T>(T data, string message) =>
            new JsonResult(
                new ApiResponseBase<T>(ResponseMessageType.Success, message, data),
                _jsonOptions);

        // Error responses
        public static IActionResult Error(string errorMessage, object? additionalData = null) =>
            new JsonResult(
                new ApiResponseBase<object>(ResponseMessageType.Error, errorMessage, additionalData),
                _jsonOptions)
            {
                StatusCode = StatusCodes.Status400BadRequest
            };

        // Info responses
        public static IActionResult Info(string infoMessage, object? data = null) =>
            new JsonResult(
                new ApiResponseBase<object>(ResponseMessageType.Info, infoMessage, data),
                _jsonOptions);

    }

    public static class EnvironmentExtensions
    {
        public static bool IsDevelopment() =>
            Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
    }
}

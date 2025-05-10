using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace FeedbackHub.Server.Endpoints
{
    public static class ApiHandler
    {
        public static async Task<IActionResult> HandleAsync<T>(
            Func<Task<T>> action,
            string errorMessage = "An unexpected error occurred.")
        {
            try
            {
                var result = await action();
                return ApiResponse.Success(result);
            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error(errorMessage, ex);
                return ApiResponse.Error(errorMessage);
            }
        }
    }

}

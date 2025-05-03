using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Extensions;
using FeedbackHub.Server.Helpers;
using FeedbackHub.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace FeedbackHub.Server.Endpoints.Feedback
{
    [Authorize]
    public class OpenFeedbacksEndpoint : EndpointBaseAsync.WithRequest<FeedbackFilterDto>.WithResult<IActionResult>
    {
        private readonly IUserContext _userContext;
        private readonly IFeedbackService _feedbackService;
        public OpenFeedbacksEndpoint(IUserContext userContext, IFeedbackService feedbackService)
        {
            _userContext = userContext;
            _feedbackService = feedbackService;
        }

        [HttpPost("/feedbacks/open")]
        public override async Task<IActionResult> HandleAsync(FeedbackFilterDto request, CancellationToken cancellationToken = default)
        {
            try
            {
                request.Status = Domain.Enums.TicketStatus.Open;

                var feedbacks = await _feedbackService.GetAsync(request.ToGenericDto(_userContext));

                return ApiResponse.Success(feedbacks);

            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to get open feedbacks", ex);
            }
            return ApiResponse.Error("Failed to get open feedbacks");
        }
    }
}

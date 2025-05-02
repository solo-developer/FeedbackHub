using Microsoft.AspNetCore.Http;

namespace FeedbackHub.Domain.Services.Interface
{
    public interface IAttachmentService
    {
        Task SaveAsync(int feedbackId, List<IFormFile> files);
    }
}

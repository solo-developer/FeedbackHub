using Microsoft.AspNetCore.Http;

namespace FeedbackHub.Domain.Services.Interface
{
    public interface IAttachmentService
    {
        Task SaveAsync(int feedbackId, int createdBy, List<IFormFile> files);

        Task RemoveAsync(string identifier);
    }
}

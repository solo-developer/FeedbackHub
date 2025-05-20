using Microsoft.AspNetCore.Http;

namespace FeedbackHub.Domain.Helpers
{
    public interface IFileHelper
    {
        Task<string> SaveFileAsync(IFormFile file, string folderPath, string? attachmentIdentifier=null);
        Task<bool> DeleteFileAsync(string folderPath, string fileName);
        Task<string> CompressFileAsync(string filePath);

        string GetBasePath();

        string GetBase64StringOfImageFile(string folder, string identifier);
    }
}

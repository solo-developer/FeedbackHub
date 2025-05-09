using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Helpers;
using FeedbackHub.Server.Extensions;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace FeedbackHub.Server.Endpoints.Attachment
{
    [Authorize]
    public class DownloadAttachmentEndpoint : EndpointBaseSync.WithRequest<string>.WithResult<IActionResult>
    {
        private readonly IFileHelper _fileHelper;
        public DownloadAttachmentEndpoint(IFileHelper fileHelper)
        {
            _fileHelper = fileHelper;
        }

        [HttpGet("/attachments/{identifier}/download")]
        public override IActionResult Handle(string identifier)
        {
            try
            {
                var filePath = _fileHelper.GetBasePath();

                var file = Path.Combine(filePath, "feedbacks", identifier);

                if (!System.IO.File.Exists(file))
                    return NotFound();

                var contentType = GetContentType(file); // or use a fixed one like "application/octet-stream"
                var fileBytes = System.IO.File.ReadAllBytes(file);
                return File(fileBytes, contentType, Path.GetFileName(file));


            }
            catch (CustomException ex)
            {
                return BadRequest();
            }
            catch (Exception ex)
            {
                Log.Error("Failed to get feedbacks", ex);
            }
            return BadRequest();
        }
        private string GetContentType(string path)
        {
            var types = new Dictionary<string, string>
    {
        { ".txt", "text/plain" },
        { ".pdf", "application/pdf" },
        { ".doc", "application/msword" },
        { ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
        { ".xls", "application/vnd.ms-excel" },
        { ".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
        { ".png", "image/png" },
        { ".jpg", "image/jpeg" },
        { ".jpeg", "image/jpeg" }
        // Add more as needed
    };

            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types.TryGetValue(ext, out var type) ? type : "application/octet-stream";
        }

    }
}

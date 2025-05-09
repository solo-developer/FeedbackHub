using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.IO.Compression;

namespace FeedbackHub.Domain.Helpers
{
    public class FileHelper : IFileHelper
    {
        private readonly string _attachmentBasePath;
        public FileHelper(IOptions<FileStorageOptions> options)
        {
            _attachmentBasePath = options.Value.BaseFolderPath;
        }
        public async Task<string> SaveFileAsync(IFormFile file, string folderPath, string? attachmentIdentifier = null)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is null or empty.");

            Directory.CreateDirectory(folderPath);

            if (string.IsNullOrEmpty(attachmentIdentifier))
                attachmentIdentifier = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";

            if (!Directory.Exists(Path.Combine(_attachmentBasePath, folderPath)))
            {
                Directory.CreateDirectory(Path.Combine(_attachmentBasePath, folderPath));
            }
            var fullPath = Path.Combine(_attachmentBasePath, folderPath, attachmentIdentifier!);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return attachmentIdentifier;
        }

        public async Task<bool> DeleteFileAsync(string folderPath, string fileName)
        {
            var filePath = Path.Combine(_attachmentBasePath, folderPath, fileName);

            if (!File.Exists(filePath))
                return false;

            try
            {
                await Task.Run(() => File.Delete(filePath));
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<string> CompressFileAsync(string filePath)
        {
            if (!File.Exists(filePath))
                throw new FileNotFoundException("File not found to compress", filePath);

            var zipPath = $"{filePath}.zip";

            using (var zipStream = new FileStream(zipPath, FileMode.Create))
            using (var archive = new ZipArchive(zipStream, ZipArchiveMode.Create, leaveOpen: false))
            {
                var entry = archive.CreateEntry(Path.GetFileName(filePath));

                using var entryStream = entry.Open();
                using var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

                await fileStream.CopyToAsync(entryStream);
            }

            return zipPath;
        }

        public string GetBasePath() => _attachmentBasePath;
    }
}

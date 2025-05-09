using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Helpers;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Http;
using System.Transactions;

namespace FeedbackHub.Domain.Services.Implementations
{
    public class AttachmentService : IAttachmentService
    {
        private const string _feedbackPath = "feedbacks";
        private readonly IFileHelper _fileHelper;
        private readonly IBaseRepository<Attachment> _attachmentRepo;
        public AttachmentService(IFileHelper fileHelper, IBaseRepository<Attachment> attachmentRepo)
        {
            _fileHelper = fileHelper;
            _attachmentRepo = attachmentRepo;
        }

        public async Task SaveAsync(int feedbackId, int createdBy, List<IFormFile> files)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                foreach (var file in files)
                {
                    var attachment = new Attachment(feedbackId, createdBy, file);

                    await _attachmentRepo.InsertAsync(attachment);

                    await _fileHelper.SaveFileAsync(file, _feedbackPath, attachment.AttachmentIdentifier);
                }
                tx.Complete();
            }
        }

        public string GetBasePath() => Path.Combine(_fileHelper.GetBasePath(), _feedbackPath);

        public async Task RemoveAsync(string identifier)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var attachment = await _attachmentRepo.FindAsync(a => a.AttachmentIdentifier.Equals(identifier)) ?? throw new ItemNotFoundException("Attachment not found");

                await _attachmentRepo.DeleteAsync(attachment);

                await _fileHelper.DeleteFileAsync(_feedbackPath, attachment.AttachmentIdentifier);

                tx.Complete();
            }
        }
    }
}

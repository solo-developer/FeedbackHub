namespace FeedbackHub.Domain.Dto.User
{
    public class ChangePasswordDto
    {
        public required string CurrentPassword { get; set; }
        public required string NewPassword { get; set; }
        public required string ConfirmPassword { get; set; }

        public bool IsPasswordMatch => NewPassword.Equals(ConfirmPassword);
    }
}

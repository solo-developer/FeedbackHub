using System.Text;

namespace FeedbackHub.Domain.Helpers
{
    public static class PasswordGenerator
    {
        private static readonly Random random = new Random();

        public static string GeneratePassword(int length = 8)
        {
            if (length < 6)
                throw new ArgumentException("Password length must be at least 6 characters.");

            const string uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lowercase = "abcdefghijklmnopqrstuvwxyz";
            const string digits = "0123456789";
            const string specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

            // Ensure the password has at least one of each
            var password = new StringBuilder();
            password.Append(uppercase[random.Next(uppercase.Length)]);
            password.Append(lowercase[random.Next(lowercase.Length)]);
            password.Append(digits[random.Next(digits.Length)]);
            password.Append(specialChars[random.Next(specialChars.Length)]);

            // Fill the rest randomly
            string allChars = uppercase + lowercase + digits + specialChars;
            for (int i = password.Length; i < length; i++)
            {
                password.Append(allChars[random.Next(allChars.Length)]);
            }

            // Shuffle the password so the first characters are not predictable
            return new string(password.ToString().OrderBy(x => random.Next()).ToArray());
        }
    }
}

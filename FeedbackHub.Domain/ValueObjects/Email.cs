namespace FeedbackHub.Domain.ValueObjects
{
    public sealed class Email : IEquatable<Email>
    {
        protected Email()
        {
            
        }
        public string Value { get; }

        private Email(string value) => Value = value;

        public static Email Create(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty");

            if (!IsValidEmail(email))
                throw new ArgumentException("Email is invalid", nameof(email));

            return new Email(email.ToLowerInvariant().Trim());
        }

        private static bool IsValidEmail(string email)
        {
            try
            {
                var mailAddress = new System.Net.Mail.MailAddress(email);
                return mailAddress.Address == email;
            }
            catch
            {
                return false;
            }
        }

        // Equality implementations
        public bool Equals(Email? other) => other?.Value == Value;
        public override bool Equals(object? obj) => obj is Email other && Equals(other);
        public override int GetHashCode() => Value.GetHashCode();
        public static bool operator ==(Email left, Email right) => left.Equals(right);
        public static bool operator !=(Email left, Email right) => !(left == right);

        public override string ToString() => Value;
    }
}

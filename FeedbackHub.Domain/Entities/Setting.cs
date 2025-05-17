namespace FeedbackHub.Domain.Entities
{
    public class Setting : BaseEntity
    {
        protected Setting()
        {

        }

        public Setting(string key, string value, string group)
        {
            Key = key;
            Value = value;
            Group = group;
        }

        public string Key { get; set; }
        public string Value { get; set; }

        public string Group { get; set; }
    }
}

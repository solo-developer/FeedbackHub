using FeedbackHub.Domain.Dto;

namespace FeedbackHub.Domain
{
    public static class EnumExtensions
    {
        public static List<EnumOptionDto> ToOptions<TEnum>() where TEnum : Enum
        {
            return Enum.GetValues(typeof(TEnum))
                       .Cast<TEnum>()
                       .Select(e => new EnumOptionDto
                       {
                           Label = e.ToString(),
                           Value = Convert.ToInt32(e)
                       })
                       .ToList();
        }
    }
}

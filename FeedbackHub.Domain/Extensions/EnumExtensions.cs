using FeedbackHub.Domain.Dto;
using System.ComponentModel.DataAnnotations;

namespace FeedbackHub.Domain.Extensions
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

        public static string GetDisplayName(this Enum enumValue)
        {
            return enumValue.GetType()
                            .GetField(enumValue.ToString())
                            ?.GetCustomAttributes(typeof(DisplayAttribute), false)
                            is DisplayAttribute[] attrs && attrs.Length > 0
                ? attrs[0].Name
                : enumValue.ToString();
        }
    }
}

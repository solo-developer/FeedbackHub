using System.ComponentModel.DataAnnotations;

namespace FeedbackHub.Domain.Enums
{
    public enum RegistrationRequestState
    {
        [Display(Name = "User Converted Requests")]
        ConvertedToUser = 1,

        [Display(Name = "UnConverted Requests")]
        UnconvertedRequest = 2
    }
}

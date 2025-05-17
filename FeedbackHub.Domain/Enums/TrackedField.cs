using System.ComponentModel.DataAnnotations;

namespace FeedbackHub.Domain.Enums
{
    public enum TrackedField
    {
        [Display(Name = "Title")]
        Title,

        [Display(Name = "Description")]
        Description,

        [Display(Name = "Priority Level")]
        Priority,

        [Display(Name = "Feedback Type")]
        FeedbackTypeId,

        [Display(Name = "Status")]
        Status
    }
}

using System.ComponentModel.DataAnnotations;

namespace FeedbackHub.Domain.Enums
{
    public enum FeedbackLinkType
    {
        [Display(Name = "Relates To")]
        RelatesTo = 1,

        [Display(Name = "Duplicate Of")]
        DuplicateOf = 2,

        [Display(Name = "Is Duplicate")]
        IsDuplicate = 3,

        [Display(Name = "Blocks")]
        Blocks = 4,

        [Display(Name = "Is Blocked By")]
        IsBlockedBy = 5,

        [Display(Name = "Parent Of")]
        ParentOf = 6,

        [Display(Name = "Child Of")]
        ChildOf = 7,

        [Display(Name = "Caused By")]
        CausedBy = 8,

        [Display(Name = "Fixes")]
        Fixes = 9,

        [Display(Name = "Depends On")]
        DependsOn = 10,

        [Display(Name = "Implemented In")]
        ImplementedIn = 11
    }
}

using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Extensions;

namespace FeedbackHub.Domain.Helpers
{
    public static class FeedbackLinkTypeHelper
    {
        public static readonly Dictionary<FeedbackLinkType, FeedbackLinkType> InverseLinkTypes = new()
    {
        { FeedbackLinkType.RelatesTo, FeedbackLinkType.RelatesTo },
        { FeedbackLinkType.DuplicateOf, FeedbackLinkType.IsDuplicate },
        { FeedbackLinkType.IsDuplicate, FeedbackLinkType.DuplicateOf },
        { FeedbackLinkType.Blocks, FeedbackLinkType.IsBlockedBy },
        { FeedbackLinkType.IsBlockedBy, FeedbackLinkType.Blocks },
        { FeedbackLinkType.ParentOf, FeedbackLinkType.ChildOf },
        { FeedbackLinkType.ChildOf, FeedbackLinkType.ParentOf },
        { FeedbackLinkType.CausedBy, FeedbackLinkType.Fixes },
        { FeedbackLinkType.Fixes, FeedbackLinkType.CausedBy },
        { FeedbackLinkType.DependsOn, FeedbackLinkType.ImplementedIn },
        { FeedbackLinkType.ImplementedIn, FeedbackLinkType.DependsOn }
    };


        public static string GetLinkDisplayName(FeedbackLinkType type, bool isIncoming)
        {
            if (isIncoming && FeedbackLinkTypeHelper.InverseLinkTypes.TryGetValue(type, out var inverse))
            {
                return inverse.GetDisplayName();
            }

            return type.GetDisplayName();
        }

    }
}

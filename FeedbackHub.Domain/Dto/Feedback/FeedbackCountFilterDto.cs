using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Dto.Feedback
{
    public class FeedbackCountFilterDto
    {
        private GroupedDate _dateRange;
        public GroupedDate DateRange
        {
            get => _dateRange;
            set
            {
                _dateRange = value;
                switch (value)
                {
                    case GroupedDate.today:
                        FromDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-1));
                        ToDate = DateOnly.FromDateTime(DateTime.Today);
                        break;
                    case GroupedDate.last7:
                        FromDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-7));
                        ToDate = DateOnly.FromDateTime(DateTime.Today);
                        break;
                    case GroupedDate.last15:
                        FromDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-15));
                        ToDate = DateOnly.FromDateTime(DateTime.Today);
                        break;
                    case GroupedDate.last30:
                        FromDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-30));
                        ToDate = DateOnly.FromDateTime(DateTime.Today);
                        break;
                    default:
                        throw new ArgumentOutOfRangeException(nameof(value), value, null);
                }
            }
        }

        public DateOnly FromDate { get; private set; }
        public DateOnly ToDate { get; private set; }
    }
}

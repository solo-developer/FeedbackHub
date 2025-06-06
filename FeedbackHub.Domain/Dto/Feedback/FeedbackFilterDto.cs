﻿using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Dto
{
    public class FeedbackFilterDto
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int Skip { get; set; } = 0;
        public int Take { get; set; } = 20;

        public string? Search { get; set; }
        public TicketStatus? Status { get; set; }

        public int? FeedbackTypeId { get; set; }
        public bool IsForExport { get; set; } = false;
    }

    public class AdminFeedbackFilterDto : FeedbackFilterDto
    {
        public int? ClientId { get; set; }

        public int? ApplicationId { get; set; }

        public int? UserId { get; set;}
    }

    public class BoardFeedbackFilterDto
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

}

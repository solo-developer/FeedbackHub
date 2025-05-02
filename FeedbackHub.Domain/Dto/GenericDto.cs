using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FeedbackHub.Domain.Dto
{
    public class GenericDto<T> where T : class
    {
        public int LoggedInUserId { get; set; }
        public int? ApplicationId { get; set; }
        public T Model { get; set; }
    }
}

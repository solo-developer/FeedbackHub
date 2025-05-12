import { BoardFeedbackDetailDto } from "../types/feedback/BoardFeedbackDto";

type FeedbackCardProps = {
  feedback: BoardFeedbackDetailDto;
};

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  return (
    <div
      className="card mb-2"
      style={{
        cursor: 'pointer',
        borderLeft: `5px solid ${feedback.FeedbackType.Color}`,
        borderRadius: '4px',
      }}
      onClick={() => window.open(`/feedback/${feedback.Id}`, '_blank', 'noopener,noreferrer')}
    >
      <div className="card-body">
        <h6 className="card-title">{feedback.Title}</h6>
        <p className="card-text">{feedback.RaisedBy}</p>
      </div>
    </div>
  );
};

export default FeedbackCard;
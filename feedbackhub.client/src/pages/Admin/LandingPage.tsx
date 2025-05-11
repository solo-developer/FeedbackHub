import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { filterLabels, FilterOption } from '../../types/feedback/DateFilterRange';
import { FeedbackCountDto } from '../../types/feedback/FeedbackCount';
import { getFeedbacksCountAsync } from '../../services/FeedbackService';
import { useToast } from '../../contexts/ToastContext';
import { TicketStatus } from '../../types/feedback/TicketStatus'; // Import the TicketStatus enum

const LandingPage: React.FC = () => {
  const [filter, setFilter] = useState<FilterOption>('today');
  const [stats, setStats] = useState<FeedbackCountDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getFeedbacksCountAsync(filter);
        if (response.Success) {
          setStats(response.Data);
        } else {
          showToast(response.Message, response.ResponseType, {
            autoClose: 3000,
            draggable: true,
          });
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [filter]);

  // Update to use TicketStatus enum
  const getCount = (status: TicketStatus) =>
    stats.find((s) => s.Status === status)?.Count || 0;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-end mb-4">
        <div className="w-25">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterOption)}
          >
            {Object.entries(filterLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="text-center text-muted">Loading ticket stats...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {!loading && !error && (<>
        <div className="row g-4">
          {/* Tickets Raised */}
          <div className="col-md-3">
            <div className="card border-primary shadow-sm">
              <div className="card-body text-primary">
                <h5 className="card-title">Tickets Open</h5>
                <p className="display-6 fw-semibold">{getCount(TicketStatus.Open)}</p>
              </div>
            </div>
          </div>

          {/* Tickets Resolved */}
          <div className="col-md-3">
            <div className="card border-success shadow-sm">
              <div className="card-body text-success">
                <h5 className="card-title">Tickets Resolved</h5>
                <p className="display-6 fw-semibold">{getCount(TicketStatus.Resolved)}</p>
              </div>
            </div>
          </div>

          {/* Tickets Closed */}
          <div className="col-md-3">
            <div className="card border-secondary shadow-sm">
              <div className="card-body text-secondary">
                <h5 className="card-title">Tickets Closed</h5>
                <p className="display-6 fw-semibold">{getCount(TicketStatus.Closed)}</p>
              </div>
            </div>
          </div>

          {/* Tickets Rejected */}
          <div className="col-md-3">
            <div className="card border-danger shadow-sm">
              <div className="card-body text-danger">
                <h5 className="card-title">Tickets Rejected</h5>
                <p className="display-6 fw-semibold">{getCount(TicketStatus.Declined)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='row g-4 mt-2'>
          <div className="col-md-3">
            <div className="card border-warning shadow-sm">
              <div className="card-body text-warning">
                <h5 className="card-title">Tickets Put On Hold</h5>
                <p className="display-6 fw-semibold">{getCount(TicketStatus.OnHold)}</p>
              </div>
            </div>
          </div>
        </div>
      </>
      )}
    </div>
  );
};

export default LandingPage;

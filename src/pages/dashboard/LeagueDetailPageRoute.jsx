import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LeagueDetailPage, PendingApprovalPage } from '../../components/features/dashboard';
import { LeagueDetailSkeleton } from '../../components/ui';
import { PageHead } from '../../components/common';
import DataService from '../../utils/api/dataService';

const LeagueDetailPageRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [league, setLeague] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Fetch league data
  React.useEffect(() => {
    const fetchLeague = async () => {
      try {
        setLoading(true);
        const leagueData = await DataService.getLeague(id);
        if (leagueData) {
          setLeague(leagueData);
        } else {
          setError('League not found');
        }
      } catch (err) {
        console.error('Error fetching league:', err);
        setError('Failed to load league');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLeague();
    } else {
      setError('No league ID provided');
      setLoading(false);
    }
  }, [id]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  // Show pending approval page if user is not approved
  if (user?.status === 'PENDING') {
    return <PendingApprovalPage user={user} />;
  }

  if (loading) {
    return <LeagueDetailSkeleton />;
  }

  if (error || !league) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'League Not Found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {error === 'League not found' 
              ? "We couldn't find the league you're looking for. It might have been moved or doesn't exist."
              : "There was an error loading the league. Please try again later."
            }
          </p>
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 bg-[#FFDE59] text-gray-900 rounded-lg hover:bg-[#FFD700] transition-colors duration-200 font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead 
        title={`${league.title} - Dashboard`}
        description={`Learn and track progress in ${league.title}. Access course materials, complete assignments, and compete with fellow students.`}
        keywords={`${league.title}, course progress, learning materials, assignments, student competition`}
      />
      <LeagueDetailPage 
        league={league} 
        onBack={handleBack}
      />
    </>
  );
};

export default LeagueDetailPageRoute;

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LearningProgressSection, PendingApprovalPage } from '../../components/features/dashboard';
import { PageHead } from '../../components/common';

const DashboardMainPage = () => {
  const { user } = useAuth();

  // Show pending approval page if user is not approved
  if (user?.status === 'PENDING') {
    return <PendingApprovalPage user={user} />;
  }

  // Show pending approval page if user is not approved
  if (user?.status === 'PENDING') {
    return <PendingApprovalPage user={user} />;
  }

  return (
    <>
      <PageHead 
        title="Dashboard"
        description="Access your personalized OpenLearn dashboard. Track learning progress, view achievements, manage assignments, and compete in leagues with fellow NIT Jalandhar students."
        keywords="student dashboard, learning progress, achievements, assignments, league competition, personal learning"
      />
      <LearningProgressSection user={user} />
    </>
  );
};

export default DashboardMainPage;

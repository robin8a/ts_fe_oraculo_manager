import React from 'react';
import { useProjectTreeFeature } from '../../hooks/useProjectTreeFeature';
import { ProjectTreeView } from '../../components/ProjectTreeView';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export const ProjectTreeFeatureView: React.FC = () => {
  const { projects, loading, error, refetch } = useProjectTreeFeature();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Projects & Trees</h1>
        <p className="mt-2 text-sm text-gray-600">
          Explore projects, their associated trees, and features through a hierarchical drill-down
          view. All trees are loaded automatically with pagination (100 per page).
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={() => refetch()}
                className="mt-3 text-sm font-medium text-red-800 hover:text-red-900 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tree View */}
      {!error && <ProjectTreeView projects={projects} loading={loading} />}
    </div>
  );
};


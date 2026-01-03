import React, { useState } from 'react';
import { useProjectTreeFeature } from '../../hooks/useProjectTreeFeature';
import { ProjectTreeView } from '../../components/ProjectTreeView';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export const ProjectTreeFeatureView: React.FC = () => {
  const [treeLimit, setTreeLimit] = useState<number | undefined>(undefined);
  const { projects, loading, error, refetch } = useProjectTreeFeature(treeLimit);

  const handleTreeLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setTreeLimit(value === 'all' ? undefined : parseInt(value, 10));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Projects & Trees</h1>
        <p className="mt-2 text-sm text-gray-600">
          Explore projects, their associated trees, and features through a hierarchical drill-down
          view.
        </p>
        
        {/* Tree Limit Control */}
        <div className="mt-4 flex items-center gap-3">
          <label htmlFor="treeLimit" className="text-sm font-medium text-gray-700">
            Trees per Project:
          </label>
          <select
            id="treeLimit"
            value={treeLimit === undefined ? 'all' : treeLimit.toString()}
            onChange={handleTreeLimitChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="all">All</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
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


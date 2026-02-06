import React, { useMemo, useState } from 'react';
import { useProjectTreeFeature } from '../../hooks/useProjectTreeFeature';
import type { ProjectWithTrees, TreeWithFeatures, FeatureInfo } from '../../types/projectTreeFeature';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DuplicatedFeature {
  feature: FeatureInfo;
  totalCount: number;
  toRemove: number;
}

interface TreeWithDuplicates {
  projectId: string;
  projectName: string;
  tree: TreeWithFeatures;
  duplicatedFeatures: DuplicatedFeature[];
}

function computeTreesWithDuplicates(projects: ProjectWithTrees[]): TreeWithDuplicates[] {
  const result: TreeWithDuplicates[] = [];
  for (const project of projects) {
    for (const tree of project.trees) {
      const duplicatedFeatures: DuplicatedFeature[] = [];
      for (const feature of tree.features) {
        const count = feature.rawData?.length ?? 0;
        if (count > 1) {
          duplicatedFeatures.push({
            feature,
            totalCount: count,
            toRemove: count - 1,
          });
        }
      }
      if (duplicatedFeatures.length > 0) {
        result.push({
          projectId: project.id,
          projectName: project.name,
          tree,
          duplicatedFeatures,
        });
      }
    }
  }
  return result;
}

export const DuplicateFeaturesView: React.FC = () => {
  const { projects, loading, error, refetch } = useProjectTreeFeature();
  const [selectedTreeIds, setSelectedTreeIds] = useState<Set<string>>(new Set());

  const treesWithDuplicates = useMemo(
    () => computeTreesWithDuplicates(projects),
    [projects]
  );

  const toggleTree = (treeId: string) => {
    setSelectedTreeIds((prev) => {
      const next = new Set(prev);
      if (next.has(treeId)) next.delete(treeId);
      else next.add(treeId);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedTreeIds.size === treesWithDuplicates.length) {
      setSelectedTreeIds(new Set());
    } else {
      setSelectedTreeIds(new Set(treesWithDuplicates.map((t) => t.tree.id)));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading projects and trees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Duplicate features</h1>
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Duplicate features</h1>
        <p className="mt-2 text-gray-600">
          Trees that have the same feature repeated (multiple RawData entries per feature). Shown below: for each tree, the duplicated features and their counts. You can select trees and remove the extra entries, keeping one per feature.
        </p>
      </div>

      {treesWithDuplicates.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
          No trees with duplicated features found.
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTreeIds.size === treesWithDuplicates.length && treesWithDuplicates.length > 0}
                onChange={selectAll}
                className="rounded border-gray-300"
              />
              Select all ({treesWithDuplicates.length} trees)
            </label>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {treesWithDuplicates.map(({ projectId, projectName, tree, duplicatedFeatures }) => {
                const isSelected = selectedTreeIds.has(tree.id);
                const totalToRemove = duplicatedFeatures.reduce((s, d) => s + d.toRemove, 0);
                return (
                  <li key={tree.id} className="bg-white">
                    <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleTree(tree.id)}
                        className="mt-1 rounded border-gray-300"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">
                          {projectName} / {tree.name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {duplicatedFeatures.length} duplicated feature{duplicatedFeatures.length !== 1 ? 's' : ''} · {totalToRemove} entries to remove
                        </div>
                        <ul className="mt-2 space-y-1 text-sm text-gray-700">
                          {duplicatedFeatures.map(({ feature, totalCount, toRemove }) => (
                            <li key={feature.id}>
                              {feature.name}: {totalCount} entries — keep 1, remove {toRemove}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {selectedTreeIds.size > 0 && (
            <p className="text-sm text-gray-600">
              {selectedTreeIds.size} tree(s) selected. Delete-duplicates action can be added here to remove extra RawData for selected trees.
            </p>
          )}
        </>
      )}
    </div>
  );
};

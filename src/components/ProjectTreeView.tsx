import React, { useState } from 'react';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon,
  DocumentIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import type { ProjectWithTrees, TreeWithFeatures, FeatureInfo } from '../types/projectTreeFeature';

interface ProjectTreeViewProps {
  projects: ProjectWithTrees[];
  loading: boolean;
}

export const ProjectTreeView: React.FC<ProjectTreeViewProps> = ({ projects, loading }) => {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedTrees, setExpandedTrees] = useState<Set<string>>(new Set());

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const toggleTree = (treeId: string) => {
    const newExpanded = new Set(expandedTrees);
    if (newExpanded.has(treeId)) {
      newExpanded.delete(treeId);
    } else {
      newExpanded.add(treeId);
    }
    setExpandedTrees(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects and trees...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No projects found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 space-y-1">
        {projects.map((project) => {
          const isProjectExpanded = expandedProjects.has(project.id);
          const hasTrees = project.trees.length > 0;

          return (
            <div key={project.id} className="select-none">
              {/* Project Level */}
              <div
                className={`
                  flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors
                  ${isProjectExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'}
                `}
                onClick={() => hasTrees && toggleProject(project.id)}
              >
                <div className="flex items-center flex-1 min-w-0">
                  {hasTrees ? (
                    isProjectExpanded ? (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    )
                  ) : (
                    <div className="w-5 mr-2" />
                  )}
                  <FolderIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{project.name}</div>
                    <div className="text-sm text-gray-500">
                      Status: {project.status}
                      {hasTrees && (
                        <span className="ml-2">
                          ({project.trees.length} {project.trees.length === 1 ? 'tree' : 'trees'})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trees Level */}
              {isProjectExpanded && hasTrees && (
                <div className="ml-8 mt-1 space-y-1">
                  {project.trees.map((tree) => {
                    const isTreeExpanded = expandedTrees.has(tree.id);
                    const hasFeatures = tree.features.length > 0;

                    return (
                      <div key={tree.id} className="select-none">
                        <div
                          className={`
                            flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors
                            ${isTreeExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'}
                          `}
                          onClick={() => hasFeatures && toggleTree(tree.id)}
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            {hasFeatures ? (
                              isTreeExpanded ? (
                                <ChevronDownIcon className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                              ) : (
                                <ChevronRightIcon className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                              )
                            ) : (
                              <div className="w-4 mr-2" />
                            )}
                            <DocumentIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-800 truncate">
                                {tree.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {tree.status && `Status: ${tree.status}`}
                                {hasFeatures && (
                                  <span className="ml-2">
                                    ({tree.features.length}{' '}
                                    {tree.features.length === 1 ? 'feature' : 'features'})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Features Level */}
                        {isTreeExpanded && hasFeatures && (
                          <div className="ml-8 mt-1 space-y-1">
                            {tree.features.map((feature) => (
                              <div
                                key={feature.id}
                                className="flex items-center px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                              >
                                <CubeIcon className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm text-gray-700 truncate">
                                    {feature.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {feature.feature_type && (
                                      <span className="mr-2">Type: {feature.feature_type}</span>
                                    )}
                                    {feature.feature_group && (
                                      <span>Group: {feature.feature_group}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


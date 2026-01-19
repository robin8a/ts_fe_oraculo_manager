import React, { useState } from 'react';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon,
  DocumentIcon,
  CubeIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import type { ProjectWithTrees } from '../types/projectTreeFeature';
import { downloadAudioFileFromS3, isAudioS3Url } from '../services/storageService';

interface ProjectTreeViewProps {
  projects: ProjectWithTrees[];
  loading: boolean;
}

export const ProjectTreeView: React.FC<ProjectTreeViewProps> = ({ projects, loading }) => {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedTrees, setExpandedTrees] = useState<Set<string>>(new Set());
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());

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

  const toggleFeature = (featureId: string, treeId: string) => {
    const key = `${treeId}-${featureId}`;
    const newExpanded = new Set(expandedFeatures);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedFeatures(newExpanded);
  };

  const handleDownloadAudio = async (rawDataId: string, s3Url: string, rawDataName: string) => {
    // Prevent multiple simultaneous downloads of the same file
    if (downloadingFiles.has(rawDataId)) {
      return;
    }

    try {
      setDownloadingFiles((prev) => new Set(prev).add(rawDataId));
      console.log('Starting download for:', { rawDataId, s3Url, rawDataName });

      // Download the file from S3
      const blob = await downloadAudioFileFromS3(s3Url);
      console.log('Downloaded blob, size:', blob.size, 'type:', blob.type);

      if (!blob || blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      // Extract filename from S3 URL or use rawData name
      let fileName = rawDataName || 'audio';
      const urlMatch = s3Url.match(/\/([^/]+\.(mp3|wav|ogg|m4a|aac|flac))$/i);
      if (urlMatch && urlMatch[1]) {
        fileName = urlMatch[1];
      } else if (!fileName.endsWith('.mp3') && !fileName.endsWith('.wav') && !fileName.endsWith('.ogg')) {
        fileName = `${fileName}.mp3`;
      }

      console.log('Creating download link with filename:', fileName);

      // Create a temporary download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Trigger download
      console.log('Triggering download...');
      link.click();

      // Clean up after a short delay to ensure download starts
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log('Download link cleaned up');
      }, 100);
    } catch (error: any) {
      console.error('Error downloading audio file:', error);
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      alert(`Failed to download audio file: ${errorMessage}`);
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(rawDataId);
        return newSet;
      });
    }
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
                        <>
                          <span className="ml-2">
                            ({project.trees.length} of {project.totalTreeCount} {project.totalTreeCount === 1 ? 'tree' : 'trees'})
                          </span>
                          <span className="ml-2 text-xs">
                            • Processed: {project.processedAudioCount} | Unprocessed: {project.unprocessedAudioCount}
                          </span>
                        </>
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
                            {tree.features.map((feature) => {
                              const featureKey = `${tree.id}-${feature.id}`;
                              const isFeatureExpanded = expandedFeatures.has(featureKey);
                              const hasRawData = feature.rawData && feature.rawData.length > 0;

                              return (
                                <div key={feature.id} className="select-none">
                                  <div
                                    className={`
                                      flex items-center px-3 py-2 rounded-md transition-colors
                                      ${hasRawData ? 'cursor-pointer' : ''}
                                      ${isFeatureExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'}
                                    `}
                                    onClick={() => hasRawData && toggleFeature(feature.id, tree.id)}
                                  >
                                    <div className="flex items-center flex-1 min-w-0">
                                      {hasRawData ? (
                                        isFeatureExpanded ? (
                                          <ChevronDownIcon className="h-3 w-3 text-gray-500 mr-2 flex-shrink-0" />
                                        ) : (
                                          <ChevronRightIcon className="h-3 w-3 text-gray-500 mr-2 flex-shrink-0" />
                                        )
                                      ) : (
                                        <div className="w-3 mr-2" />
                                      )}
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
                                            <span className="mr-2">Group: {feature.feature_group}</span>
                                          )}
                                          {hasRawData && (
                                            <span>
                                              ({feature.rawData.length}{' '}
                                              {feature.rawData.length === 1 ? 'raw data entry' : 'raw data entries'})
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* RawData Level */}
                                  {isFeatureExpanded && hasRawData && (
                                    <div className="ml-12 mt-1 space-y-1">
                                      {feature.rawData.map((rawData) => {
                                        const isAudio = isAudioS3Url(rawData.valueString);
                                        const isDownloading = downloadingFiles.has(rawData.id);

                                        return (
                                          <div
                                            key={rawData.id}
                                            className="flex items-start px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                                          >
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2">
                                                <div className="text-xs text-gray-600 truncate flex-1">
                                                  {rawData.name || 'Unnamed'}
                                                </div>
                                                {isAudio && rawData.valueString && (
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleDownloadAudio(
                                                        rawData.id,
                                                        rawData.valueString!,
                                                        rawData.name || 'audio'
                                                      );
                                                    }}
                                                    disabled={isDownloading}
                                                    className={`
                                                      flex items-center justify-center p-1 rounded
                                                      transition-colors flex-shrink-0
                                                      ${isDownloading
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                                                      }
                                                    `}
                                                    title="Download audio file"
                                                  >
                                                    {isDownloading ? (
                                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                                    ) : (
                                                      <ArrowDownTrayIcon className="h-4 w-4" />
                                                    )}
                                                  </button>
                                                )}
                                              </div>
                                              <div className="text-xs text-gray-500 mt-0.5">
                                                {rawData.valueFloat !== null && rawData.valueFloat !== undefined && (
                                                  <span className="mr-2">Value: {rawData.valueFloat}</span>
                                                )}
                                                {rawData.valueString && !isAudio && (
                                                  <span className="mr-2">
                                                    Value: {rawData.valueString.length > 50 
                                                      ? `${rawData.valueString.substring(0, 50)}...` 
                                                      : rawData.valueString}
                                                  </span>
                                                )}
                                                {rawData.valueString && isAudio && (
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleDownloadAudio(
                                                        rawData.id,
                                                        rawData.valueString!,
                                                        rawData.name || 'audio'
                                                      );
                                                    }}
                                                    disabled={isDownloading}
                                                    className={`
                                                      mr-2 inline-flex items-center gap-1
                                                      transition-colors
                                                      ${isDownloading
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-blue-600 hover:text-blue-800 hover:underline cursor-pointer'
                                                      }
                                                    `}
                                                    title="Click to download audio file"
                                                  >
                                                    {isDownloading ? (
                                                      <>
                                                        <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-blue-600"></div>
                                                        <span>Downloading...</span>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <ArrowDownTrayIcon className="h-3 w-3" />
                                                        <span>Audio file - Click to download</span>
                                                      </>
                                                    )}
                                                  </button>
                                                )}
                                                {rawData.start_date && (
                                                  <span className="mr-2">
                                                    Start: {new Date(rawData.start_date).toLocaleDateString()}
                                                  </span>
                                                )}
                                                {rawData.end_date && (
                                                  <span>
                                                    End: {new Date(rawData.end_date).toLocaleDateString()}
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


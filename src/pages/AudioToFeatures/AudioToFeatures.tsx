import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, MicrophoneIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { API } from 'aws-amplify';
import { useAudioToFeatures } from '../../hooks/useAudioToFeatures';
import { useListTemplates } from '../../hooks/useTemplate';
import { useProjectTreeFeature } from '../../hooks/useProjectTreeFeature';
import { updateTree } from '../../graphql/mutations';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { isAudioS3Url } from '../../services/storageService';
import type { RawDataInfo } from '../../types/projectTreeFeature';

export const AudioToFeatures: React.FC = () => {
  const navigate = useNavigate();
  const { processAudio, loading, error, result } = useAudioToFeatures();
  const { templates, loading: templatesLoading } = useListTemplates();
  const { projects, loading: projectsLoading, refetch: refetchProjects } = useProjectTreeFeature();

  const [formData, setFormData] = useState({
    templateId: '',
    geminiApiKey: '',
    processAllTrees: true,
    selectedTreeIds: [] as string[],
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [treesWithAudio, setTreesWithAudio] = useState<Array<{ 
    id: string; 
    name: string; 
    audioCount: number;
    existingFeatures: Array<{
      featureName: string;
      featureId: string;
      rawData: RawDataInfo[];
    }>;
  }>>([]);
  const [expandedTrees, setExpandedTrees] = useState<Set<string>>(new Set());

  // Calculate trees with audio files and existing features
  useEffect(() => {
    if (!projectsLoading && projects.length > 0) {
      const trees: Array<{ 
        id: string; 
        name: string; 
        audioCount: number;
        existingFeatures: Array<{
          featureName: string;
          featureId: string;
          rawData: RawDataInfo[];
        }>;
      }> = [];
      
      projects.forEach(project => {
        project.trees.forEach(tree => {
          let audioCount = 0;
          const audioUrls: string[] = [];
          const existingFeaturesMap = new Map<string, {
            featureName: string;
            featureId: string;
            rawData: RawDataInfo[];
          }>();
          
          // Ensure features array exists
          const features = tree.features || [];
          
          console.log(`AudioToFeatures: Processing tree ${tree.id} (${tree.name}), features count: ${features.length}`);
          
          features.forEach(feature => {
            // Ensure rawData array exists
            const rawDataArray = feature.rawData || [];
            const nonAudioRawData: RawDataInfo[] = [];
            
            rawDataArray.forEach(rawData => {
              // Check if this is an audio file
              if (rawData.valueString && isAudioS3Url(rawData.valueString)) {
                audioCount++;
                audioUrls.push(rawData.valueString);
                console.log(`AudioToFeatures: Found audio file in tree ${tree.id}, feature ${feature.name}: ${rawData.valueString.substring(0, 50)}...`);
              } else {
                // This is an extracted feature value, not an audio file
                // Include it if it has any value (float or non-empty string)
                const hasFloatValue = rawData.valueFloat !== null && rawData.valueFloat !== undefined;
                const hasStringValue = rawData.valueString && rawData.valueString.trim() !== '';
                if (hasFloatValue || hasStringValue) {
                  nonAudioRawData.push(rawData);
                }
              }
            });
            
            // Only add features that have non-audio RawData entries
            if (nonAudioRawData.length > 0) {
              existingFeaturesMap.set(feature.id, {
                featureName: feature.name || 'Unnamed Feature',
                featureId: feature.id,
                rawData: nonAudioRawData,
              });
            }
          });
          
          console.log(`AudioToFeatures: Tree ${tree.id} summary - audioCount: ${audioCount}, existingFeatures: ${existingFeaturesMap.size}`);
          
          // Include trees that have audio files OR existing features
          if (audioCount > 0 || existingFeaturesMap.size > 0) {
            trees.push({
              id: tree.id,
              name: tree.name,
              audioCount,
              existingFeatures: Array.from(existingFeaturesMap.values()),
            });
          }
        });
      });
      
      console.log('AudioToFeatures: Processed trees with audio', trees.length);
      setTreesWithAudio(trees);
    } else if (!projectsLoading && projects.length === 0) {
      // Reset if no projects
      setTreesWithAudio([]);
    }
  }, [projects, projectsLoading]);

  const toggleTreeExpansion = (treeId: string) => {
    setExpandedTrees(prev => {
      const newSet = new Set(prev);
      if (newSet.has(treeId)) {
        newSet.delete(treeId);
      } else {
        newSet.add(treeId);
      }
      return newSet;
    });
  };

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.templateId.trim()) {
      errors.templateId = 'Template is required';
    }
    if (!formData.geminiApiKey.trim()) {
      errors.geminiApiKey = 'Gemini API Key is required';
    }
    if (!formData.processAllTrees && formData.selectedTreeIds.length === 0) {
      errors.selectedTreeIds = 'Please select at least one tree or choose "All Trees"';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Build params object, only include treeIds if not processing all trees
    const params: any = {
      templateId: formData.templateId,
      geminiApiKey: formData.geminiApiKey,
    };

    // Only include treeIds if we're processing specific trees
    if (!formData.processAllTrees && formData.selectedTreeIds.length > 0) {
      params.treeIds = formData.selectedTreeIds;
    }

    console.log('AudioToFeatures: Submitting with params:', {
      templateId: params.templateId,
      treeIds: params.treeIds || 'all trees',
      treeIdsCount: params.treeIds?.length || 'all',
    });

    const response = await processAudio(params);
    
    // Update are_audios_processed flag for successfully processed trees
    if (response && response.success && response.results) {
      const treesToUpdate = response.results
        .filter(treeResult => treeResult.processed > 0 || treeResult.featuresExtracted > 0)
        .map(treeResult => treeResult.treeId);
      
      if (treesToUpdate.length > 0) {
        console.log('AudioToFeatures: Updating are_audios_processed for trees:', treesToUpdate);
        
        // Update each tree asynchronously
        Promise.all(
          treesToUpdate.map(async (treeId) => {
            try {
              await API.graphql({
                query: updateTree,
                variables: {
                  input: {
                    id: treeId,
                    are_audios_processed: true,
                  },
                },
              });
              console.log(`AudioToFeatures: Updated are_audios_processed for tree ${treeId}`);
            } catch (err: any) {
              console.error(`AudioToFeatures: Failed to update tree ${treeId}:`, err);
            }
          })
        ).then(() => {
          // Refetch projects to update the UI
          refetchProjects();
        });
      }
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleTreeToggle = (treeId: string) => {
    setFormData((prev) => {
      const selected = prev.selectedTreeIds.includes(treeId)
        ? prev.selectedTreeIds.filter(id => id !== treeId)
        : [...prev.selectedTreeIds, treeId];
      return { ...prev, selectedTreeIds: selected };
    });
  };

  const totalAudioFiles = treesWithAudio.reduce((sum, tree) => sum + tree.audioCount, 0);

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>
        <div className="flex items-center">
          <MicrophoneIcon className="h-8 w-8 text-primary-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audio to Features</h1>
            <p className="mt-1 text-sm text-gray-500">
              Extract feature values from audio files using Gemini API
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-600 mt-1 whitespace-pre-wrap">{error}</p>
        </div>
      )}

      {result && result.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <p className="text-green-800 font-medium text-lg mb-4">Processing Completed Successfully!</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-green-700">Total Trees</p>
                <p className="text-2xl font-bold text-green-900">{result.summary.totalTrees}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Audio Files</p>
                <p className="text-2xl font-bold text-green-900">{result.summary.totalAudioFiles}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Processed</p>
                <p className="text-2xl font-bold text-green-900">{result.summary.totalProcessed}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Features Extracted</p>
                <p className="text-2xl font-bold text-green-900">{result.summary.totalFeaturesExtracted}</p>
              </div>
            </div>

            {result.results.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-green-800 mb-2">Per-Tree Results:</p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {result.results.map((treeResult) => (
                    <div key={treeResult.treeId} className="bg-white rounded p-3 border border-green-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{treeResult.treeName}</p>
                          <p className="text-sm text-gray-600">
                            {treeResult.processed}/{treeResult.audioCount} audio files processed
                          </p>
                          <p className="text-sm text-green-700">
                            {treeResult.featuresExtracted} features extracted
                          </p>
                        </div>
                        {treeResult.errors.length > 0 && (
                          <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                            {treeResult.errors.length} error(s)
                          </span>
                        )}
                      </div>
                      {treeResult.errors.length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-red-700 cursor-pointer">Show errors</summary>
                          <ul className="mt-1 text-xs text-red-600 list-disc list-inside">
                            {treeResult.errors.map((err, idx) => (
                              <li key={idx}>{err}</li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Template Selection */}
            <div>
              <label htmlFor="templateId" className="block text-sm font-medium text-gray-700 mb-2">
                Template <span className="text-red-500">*</span>
              </label>
              <select
                id="templateId"
                value={formData.templateId}
                onChange={(e) => handleChange('templateId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  formErrors.templateId ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={templatesLoading || loading}
              >
                <option value="">Select a template...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} {template.version ? `(v${template.version})` : ''}
                  </option>
                ))}
              </select>
              {formErrors.templateId && (
                <p className="mt-1 text-sm text-red-600">{formErrors.templateId}</p>
              )}
            </div>

            {/* Gemini API Key */}
            <div>
              <label htmlFor="geminiApiKey" className="block text-sm font-medium text-gray-700 mb-2">
                Gemini API Key <span className="text-red-500">*</span>
              </label>
              <Input
                id="geminiApiKey"
                type="password"
                value={formData.geminiApiKey}
                onChange={(e) => handleChange('geminiApiKey', e.target.value)}
                placeholder="Enter your Gemini API key"
                error={formErrors.geminiApiKey}
                disabled={loading}
              />
            </div>

            {/* Tree Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trees to Process
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.processAllTrees}
                    onChange={(e) => handleChange('processAllTrees', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Process All Trees ({treesWithAudio.length} trees with {totalAudioFiles} audio files)
                  </span>
                </label>

                {!formData.processAllTrees && (
                  <div className="border border-gray-300 rounded-md p-4 max-h-96 overflow-y-auto">
                    {treesWithAudio.length === 0 ? (
                      <p className="text-sm text-gray-500">No trees with audio files found</p>
                    ) : (
                      <div className="space-y-3">
                        {treesWithAudio.map((tree) => {
                          const isExpanded = expandedTrees.has(tree.id);
                          const hasExistingFeatures = tree.existingFeatures.length > 0;
                          
                          return (
                            <div key={tree.id} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                              <div className="flex items-start">
                                <input
                                  type="checkbox"
                                  checked={formData.selectedTreeIds.includes(tree.id)}
                                  onChange={() => handleTreeToggle(tree.id)}
                                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                  disabled={loading}
                                />
                                <div className="ml-3 flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <span className="text-sm font-medium text-gray-900">
                                        {tree.name}
                                      </span>
                                      <div className="mt-1 flex items-center gap-4 text-xs text-gray-600">
                                        {tree.audioCount > 0 && (
                                          <span>
                                            {tree.audioCount} audio file{tree.audioCount !== 1 ? 's' : ''}
                                          </span>
                                        )}
                                        {hasExistingFeatures && (
                                          <span className="text-primary-600">
                                            {tree.existingFeatures.length} existing feature{tree.existingFeatures.length !== 1 ? 's' : ''}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    {hasExistingFeatures && (
                                      <button
                                        type="button"
                                        onClick={() => toggleTreeExpansion(tree.id)}
                                        className="ml-2 text-gray-500 hover:text-gray-700"
                                        disabled={loading}
                                      >
                                        {isExpanded ? (
                                          <ChevronDownIcon className="h-5 w-5" />
                                        ) : (
                                          <ChevronRightIcon className="h-5 w-5" />
                                        )}
                                      </button>
                                    )}
                                  </div>
                                  
                                  {/* Existing Features Display */}
                                  {isExpanded && hasExistingFeatures && (
                                    <div className="mt-3 ml-6 space-y-3 border-l-2 border-primary-200 pl-3">
                                      {tree.existingFeatures.map((feature) => (
                                        <div key={feature.featureId} className="bg-white rounded p-2 border border-gray-200">
                                          <div className="font-medium text-sm text-gray-900 mb-1">
                                            {feature.featureName}
                                          </div>
                                          <div className="space-y-1">
                                            {feature.rawData.map((rawData) => (
                                              <div key={rawData.id} className="text-xs text-gray-600 flex items-center gap-2">
                                                <span className="font-medium">Value:</span>
                                                <span>
                                                  {rawData.valueFloat !== null && rawData.valueFloat !== undefined
                                                    ? rawData.valueFloat.toLocaleString()
                                                    : rawData.valueString || 'N/A'}
                                                </span>
                                                {rawData.updatedAt && (
                                                  <>
                                                    <span className="text-gray-400">•</span>
                                                    <span className="text-gray-500">
                                                      Updated: {new Date(rawData.updatedAt).toLocaleDateString()}
                                                    </span>
                                                  </>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                {formErrors.selectedTreeIds && (
                  <p className="text-sm text-red-600">{formErrors.selectedTreeIds}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading || templatesLoading || projectsLoading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></span>
                    Processing...
                  </>
                ) : (
                  'Process Audio'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mr-3"></div>
            <p className="text-gray-700">Processing audio files... This may take a few minutes.</p>
          </div>
        </div>
      )}
    </div>
  );
};

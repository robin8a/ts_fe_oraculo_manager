import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeftIcon, MicrophoneIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { API } from 'aws-amplify';
import { useAudioToFeatures } from '../../hooks/useAudioToFeatures';
import { useListTemplates } from '../../hooks/useTemplate';
import { useProjectTreeFeature } from '../../hooks/useProjectTreeFeature';
import { updateTree, deleteRawData } from '../../graphql/mutations';
import { listRawData } from '../../graphql/queries';
import { Button } from '../../components/ui/Button';

const listTemplateFeaturesWithDetails = /* GraphQL */ `
  query ListTemplateFeaturesWithDetails(
    $filter: ModelTemplateFeatureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTemplateFeatures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        templateTemplateFeaturesId
        featureTemplateFeaturesId
        feature {
          id
          name
        }
      }
      nextToken
    }
  }
`;
import { Input } from '../../components/ui/Input';
import { isAudioS3Url } from '../../services/storageService';
import type { RawDataInfo } from '../../types/projectTreeFeature';

export const AudioToFeatures: React.FC = () => {
  const navigate = useNavigate();
  const { processAudio, loading, error, result } = useAudioToFeatures();
  const { templates, loading: templatesLoading } = useListTemplates();
  
  const [treeLimit, setTreeLimit] = useState<number>(100);
  const [loadingMoreTrees, setLoadingMoreTrees] = useState(false);
  const [showUnprocessedOnly, setShowUnprocessedOnly] = useState<boolean>(false);
  const [filterFeatureId, setFilterFeatureId] = useState<string>('');
  const [filterFeatureValue, setFilterFeatureValue] = useState<string>('');
  const { projects, loading: projectsLoading, refetch: refetchProjects } = useProjectTreeFeature(treeLimit, showUnprocessedOnly);

  // Unique features from all loaded trees (for filter dropdown)
  const availableFeatures = useMemo(() => {
    const byId = new Map<string, { id: string; name: string }>();
    projects.forEach(project => {
      project.trees.forEach(tree => {
        (tree.features || []).forEach((f: { id: string; name: string | null }) => {
          if (f.id && !byId.has(f.id)) {
            byId.set(f.id, { id: f.id, name: f.name || 'Unnamed' });
          }
        });
      });
    });
    return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [projects]);

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
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [treeStats, _setTreeStats] = useState<{
    total: number;
    processed: number;
    unprocessed: number;
  }>({ total: 0, processed: 0, unprocessed: 0 });
  const [treeProgress, setTreeProgress] = useState<Map<string, {
    status: 'queued' | 'processing' | 'completed' | 'error';
    processed: number;
    total: number;
    featuresExtracted: number;
    errors: string[];
  }>>(new Map());
  const [reprocessProgress, setReprocessProgress] = useState<{
    treeName: string;
    templateFeatureToDelete: string;
    templateFeaturesCount: number;
  } | null>(null);

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
          // Filter by unprocessed status if showUnprocessedOnly is true
          if (showUnprocessedOnly) {
            const isProcessed = tree.are_audios_processed === true;
            if (isProcessed) {
              console.log(`AudioToFeatures: Skipping tree ${tree.id} (${tree.name}) - already processed`);
              return; // Skip this tree
            }
          }
          
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
          
          // Filter by feature value if set: only include trees that have the selected feature with the given value
          if (filterFeatureId && filterFeatureValue.trim() !== '') {
            const feature = features.find((f: { id: string }) => f.id === filterFeatureId);
            if (!feature) return;
            const rawDataArray = (feature as { rawData?: RawDataInfo[] }).rawData || [];
            const valueTrimmed = filterFeatureValue.trim();
            const numValue = parseFloat(valueTrimmed);
            const hasMatch = rawDataArray.some((rd: RawDataInfo) => {
              if (rd.valueString != null && rd.valueString.trim() !== '') {
                if (rd.valueString.trim() === valueTrimmed) return true;
                if (!Number.isNaN(numValue) && parseFloat(rd.valueString) === numValue) return true;
              }
              if (rd.valueFloat != null && !Number.isNaN(numValue) && rd.valueFloat === numValue) return true;
              return false;
            });
            if (!hasMatch) return;
          }

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
      
      const filterText = showUnprocessedOnly ? 'unprocessed ' : '';
      const featureFilterText = filterFeatureId && filterFeatureValue.trim() ? ` (filtered by feature)` : '';
      console.log(`AudioToFeatures: Found ${trees.length} ${filterText}trees with audio files${featureFilterText}`);
      setTreesWithAudio(trees);
    } else if (!projectsLoading && projects.length === 0) {
      // Reset if no projects
      setTreesWithAudio([]);
    }
  }, [projects, projectsLoading, showUnprocessedOnly, filterFeatureId, filterFeatureValue]);

  // Clear "loading more" state when projects finish loading
  useEffect(() => {
    if (!projectsLoading) setLoadingMoreTrees(false);
  }, [projectsLoading]);

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

  const handleLoadMoreTrees = async () => {
    setLoadingMoreTrees(true);
    // Increase the limit by 100 to load the next batch
    const newLimit = treeLimit + 100;
    setTreeLimit(newLimit);
    // The hook will automatically refetch when treeLimit changes
    // The loadingMoreTrees state will be cleared by the useEffect when projects finish loading
  };

  const handleLoadAllTrees = () => {
    setLoadingMoreTrees(true);
    // 0 means no limit in useProjectTreeFeature
    setTreeLimit(0);
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

    // Set batch processing state
    setBatchProcessing(true);

    // Determine which trees to process
    const treesToProcess = formData.processAllTrees 
      ? treesWithAudio.map(t => t.id)
      : formData.selectedTreeIds;

    console.log('AudioToFeatures: Processing trees sequentially:', {
      templateId: formData.templateId,
      treeIdsCount: treesToProcess.length,
      treeIds: treesToProcess,
    });

    // Initialize progress for all trees that will be processed
    const initialProgress = new Map<string, {
      status: 'queued' | 'processing' | 'completed' | 'error';
      processed: number;
      total: number;
      featuresExtracted: number;
      errors: string[];
    }>();
    
    treesToProcess.forEach(treeId => {
      const tree = treesWithAudio.find(t => t.id === treeId);
      initialProgress.set(treeId, {
        status: 'queued',
        processed: 0,
        total: tree?.audioCount || 0,
        featuresExtracted: 0,
        errors: [],
      });
    });
    
    setTreeProgress(initialProgress);

    // Aggregate results from all trees
    const allResults: Array<{
      treeId: string;
      treeName: string;
      audioCount: number;
      processed: number;
      errors: string[];
      featuresExtracted: number;
    }> = [];
    
    let totalProcessed = 0;
    let totalErrors = 0;
    let totalFeaturesExtracted = 0;

    try {
      // Step 1: Fetch template feature IDs and names (delete only RawData for these features)
      const templateFeatureIds = new Set<string>();
      const featureIdToName = new Map<string, string>();
      let tfNextToken: string | undefined;
      do {
        const tfResponse: any = await API.graphql({
          query: listTemplateFeaturesWithDetails,
          variables: {
            filter: { templateTemplateFeaturesId: { eq: formData.templateId } },
            limit: 500,
            nextToken: tfNextToken || undefined,
          },
        });
        const tfItems = tfResponse.data?.listTemplateFeatures?.items || [];
        tfItems.forEach((tf: { featureTemplateFeaturesId?: string; feature?: { id: string; name?: string } }) => {
          if (tf.featureTemplateFeaturesId) {
            templateFeatureIds.add(tf.featureTemplateFeaturesId);
            if (tf.feature?.id) featureIdToName.set(tf.feature.id, tf.feature.name || tf.feature.id);
          }
        });
        tfNextToken = tfResponse.data?.listTemplateFeatures?.nextToken;
      } while (tfNextToken);

      // Step 2: For each tree, delete non-audio RawData that belong to the template's features
      if (templateFeatureIds.size > 0) {
        setReprocessProgress({
          treeName: '',
          templateFeatureToDelete: '',
          templateFeaturesCount: templateFeatureIds.size,
        });
        for (const treeId of treesToProcess) {
          const tree = treesWithAudio.find(t => t.id === treeId);
          setReprocessProgress(prev => prev ? { ...prev, treeName: tree?.name || treeId } : null);
          try {
            let rawNextToken: string | undefined;
            do {
              const rawResponse: any = await API.graphql({
                query: listRawData,
                variables: {
                  filter: { treeRawDataId: { eq: treeId } },
                  limit: 100,
                  nextToken: rawNextToken || undefined,
                },
              });
              const rawItems = rawResponse.data?.listRawData?.items || [];
              for (const raw of rawItems) {
                const featureId = raw.featureRawDatasId;
                const valueString = raw.valueString ?? '';
                if (featureId && templateFeatureIds.has(featureId) && !isAudioS3Url(valueString)) {
                  setReprocessProgress(prev => prev ? { ...prev, templateFeatureToDelete: featureIdToName.get(featureId) || featureId } : null);
                  try {
                    await API.graphql({
                      query: deleteRawData,
                      variables: { input: { id: raw.id } },
                    });
                  } catch (delErr: any) {
                    console.error(`AudioToFeatures: Failed to delete RawData ${raw.id} for tree ${treeId}:`, delErr);
                  }
                }
              }
              rawNextToken = rawResponse.data?.listRawData?.nextToken;
            } while (rawNextToken);
          } catch (listErr: any) {
            console.error(`AudioToFeatures: Failed to list RawData for tree ${treeId}:`, listErr);
          }
        }
        setReprocessProgress(null);
      }

      // Process each tree sequentially (Lambda creates new RawData)
      for (let i = 0; i < treesToProcess.length; i++) {
      const treeId = treesToProcess[i];
      const tree = treesWithAudio.find(t => t.id === treeId);
      
      // Mark tree as processing
      setTreeProgress(prev => {
        const updated = new Map(prev);
        const current = updated.get(treeId);
        if (current) {
          updated.set(treeId, { ...current, status: 'processing' });
        }
        return updated;
      });

      try {
        console.log(`AudioToFeatures: Processing tree ${i + 1}/${treesToProcess.length}: ${tree?.name || treeId}`);
        
        // Call processAudio with single tree ID
        const params = {
          templateId: formData.templateId,
          geminiApiKey: formData.geminiApiKey,
          treeIds: [treeId], // Process one tree at a time
        };

        const response = await processAudio(params);
        
        if (response && response.results && response.results.length > 0) {
          const treeResult = response.results[0]; // Should only have one result
          
          // Update progress for this tree
          const progressUpdate = {
            status: ((treeResult.errors && treeResult.errors.length > 0) ? 'error' : 'completed') as 'queued' | 'processing' | 'completed' | 'error',
            processed: treeResult.processed,
            total: treeResult.audioCount,
            featuresExtracted: treeResult.featuresExtracted,
            errors: treeResult.errors || [],
          };
          console.log(`AudioToFeatures: Updating progress for tree ${treeId}:`, progressUpdate);
          
          setTreeProgress(prev => {
            const updated = new Map(prev);
            updated.set(treeId, progressUpdate);
            return updated;
          });

          // Add to aggregated results
          allResults.push(treeResult);
          totalProcessed += treeResult.processed;
          totalErrors += (treeResult.errors?.length || 0);
          totalFeaturesExtracted += treeResult.featuresExtracted;

          // Update are_audios_processed flag - mark as processed if tree has audio files, 
          // even if no features were extracted
          if (treeResult.audioCount > 0) {
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
              console.log(`AudioToFeatures: Updated are_audios_processed for tree ${treeId} (audioCount: ${treeResult.audioCount}, featuresExtracted: ${treeResult.featuresExtracted})`);
            } catch (err: any) {
              console.error(`AudioToFeatures: Failed to update tree ${treeId}:`, err);
            }
          }
        } else {
          // No results returned, mark as error
          const errorMsg = 'No results returned from processing';
          setTreeProgress(prev => {
            const updated = new Map(prev);
            updated.set(treeId, {
              status: 'error',
              processed: 0,
              total: tree?.audioCount || 0,
              featuresExtracted: 0,
              errors: [errorMsg],
            });
            return updated;
          });
          
          allResults.push({
            treeId,
            treeName: tree?.name || 'Unknown Tree',
            audioCount: tree?.audioCount || 0,
            processed: 0,
            errors: [errorMsg],
            featuresExtracted: 0,
          });
          totalErrors++;
        }
      } catch (err) {
        // Error processing this tree, but continue with others
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`AudioToFeatures: Error processing tree ${treeId}:`, err);
        
        setTreeProgress(prev => {
          const updated = new Map(prev);
          updated.set(treeId, {
            status: 'error',
            processed: 0,
            total: tree?.audioCount || 0,
            featuresExtracted: 0,
            errors: [errorMessage],
          });
          return updated;
        });

        allResults.push({
          treeId,
          treeName: tree?.name || 'Unknown Tree',
          audioCount: tree?.audioCount || 0,
          processed: 0,
          errors: [errorMessage],
          featuresExtracted: 0,
        });
        totalErrors++;
      }
    }

    // After all trees are processed, create aggregated response
    console.log('AudioToFeatures: Creating aggregated response:', {
      totalTrees: treesToProcess.length,
      totalProcessed,
      totalErrors,
      allResults: allResults.map(r => ({
        treeId: r.treeId,
        treeName: r.treeName,
        errors: r.errors,
        errorsLength: r.errors?.length || 0,
      })),
    });
    
    const aggregatedResponse = {
      success: true,
      message: `Processed ${treesToProcess.length} trees with ${totalProcessed} audio files processed and ${totalErrors} errors`,
      results: allResults,
      summary: {
        totalTrees: treesToProcess.length,
        totalAudioFiles: allResults.reduce((sum, r) => sum + r.audioCount, 0),
        totalProcessed,
        totalErrors,
        totalFeaturesExtracted,
      },
    };

    // Refetch projects to update the UI
    refetchProjects();
    
    return aggregatedResponse;
    } catch (err) {
      // Handle any unexpected errors during batch processing
      console.error('AudioToFeatures: Unexpected error during batch processing:', err);
      throw err;
    } finally {
      setReprocessProgress(null);
      setBatchProcessing(false);
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

      {/* Reprocess progress (cleaning RawData before Process Audio) */}
      {batchProcessing && reprocessProgress && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
          <p className="text-amber-800 font-medium text-lg mb-3">Reprocess progress</p>
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="font-medium text-amber-900">Tree</dt>
              <dd className="text-amber-800">{reprocessProgress.treeName || '—'}</dd>
            </div>
            <div>
              <dt className="font-medium text-amber-900">Actual template feature to delete</dt>
              <dd className="text-amber-800">{reprocessProgress.templateFeatureToDelete || '—'}</dd>
            </div>
            <div>
              <dt className="font-medium text-amber-900">Template features actual count</dt>
              <dd className="text-amber-800">{reprocessProgress.templateFeaturesCount}</dd>
            </div>
          </dl>
        </div>
      )}

      {/* Progress Display */}
      {loading && treeProgress.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-blue-800 font-medium text-lg mb-4">Processing Trees...</p>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {Array.from(treeProgress.entries()).map(([treeId, progress]) => {
              const tree = treesWithAudio.find(t => t.id === treeId);
              const progressPercent = progress.total > 0 
                ? Math.round((progress.processed / progress.total) * 100) 
                : 0;
              
              return (
                <div key={treeId} className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{tree?.name || 'Unknown Tree'}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>
                          {progress.processed}/{progress.total} audio files
                        </span>
                        {progress.status === 'processing' && (
                          <span className="flex items-center gap-1 text-blue-600">
                            <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></span>
                            Processing...
                          </span>
                        )}
                        {progress.status === 'completed' && (
                          <span className="text-green-600">
                            ✓ {progress.featuresExtracted} features extracted
                          </span>
                        )}
                        {progress.status === 'error' && (
                          <span className="text-red-600">
                            ✗ {progress.errors.length} error(s)
                          </span>
                        )}
                        {progress.status === 'queued' && (
                          <span className="text-gray-500">Queued...</span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <span className="text-sm font-medium text-gray-700">{progressPercent}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        progress.status === 'completed' ? 'bg-green-500' :
                        progress.status === 'error' ? 'bg-red-500' :
                        progress.status === 'processing' ? 'bg-blue-500' :
                        'bg-gray-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  {progress.errors && progress.errors.length > 0 && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                      <p className="text-xs font-medium text-red-700 mb-1">Errors:</p>
                      <ul className="mt-1 text-xs text-red-600 list-disc list-inside space-y-0.5">
                        {progress.errors.map((err, idx) => {
                          console.log(`AudioToFeatures: Progress display error ${idx} for tree ${treeId}:`, err);
                          return <li key={idx}>{err}</li>;
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(() => {
        if (result) {
          console.log('AudioToFeatures: Result object:', {
            success: result.success,
            resultsLength: result.results?.length || 0,
            results: result.results?.map(r => ({
              treeId: r.treeId,
              treeName: r.treeName,
              errors: r.errors,
              errorsLength: r.errors?.length || 0,
            })),
            summary: result.summary,
            fullResult: result,
          });
        }
        return null;
      })()}
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
                  {result.results.map((treeResult) => {
                    console.log('AudioToFeatures: Rendering tree result:', {
                      treeId: treeResult.treeId,
                      treeName: treeResult.treeName,
                      errors: treeResult.errors,
                      errorsLength: treeResult.errors?.length || 0,
                      errorsType: typeof treeResult.errors,
                      errorsIsArray: Array.isArray(treeResult.errors),
                    });
                    return (
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
                          {treeResult.errors && treeResult.errors.length > 0 && (
                            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                              {treeResult.errors.length} error(s)
                            </span>
                          )}
                        </div>
                        {treeResult.errors && treeResult.errors.length > 0 && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                            <p className="text-xs font-medium text-red-700 mb-1">Errors:</p>
                            <ul className="mt-1 text-xs text-red-600 list-disc list-inside">
                              {treeResult.errors.map((err, idx) => {
                                console.log(`AudioToFeatures: Rendering error ${idx}:`, err);
                                return <li key={idx}>{err}</li>;
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                disabled={templatesLoading || batchProcessing}
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
              
              {/* Tree Statistics */}
              {treeStats.total > 0 && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Processing Status</span>
                    <span className="text-xs text-gray-500">
                      {treeStats.processed} / {treeStats.total} trees processed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${treeStats.total > 0 ? Math.round((treeStats.processed / treeStats.total) * 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>
                      <span className="font-medium text-green-700">{treeStats.processed}</span> processed
                    </span>
                    <span>
                      <span className="font-medium text-blue-700">{treeStats.unprocessed}</span> remaining
                    </span>
                    <span>
                      <span className="font-medium text-gray-700">{treeStats.total}</span> total
                    </span>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {/* Filter for Unprocessed Trees */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showUnprocessedOnly}
                    onChange={(e) => setShowUnprocessedOnly(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    disabled={loading || batchProcessing || projectsLoading}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Show only unprocessed trees
                  </span>
                </label>

                {/* Filter trees by feature value */}
                <div className="flex flex-wrap items-end gap-3 pt-1">
                  <div className="flex-1 min-w-[140px]">
                    <label htmlFor="filterFeatureId" className="block text-xs font-medium text-gray-500 mb-1">
                      Filter by feature
                    </label>
                    <select
                      id="filterFeatureId"
                      value={filterFeatureId}
                      onChange={(e) => setFilterFeatureId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      disabled={loading || batchProcessing || projectsLoading}
                    >
                      <option value="">All trees</option>
                      {availableFeatures.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[140px]">
                    <label htmlFor="filterFeatureValue" className="block text-xs font-medium text-gray-500 mb-1">
                      Feature value
                    </label>
                    <input
                      id="filterFeatureValue"
                      type="text"
                      value={filterFeatureValue}
                      onChange={(e) => setFilterFeatureValue(e.target.value)}
                      placeholder={filterFeatureId ? 'e.g. Oak, 42' : 'Select a feature first'}
                      disabled={!filterFeatureId || loading || batchProcessing || projectsLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                  {(filterFeatureId || filterFeatureValue) && (
                    <button
                      type="button"
                      onClick={() => { setFilterFeatureId(''); setFilterFeatureValue(''); }}
                      className="text-sm text-primary-600 hover:text-primary-800 whitespace-nowrap"
                      disabled={loading || batchProcessing || projectsLoading}
                    >
                      Clear filter
                    </button>
                  )}
                </div>
                {/* Load all trees (for filter) */}
                <div className="flex items-center gap-3 pt-1">
                  {treeLimit > 0 ? (
                    <Button
                      type="button"
                      onClick={handleLoadAllTrees}
                      disabled={loadingMoreTrees || projectsLoading || batchProcessing}
                      variant="outline"
                      isLoading={loadingMoreTrees}
                      className="min-w-[140px]"
                    >
                      Load all trees
                    </Button>
                  ) : (
                    <span className="text-sm text-gray-500">All trees loaded (no limit).</span>
                  )}
                </div>
                {filterFeatureId && filterFeatureValue.trim() && (
                  <p className="text-xs text-gray-500">
                    Only trees with feature &quot;{availableFeatures.find(f => f.id === filterFeatureId)?.name}&quot; = &quot;{filterFeatureValue.trim()}&quot; will be loaded and processed.
                  </p>
                )}

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
                      <p className="text-sm text-gray-500">
                        {projectsLoading ? 'Loading trees...' : 'No unprocessed trees with audio files found. All trees have been processed.'}
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {treesWithAudio.map((tree) => {
                          const isExpanded = expandedTrees.has(tree.id);
                          const hasExistingFeatures = tree.existingFeatures.length > 0;
                          const progress = treeProgress.get(tree.id);
                          const isProcessing = progress && (progress.status === 'processing' || progress.status === 'queued');
                          
                          return (
                            <div key={tree.id} className={`border rounded-md p-3 ${
                              isProcessing ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'
                            }`}>
                              <div className="flex items-start">
                                <input
                                  type="checkbox"
                                  checked={formData.selectedTreeIds.includes(tree.id)}
                                  onChange={() => handleTreeToggle(tree.id)}
                                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                  disabled={batchProcessing || isProcessing}
                                />
                                <div className="ml-3 flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-medium text-gray-900">
                                          {tree.name}
                                        </span>
                                        {progress && (
                                          <>
                                            <span className={`text-xs px-2 py-0.5 rounded ${
                                              progress.status === 'completed' ? 'bg-green-100 text-green-700' :
                                              progress.status === 'error' ? 'bg-red-100 text-red-700' :
                                              progress.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                              'bg-gray-100 text-gray-700'
                                            }`}>
                                              {progress.status === 'completed' && '✓ Completed'}
                                              {progress.status === 'error' && '✗ Error'}
                                              {progress.status === 'processing' && 'Processing...'}
                                              {progress.status === 'queued' && 'Queued'}
                                            </span>
                                            {progress.errors && progress.errors.length > 0 && (
                                              <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                                {progress.errors.length} error{progress.errors.length !== 1 ? 's' : ''}
                                              </span>
                                            )}
                                          </>
                                        )}
                                      </div>
                                      <div className="mt-1 flex items-center gap-4 text-xs text-gray-600">
                                        {tree.audioCount > 0 && (
                                          <span>
                                            {progress ? `${progress.processed}/${tree.audioCount}` : tree.audioCount} audio file{tree.audioCount !== 1 ? 's' : ''}
                                          </span>
                                        )}
                                        {progress && progress.featuresExtracted > 0 && (
                                          <span className="text-green-600">
                                            {progress.featuresExtracted} features extracted
                                          </span>
                                        )}
                                        {hasExistingFeatures && !progress && (
                                          <span className="text-primary-600">
                                            {tree.existingFeatures.length} existing feature{tree.existingFeatures.length !== 1 ? 's' : ''}
                                          </span>
                                        )}
                                      </div>
                                      {progress && progress.total > 0 && (
                                        <div className="mt-2">
                                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                                progress.status === 'completed' ? 'bg-green-500' :
                                                progress.status === 'error' ? 'bg-red-500' :
                                                progress.status === 'processing' ? 'bg-blue-500' :
                                                'bg-gray-400'
                                              }`}
                                              style={{ 
                                                width: `${Math.round((progress.processed / progress.total) * 100)}%` 
                                              }}
                                            ></div>
                                          </div>
                                        </div>
                                      )}
                                      {progress && progress.errors && progress.errors.length > 0 && (
                                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                          <p className="text-xs font-medium text-red-700 mb-1">Errors:</p>
                                          <ul className="text-xs text-red-600 list-disc list-inside space-y-0.5">
                                            {progress.errors.map((err, idx) => {
                                              console.log(`AudioToFeatures: Tree selection error ${idx} for tree ${tree.id}:`, err);
                                              return <li key={idx}>{err}</li>;
                                            })}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                    {hasExistingFeatures && !isProcessing && (
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
                                    {isProcessing && (
                                      <div className="ml-2">
                                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 inline-block"></span>
                                      </div>
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
                
                {/* Load More Trees Button */}
                {!formData.processAllTrees && treesWithAudio.length > 0 && (
                  <div className="mt-4 flex justify-center">
                    <Button
                      type="button"
                      onClick={handleLoadMoreTrees}
                      disabled={loadingMoreTrees || projectsLoading || batchProcessing}
                      variant="outline"
                      isLoading={loadingMoreTrees}
                      className="min-w-[150px]"
                    >
                      Load More Trees (+100)
                    </Button>
                  </div>
                )}
                {treesWithAudio.length > 0 && (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Showing {treesWithAudio.length} {showUnprocessedOnly ? 'unprocessed ' : ''}tree{treesWithAudio.length !== 1 ? 's' : ''} with audio files
                    {filterFeatureId && filterFeatureValue.trim() && ' (filtered by feature)'}
                    {treeLimit > 100 && ` (loaded ${treeLimit} per project)`}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={batchProcessing || templatesLoading || projectsLoading}
                className="min-w-[120px]"
              >
                {batchProcessing ? (
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

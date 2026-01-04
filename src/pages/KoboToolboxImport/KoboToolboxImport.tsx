import React, { useState } from 'react';
import { ArrowLeftIcon, CloudArrowDownIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useKoboToolboxImport } from '../../hooks/useKoboToolboxImport';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import type { ImportResult } from '../../types/koboToolbox';

export const KoboToolboxImport: React.FC = () => {
  const navigate = useNavigate();
  const { importData, progress, loading, error } = useKoboToolboxImport();
  
  const [formData, setFormData] = useState({
    serverUrl: 'kf.kobotoolbox.org',
    apiKey: 'fddbfef8ae0b3d8ad07891b8dc8e4cc7330e0f29',
    projectUid: '',
    format: 'json' as 'json' | 'csv',
    maxRows: '' as string | number,
  });

  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!formData.serverUrl.trim()) {
      errors.serverUrl = 'Server URL is required';
    }
    if (!formData.apiKey.trim()) {
      errors.apiKey = 'API Key is required';
    }
    if (!formData.projectUid.trim()) {
      errors.projectUid = 'Project UID is required';
    }
    if (formData.maxRows && formData.maxRows !== '') {
      const maxRowsNum = Number(formData.maxRows);
      if (isNaN(maxRowsNum) || maxRowsNum < 1 || !Number.isInteger(maxRowsNum)) {
        errors.maxRows = 'Max rows must be a positive integer';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setImportResult(null);
    const maxRows = formData.maxRows && formData.maxRows !== '' 
      ? Number(formData.maxRows) 
      : undefined;
    const result = await importData({
      serverUrl: formData.serverUrl,
      apiKey: formData.apiKey,
      projectUid: formData.projectUid,
      format: formData.format,
      maxRows,
    });

    setImportResult(result);
  };

  const handleChange = (field: string, value: string | 'json' | 'csv' | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getProgressPercentage = () => {
    if (progress.progress !== undefined) {
      return progress.progress;
    }
    // Estimate based on stage
    const stageProgress: Record<string, number> = {
      idle: 0,
      fetching: 10,
      parsing: 20,
      processing: 50,
      uploading: 80,
      completed: 100,
      error: 0,
    };
    return stageProgress[progress.stage] || 0;
  };

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
          <CloudArrowDownIcon className="h-8 w-8 text-primary-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">KoboToolbox Import</h1>
            <p className="mt-1 text-sm text-gray-500">
              Import data from KoboToolbox and create Features, Trees, and RawData entries
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-600 mt-1 whitespace-pre-wrap">{error}</p>
          <details className="mt-2">
            <summary className="text-sm text-red-700 cursor-pointer">Show technical details</summary>
            <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify({ error, progress }, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {importResult && importResult.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-medium">Import Completed Successfully!</p>
          <div className="mt-2 text-sm text-green-700 space-y-1">
            <p>Trees Created: {importResult.treesCreated}</p>
            <p>Rows Skipped (duplicates): {importResult.rowsSkipped || 0}</p>
            <p>Features Created: {importResult.featuresCreated}</p>
            <p>Features Skipped (already existed): {importResult.featuresSkipped}</p>
            <p>RawData Entries Created: {importResult.rawDataCreated}</p>
            <p>Audio Files Uploaded: {importResult.audioFilesUploaded}</p>
            {importResult.errors.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Warnings:</p>
                <ul className="list-disc list-inside">
                  {importResult.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {importResult && !importResult.success && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 font-medium">Import Completed with Errors</p>
          <div className="mt-2 text-sm text-yellow-700">
            {importResult.errors.length > 0 && (
              <ul className="list-disc list-inside space-y-1">
                {importResult.errors.map((err, idx) => (
                  <li key={idx} className="whitespace-pre-wrap">{err}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{progress.message}</span>
              <span className="text-sm font-semibold text-primary-600">{getProgressPercentage()}%</span>
            </div>
            
            {/* Step indicator */}
            {progress.stepNumber && progress.totalSteps && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Step {progress.stepNumber} of {progress.totalSteps}</span>
                  <span>{progress.currentStep}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.stepNumber / progress.totalSteps) * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Main progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-1"
                style={{ width: `${getProgressPercentage()}%` }}
              >
                {getProgressPercentage() > 10 && (
                  <span className="text-xs text-white font-medium">{Math.round(getProgressPercentage())}%</span>
                )}
              </div>
            </div>
          </div>

          {/* Detailed progress info */}
          <div className="mt-4 space-y-2 text-sm">
            {progress.currentRow && progress.totalRows && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rows processed:</span>
                <span className="font-medium text-gray-900">
                  {progress.currentRow} / {progress.totalRows}
                </span>
              </div>
            )}
            
            {progress.rowsSkipped !== undefined && progress.rowsSkipped > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rows skipped (duplicates):</span>
                <span className="font-medium text-yellow-600">{progress.rowsSkipped}</span>
              </div>
            )}
            
            {progress.featuresProcessed !== undefined && progress.totalFeatures && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Features processed:</span>
                <span className="font-medium text-gray-900">
                  {progress.featuresProcessed} / {progress.totalFeatures}
                </span>
              </div>
            )}
            
            {progress.currentFeature && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current feature:</span>
                <span className="font-medium text-gray-900">{progress.currentFeature}</span>
              </div>
            )}
            
            {progress.treesProcessed !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trees created:</span>
                <span className="font-medium text-green-600">{progress.treesProcessed}</span>
              </div>
            )}
            
            {progress.rawDataProcessed !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">RawData entries:</span>
                <span className="font-medium text-green-600">{progress.rawDataProcessed}</span>
              </div>
            )}
            
            {progress.audioFilesProcessed !== undefined && progress.audioFilesProcessed > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Audio files uploaded:</span>
                <span className="font-medium text-green-600">{progress.audioFilesProcessed}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Server URL"
                type="text"
                value={formData.serverUrl}
                onChange={(e) => handleChange('serverUrl', e.target.value)}
                error={formErrors.serverUrl}
                placeholder="kf.kobotoolbox.org or eu.kobotoolbox.org"
                required
                helperText="Enter your KoboToolbox server URL (without https://)"
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="API Key"
                type="password"
                value={formData.apiKey}
                onChange={(e) => handleChange('apiKey', e.target.value)}
                error={formErrors.apiKey}
                required
                helperText="Your KoboToolbox API key for authentication"
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Project UID"
                type="text"
                value={formData.projectUid}
                onChange={(e) => handleChange('projectUid', e.target.value)}
                error={formErrors.projectUid}
                placeholder="aBc123XyZ456"
                required
                helperText="The project asset UID from your KoboToolbox project URL"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Format
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value="json"
                    checked={formData.format === 'json'}
                    onChange={(e) => handleChange('format', e.target.value as 'json' | 'csv')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">JSON</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value="csv"
                    checked={formData.format === 'csv'}
                    onChange={(e) => handleChange('format', e.target.value as 'json' | 'csv')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">CSV</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <Input
                label="Max Rows to Process"
                type="number"
                value={formData.maxRows}
                onChange={(e) => handleChange('maxRows', e.target.value)}
                error={formErrors.maxRows}
                placeholder="Leave empty to process all rows"
                helperText="Process only the first N rows (e.g., 100). Leave empty to process all rows."
                min="1"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This will create a Project named "Levantamiento Info Parcelas" if it doesn't exist.
              For each column in your data, a Feature will be created (or reused if it already exists).
              Each row will become a Tree, and cell values will be stored as RawData entries.
              Audio files will be downloaded and uploaded to S3 storage.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={loading}>
              Start Import
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};


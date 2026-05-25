import React, { useMemo } from 'react';
import { useListSatelliteTopologies } from '../../hooks/useSatelliteTopology';
import type { SatelliteTopologyAssociationSelection } from '../../types/satelliteTopologyModelAI';
import { Select } from '../ui/Select';
import { MultiSelect } from '../ui/MultiSelect';

interface SatelliteTopologyAssociationFieldsProps {
  selection: SatelliteTopologyAssociationSelection;
  onChange: (selection: SatelliteTopologyAssociationSelection) => void;
  errors?: { parentId?: string; childIds?: string };
  disabled?: boolean;
}

function topologyLabel(name: string, type: string, parentName?: string): string {
  const base = `${name} (${type})`;
  return parentName ? `${parentName} › ${base}` : base;
}

export const SatelliteTopologyAssociationFields: React.FC<
  SatelliteTopologyAssociationFieldsProps
> = ({ selection, onChange, errors, disabled = false }) => {
  const { satelliteTopologies, loading } = useListSatelliteTopologies();

  const nodeById = useMemo(() => {
    const m = new Map<string, (typeof satelliteTopologies)[0]>();
    satelliteTopologies.forEach((n) => m.set(n.id, n));
    return m;
  }, [satelliteTopologies]);

  const childrenByParentId = useMemo(() => {
    const m = new Map<string, typeof satelliteTopologies>();
    for (const n of satelliteTopologies) {
      const pid = n.satelliteTopologySatelliteTopologiesId;
      if (!pid) continue;
      const arr = m.get(pid) ?? [];
      arr.push(n);
      m.set(pid, arr);
    }
    return m;
  }, [satelliteTopologies]);

  /** Root parents: nodes with no parent in the loaded set. */
  const parentOptions = useMemo(() => {
    const ids = new Set(satelliteTopologies.map((n) => n.id));
    return satelliteTopologies
      .filter((n) => {
        const pid = n.satelliteTopologySatelliteTopologiesId;
        return !pid || !ids.has(pid);
      })
      .map((n) => ({
        value: n.id,
        label: topologyLabel(n.name, n.type),
      }));
  }, [satelliteTopologies]);

  /** Leaves descending from a given root, walking the full subtree. */
  const childOptions = useMemo(() => {
    const parentId = selection.parentId;
    if (!parentId) return [];

    const leaves: typeof satelliteTopologies = [];
    const visited = new Set<string>();
    const stack = [...(childrenByParentId.get(parentId) ?? [])];
    while (stack.length > 0) {
      const node = stack.pop()!;
      if (visited.has(node.id)) continue;
      visited.add(node.id);
      const kids = childrenByParentId.get(node.id) ?? [];
      if (kids.length === 0) {
        leaves.push(node);
      } else {
        stack.push(...kids);
      }
    }

    leaves.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    return leaves.map((n) => {
      const directParent = nodeById.get(n.satelliteTopologySatelliteTopologiesId ?? '');
      return {
        value: n.id,
        label: topologyLabel(n.name, n.type, directParent?.name),
        description: n.description || undefined,
      };
    });
  }, [satelliteTopologies, selection.parentId, nodeById, childrenByParentId]);

  /** Walks descendants under a parent and returns the set of all descendant ids. */
  const descendantIds = useMemo(() => {
    const set = new Set<string>();
    if (!selection.parentId) return set;
    const stack = [...(childrenByParentId.get(selection.parentId) ?? [])];
    while (stack.length > 0) {
      const node = stack.pop()!;
      if (set.has(node.id)) continue;
      set.add(node.id);
      stack.push(...(childrenByParentId.get(node.id) ?? []));
    }
    return set;
  }, [selection.parentId, childrenByParentId]);

  const handleParentChange = (parentId: string) => {
    if (!parentId) {
      onChange({ parentId: '', childIds: [] });
      return;
    }
    const stack = [...(childrenByParentId.get(parentId) ?? [])];
    const allowed = new Set<string>();
    while (stack.length > 0) {
      const node = stack.pop()!;
      if (allowed.has(node.id)) continue;
      allowed.add(node.id);
      stack.push(...(childrenByParentId.get(node.id) ?? []));
    }
    onChange({
      parentId,
      childIds: selection.childIds.filter((id) => allowed.has(id)),
    });
  };

  return (
    <div className="space-y-6 md:col-span-2 border-t border-gray-200 pt-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Satellite topology</h3>
        <p className="mt-1 text-sm text-gray-500">
          Link this model to a parent satellite topology node and optional child nodes (e.g. bands under a satellite).
        </p>
      </div>

      <Select
        label="Parent satellite topology"
        value={selection.parentId}
        onChange={(e) => handleParentChange(e.target.value)}
        options={parentOptions}
        placeholder="None"
        disabled={disabled || loading}
        error={errors?.parentId}
        helperText="Only root satellite topology nodes are listed here."
      />

      <MultiSelect
        label="Child satellite topologies (leaves)"
        options={childOptions}
        selectedValues={selection.childIds.filter((id) => descendantIds.has(id))}
        onChange={(childIds) => onChange({ ...selection, childIds })}
        placeholder={
          selection.parentId
            ? 'Select leaf nodes under the parent…'
            : 'Select a parent first to load its leaves'
        }
        disabled={disabled || loading || !selection.parentId}
        error={errors?.childIds}
        helperText={
          selection.parentId
            ? `${selection.childIds.filter((id) => descendantIds.has(id)).length} leaf node(s) selected`
            : 'Pick a root parent above to enable this field'
        }
        searchable
      />
    </div>
  );
};

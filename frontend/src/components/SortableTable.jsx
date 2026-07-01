import { useState } from 'react';

export function useSortableData(data, defaultSort = null) {
  const [sort, setSort] = useState(defaultSort);

  const sorted = [...(data || [])].sort((a, b) => {
    if (!sort) return 0;
    const aVal = a[sort.key] ?? '';
    const bVal = b[sort.key] ?? '';
    const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
    return sort.dir === 'ASC' ? cmp : -cmp;
  });

  const toggle = (key) => {
    setSort((prev) =>
      prev?.key === key ? { key, dir: prev.dir === 'ASC' ? 'DESC' : 'ASC' } : { key, dir: 'ASC' }
    );
  };

  return { sorted, sort, toggle };
}

export function SortableTh({ col, sort, onToggle, children }) {
  const isActive = sort?.key === col;
  return (
    <th onClick={() => onToggle(col)}>
      {children}
      <span className={`sort-icon ${isActive ? 'active' : ''}`}>
        {isActive ? (sort.dir === 'ASC' ? ' ↑' : ' ↓') : ' ↕'}
      </span>
    </th>
  );
}

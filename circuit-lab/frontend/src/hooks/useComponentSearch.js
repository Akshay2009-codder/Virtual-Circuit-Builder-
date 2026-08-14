/**
 * Component Search Filter Hook
 */
import { useState, useMemo } from 'react';

export function useComponentSearch(componentList) {
  const [query, setQuery] = useState('');

  const filteredComponents = useMemo(() => {
    if (!query) return componentList;
    return componentList.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, componentList]);

  return { query, setQuery, filteredComponents };
}

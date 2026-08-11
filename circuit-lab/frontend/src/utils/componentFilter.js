// Utility functions for searching and filtering electronics palette components

export function filterComponents(components, query = "", category = "all") {
  if (!Array.isArray(components)) return [];

  const q = query.trim().toLowerCase();

  return components.filter((comp) => {
    const matchesCategory = category === "all" || comp.category === category;
    const matchesQuery =
      !q ||
      comp.name?.toLowerCase().includes(q) ||
      comp.key?.toLowerCase().includes(q) ||
      comp.category?.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });
}

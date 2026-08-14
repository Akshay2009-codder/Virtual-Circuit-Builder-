/**
 * Helper Hook for Form Input Field Validation
 */
import { useState } from 'react';

export function useFormValidation(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (field, val) => {
    setValues(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return { values, errors, setErrors, handleChange };
}

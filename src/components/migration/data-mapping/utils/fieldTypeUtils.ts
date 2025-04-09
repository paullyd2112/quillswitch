
/**
 * Detects field type based on field name
 */
export const detectFieldType = (fieldName: string): string => {
  const name = fieldName.toLowerCase();
  
  if (name.includes('date') || name.includes('time')) {
    return 'Date';
  } else if (name.includes('email')) {
    return 'Email';
  } else if (name.includes('phone')) {
    return 'Phone';
  } else if (name.includes('name')) {
    return 'Name';
  } else if (name.includes('id') || name.includes('key')) {
    return 'ID';
  } else {
    return 'Text';
  }
};

/**
 * Returns CSS classes for field type badges
 */
export const getDataTypeColor = (fieldName: string): string => {
  if (fieldName.includes('date') || fieldName.includes('time')) 
    return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
  if (fieldName.includes('email')) 
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  if (fieldName.includes('phone')) 
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  if (fieldName.includes('name')) 
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
  if (fieldName.includes('id') || fieldName.includes('key'))
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
};


// Predefined transformation templates for common data transformations
export const TRANSFORMATION_TEMPLATES = [
  { 
    name: "Uppercase", 
    description: "Convert text to uppercase", 
    code: "return value ? value.toUpperCase() : value;" 
  },
  { 
    name: "Lowercase", 
    description: "Convert text to lowercase", 
    code: "return value ? value.toLowerCase() : value;"
  },
  { 
    name: "Capitalize", 
    description: "Capitalize first letter of each word", 
    code: `return value ? value.replace(/\\b\\w/g, char => char.toUpperCase()) : value;`
  },
  { 
    name: "Trim", 
    description: "Remove whitespace from start and end", 
    code: "return value ? value.trim() : value;"
  },
  { 
    name: "Extract numbers", 
    description: "Extract only numbers from text", 
    code: `return value ? value.replace(/[^0-9]/g, '') : value;`
  },
  { 
    name: "Format phone", 
    description: "Format as (XXX) XXX-XXXX", 
    code: `const digits = value ? value.replace(/\\D/g, '') : '';
if (digits.length === 10) {
  return \`(\${digits.substring(0, 3)}) \${digits.substring(3, 6)}-\${digits.substring(6)}\`;
}
return value;`
  },
  { 
    name: "Format date", 
    description: "Format date as YYYY-MM-DD", 
    code: `if (!value) return value;
try {
  const date = new Date(value);
  return date.toISOString().split('T')[0];
} catch (e) {
  return value;
}`
  },
  { 
    name: "Round number", 
    description: "Round number to 2 decimal places", 
    code: `if (!value) return value;
const num = parseFloat(value);
return isNaN(num) ? value : num.toFixed(2);`
  }
];

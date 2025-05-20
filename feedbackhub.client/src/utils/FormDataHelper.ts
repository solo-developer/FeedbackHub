interface AnyObject {
  [key: string]: string | number | boolean | File[] | undefined | null;
}

/**
 * Converts a plain object into FormData.
 * Automatically appends arrays of Files under the same key.
 */
export function buildFormData(data: AnyObject): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value == null) return;
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value) && value[0] instanceof File) {
      value.forEach((file) => formData.append(key, file));
    }
    else {
      formData.append(key, value.toString());
    }
  });

  return formData;
}

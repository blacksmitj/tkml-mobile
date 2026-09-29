export const formatRupiah = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0 : value;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatNik = (raw: string): string => {
  return raw.replace(/[^0-9]/g, '').slice(0, 16);
};

export const formatPhoneNumber = (raw: string): string => {
  return raw.replace(/[^0-9]/g, '').slice(0, 14);
};

export const maskNik = (nik: string): string => {
  if (!nik || nik.length < 16) return nik || '-';
  return `${nik.slice(0, 6)}******${nik.slice(12)}`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

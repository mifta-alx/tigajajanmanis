import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToWebP = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas toBlob failed"));
          },
          "image/webp",
          0.8,
        );
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

export const isInvalid = (field: any) => {
  return field.state.meta.isTouched && !field.state.meta.isValid;
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export const unformatPriceBase = (formattedPrice: string) => {
  if (!formattedPrice) return 0;
  let numeric = formattedPrice.replace(/[^0-9,-]+/g, "");
  numeric = numeric.replace(/\./g, "");
  numeric = numeric.replace(",", ".");
  const result = parseFloat(numeric);
  return isNaN(result) ? 0 : result;
};

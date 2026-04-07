// ✅ FIXED: Image source helper function
export const getImageSrc = (img) => {
  if (!img) return "/default-avatar.png";

  if (img.startsWith("data:image")) {
    return img; // base64 → use directly
  }

  if (img.startsWith("http")) {
    return img; // full URL → use directly
  }

  if (img.startsWith("/uploads/")) {
    return `http://localhost:5000${img}`; // backend path → add base URL
  }

  // Default fallback
  return `http://localhost:5000${img}`;
};

// ✅ DEBUG: Image type detector
export const getImageType = (img) => {
  if (!img) return "No Image";
  
  if (img.startsWith("data:image/")) return "Base64";
  if (img.startsWith("http")) return "Full URL";
  if (img.startsWith("/uploads/")) return "File Path";
  
  return "Unknown";
};

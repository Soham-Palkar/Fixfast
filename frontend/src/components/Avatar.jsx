export default function Avatar({ name, img }) {
  const firstLetter = name ? name.charAt(0).toUpperCase() : "?";

  if (img) {
    return (
      <img
        src={img}
        alt={name}
        className="h-20 w-20 rounded-full object-cover border"
      />
    );
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-white text-3xl font-bold border">
      {firstLetter}
    </div>
  );
}
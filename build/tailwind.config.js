/** Build local du CSS Tailwind (remplace le CDN runtime, déconseillé en prod). */
module.exports = {
  content: ["./sites/navlys/*.html", "./sites/brunopartouche/*.html"],
  theme: { extend: {} },
  plugins: [],
};

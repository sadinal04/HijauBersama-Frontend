// components/Footer.js
const Footer = () => {
  return (
    <footer className="bg-[#006A71] text-[#F2EFE7] py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm">© {new Date().getFullYear()} HijauBersama. Semua Hak Dilindungi.</p>
        <p className="text-xs mt-2">Bersama kita hijaukan bumi! 🌿</p>
      </div>
    </footer>
  );
};

export default Footer;
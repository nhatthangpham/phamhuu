export default function phaKyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-2 md:p-4">
      {/* Tiêu đề trang trọng */}
      <h1 className="text-2xl md:text-3xl font-bold my-6 text-stone-800 font-serif uppercase tracking-wider text-center">
        Phả Ký Dòng Họ Phạm Hữu
      </h1>

      {/* Khung chứa Ebook lật trang */}
      <div 
        className="w-full max-w-6xl shadow-2xl rounded-lg overflow-hidden border border-stone-200 bg-white" 
        style={{ height: '82vh', minHeight: '500px' }}
      >
        <iframe 
          src="https://heyzine.com/flip-book/c4c44f0283.html" 
          style={{ width: '100%', height: '100%', border: 'none' }} 
          allowFullScreen
          title="Phả Ký Ebook"
        ></iframe>
      </div>

      {/* Hướng dẫn nhỏ phía dưới */}
      <p className="mt-4 text-stone-500 text-sm italic text-center">
        * Anh/Chị vui lòng nhấn vào góc trang hoặc vuốt để lật sách
      </p>
    </div>
  );
}

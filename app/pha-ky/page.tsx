export default function PhaKyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-red-800 uppercase">
        Phả Ký Dòng Họ Phạm Hữu
      </h1>
      
      <div className="w-full max-w-6xl shadow-xl rounded-lg overflow-hidden" style={{ height: '80vh' }}>
        <iframe 
          src="https://heyzine.com/flip-book/c4c44f0283.html" 
          style={{ width: '100%', height: '100%', border: 'none' }} 
          allowFullScreen
        ></iframe>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        * Nhấn vào góc trang hoặc dùng phím mũi tên để lật sách
      </div>
    </div>
  )
}

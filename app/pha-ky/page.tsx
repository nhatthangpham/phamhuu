export default function PhaKyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-stone-800 font-serif uppercase">
        Phả Ký Dòng Họ Phạm Hữu
      </h1>
      <div className="w-full max-w-6xl shadow-2xl rounded-lg overflow-hidden border border-stone-200" style={{ height: '85vh' }}>
        <iframe 
          src="https://heyzine.com/flip-book/c4c44f0283.html" 
          style={{ width: '100%', height: '100%', border: 'none' }} 
          allowFullScreen
        ></iframe>
      </div>
    </div>
  )
}

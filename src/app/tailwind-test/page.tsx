export default function TailwindTest() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Tailwind CSS Test</h1>
        <p className="text-gray-600 mb-6">
          If you can see this styled page, Tailwind CSS is working correctly!
        </p>
        <div className="space-y-3">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Base styles loaded
          </div>
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            ✅ Component classes working
          </div>
          <div className="bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded">
            ✅ Utility classes working
          </div>
        </div>
        <button className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
          Test Button
        </button>
      </div>
    </div>
  );
}

export default function SimpleTest() {
  return (
    <div>
      <h1 style={{color: 'red'}}>This should be red (inline style)</h1>
      <h2 className="text-blue-500">This should be blue (Tailwind)</h2>
      <div className="bg-green-500 text-white p-4 m-4">
        This should have green background (Tailwind)
      </div>
      <div className="w-32 h-32 bg-purple-500 rounded-lg">
        Purple square (Tailwind)
      </div>
    </div>
  )
}
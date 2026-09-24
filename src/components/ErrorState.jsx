export default function ErrorState({ message, onRetry }) {
  return <div className="rounded-lg bg-red-50 p-6 text-center text-red-700"><p>{message}</p><button onClick={onRetry} className="mt-3 rounded bg-red-600 px-4 py-2 text-white">Retry</button></div>;
}
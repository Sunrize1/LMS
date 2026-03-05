export function Spinner() {
  return (
    <div role="status" className="flex items-center justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      <span className="sr-only">Загрузка...</span>
    </div>
  )
}

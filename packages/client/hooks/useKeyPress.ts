import { useCallback, useEffect } from 'react'

function useKeyPress(targetKey: string, handler: () => void) {
  const downHandler = useCallback(
    ({ key }) => {
      if (key === targetKey) {
        handler()
      }
    },
    [handler, targetKey]
  )

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    return () => {
      window.removeEventListener('keydown', downHandler)
    }
  }, [downHandler])
}

export default useKeyPress

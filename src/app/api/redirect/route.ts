'use client'
import { useRouter } from 'next/navigation'

const usePageRedirect = (pageName: string) => {
  const router = useRouter()

  return () => {
    router.push(`/${pageName}`)
  }
}

export default usePageRedirect
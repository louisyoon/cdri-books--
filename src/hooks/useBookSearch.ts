import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchBooks } from "@/api/kakaoBook"

export const useBookSearch = (query: string) => {
    return useInfiniteQuery({
        queryKey: ["books", query],
        queryFn: ({ pageParam }) => fetchBooks(query, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage?.meta?.is_end) return undefined
            return (allPages?.length ?? 0) + 1
        },
        enabled: !!query,
    })
}

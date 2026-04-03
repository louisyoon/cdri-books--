import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchBooksByIsbnBatch } from "@/api/kakaoBook"

const PAGE_SIZE = 10

export const useLikedBooks = (allIsbns: string[]) => {
    return useInfiniteQuery({
        queryKey: ["likedBooks", allIsbns],
        queryFn: ({ pageParam }) => {
            const slice = allIsbns.slice(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE)
            return fetchBooksByIsbnBatch(slice)
        },
        initialPageParam: 0,
        getNextPageParam: (_, allPages) => {
            const fetched = allPages.length * PAGE_SIZE
            return fetched < allIsbns.length ? allPages.length : undefined
        },
        enabled: allIsbns.length > 0,
    })
}

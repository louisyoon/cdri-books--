export interface IBook {
    title: string
    authors: string[]
    publisher: string
    thumbnail: string
    isbn: string
    datetime: string
    price: number
    sale_price: number
    url: string
    contents: string
    translators: string[]
    status: string
}

export interface BookResponse {
    documents: IBook[]
    meta: {
        is_end: boolean
        pageable_count: number
        total_count: number
    }
}

export const fetchBooks = async (query: string, page: number): Promise<BookResponse> => {
    const params = new URLSearchParams({ query, target: "title", size: "10", page: String(page) })
    const res = await fetch(`https://dapi.kakao.com/v3/search/book?${params}`, {
        headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_API}`,
        },
    })
    if (!res.ok) throw new Error("에러발생")
    return res.json()
}

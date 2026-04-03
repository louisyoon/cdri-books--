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

const fetchBookByIsbn = async (isbn: string): Promise<IBook | null> => {
    const isbn13 = isbn.split(" ").find((v) => v.length === 13) ?? isbn
    const params = new URLSearchParams({ query: isbn13, target: "isbn", size: "1" })
    const res = await fetch(`https://dapi.kakao.com/v3/search/book?${params}`, {
        headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_API}`,
        },
    })
    if (!res.ok) throw new Error("에러발생")
    const data: BookResponse = await res.json()
    return data.documents[0] ?? null
}

export const fetchBooksByIsbnBatch = async (isbns: string[]): Promise<IBook[]> => {
    const results = await Promise.all(isbns.map(fetchBookByIsbn))
    return results.filter(Boolean) as IBook[]
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

import { useState, useRef, useEffect } from "react"
import Container from "@/components/Common/Container"
import { Typography } from "@/components/Typography"
import NoData from "@/assets/icon/nodata.svg?react"
import { useLikedBooks } from "@/hooks/useLikedBooks"
import BookArea from "../BookArea"

const getLikes = (): string[] => {
    try {
        return JSON.parse(localStorage.getItem('like_books') ?? "[]")
    } catch {
        return []
    }
}

const Section2 = () => {
    const [isbns, setIsbns] = useState<string[]>(() => getLikes())
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useLikedBooks(isbns)
    const books = data?.pages.flat() ?? []
    const observerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = observerRef.current
        if (!el) return
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
            }
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    const handleLikeChange = () => {
        setIsbns(getLikes())
    }

    return (
        <section className="mt-20">
            <Container className="flex flex-col gap-4">
                <Typography
                    variant="title2"
                    title="내가 찜한 책"
                />

                <div className="flex items-center gap-4 font-medium text-t-primary">
                    <p>찜한 책</p>
                    <p>총 <span className="text-primary">{isbns.length.toLocaleString()}</span>건</p>
                </div>
            </Container>

            <Container>
                {isLoading ? (
                    <div className="flex justify-center items-center mt-30">
                        <p className="text-t-sub-title">불러오는 중...</p>
                    </div>
                ) : books.length > 0 ? (
                    <div className="mt-9">
                        {books.map((book, idx) => (
                            <BookArea
                                key={book.isbn}
                                book={book}
                                idx={idx}
                                onLikeChange={handleLikeChange}
                            />
                        ))}
                        <div ref={observerRef} className="h-1" />
                        {isFetchingNextPage && (
                            <div className="flex justify-center py-4">
                                <p className="text-t-sub-title text-sm">불러오는 중...</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center gap-6 mt-30">
                        <NoData
                            className="w-20 h-20"
                            role="img"
                            aria-label="데이터 없음"
                        />
                        <Typography
                            variant="caption"
                            title="찜한 책이 없습니다."
                            className="text-t-sub-title!"
                        />
                    </div>
                )}
            </Container>
        </section>
    )
}

export default Section2

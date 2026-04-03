import { useRef, useState, useEffect } from "react"
import Container from "@/components/Common/Container"
import { Typography } from "@/components/Typography"
import SearchIcon from "@/assets/icon/search.svg?react"
import NoData from "@/assets/icon/nodata.svg?react"
import XMark from "@/assets/icon/xMark.svg?react"
import { useBookSearch } from "@/hooks/useBookSearch"
import BookArea from "../BookArea"

const getHistory = (): string[] => {
    try {
        return JSON.parse(localStorage.getItem('search_history') ?? "[]")
    }
    catch {
        return []
    }
}

const saveHistory = (keyword: string) => {
    const prev = getHistory().filter((k) => k !== keyword)
    const next = [keyword, ...prev].slice(0, 8)
    localStorage.setItem('search_history', JSON.stringify(next))
}

const removeHistory = (keyword: string) => {
    const next = getHistory().filter((k) => k !== keyword)
    localStorage.setItem('search_history', JSON.stringify(next))
}

const Section1 = () => {
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [history, setHistory] = useState<string[]>([])
    const [value, setValue] = useState<string>("")
    const [query, setQuery] = useState<string>("")
    const inputRef = useRef<HTMLInputElement>(null)


    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useBookSearch(query)
    const books = data?.pages.flatMap((p) => p.documents) ?? []
    const totalCount = data?.pages[0]?.meta.total_count ?? 0
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

    // input focus 이벤트
    const handleFocus = () => {
        setHistory(getHistory())
        setIsFocused(true)
    }

    // input blur 이벤트
    const handleBlur = () => {
        setIsFocused(false)
    }

    // input change 이벤트
    const handleSearch = (keyword: string) => {
        if (!keyword.trim()) return
        saveHistory(keyword.trim())
        setHistory(getHistory())
        setValue(keyword.trim())
        setQuery(keyword.trim())
    }

    // input enter 이벤트
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            handleSearch(value)
            setIsFocused(false)
            inputRef.current?.blur()
        }
    }

    // 검색기록 클릭 이벤트
    const handleHistoryClick = (keyword: string) => {
        setValue(keyword)
        handleSearch(keyword)
        inputRef.current?.blur()
    }

    // 검색기록 삭제 이벤트
    const handleRemove = (keyword: string) => {
        removeHistory(keyword)
        setHistory(getHistory())
    }

    // 히스토리 노출 여부
    const isShowHistory = isFocused && history.length > 0

    // 상세검색 버튼이벤트
    const handleBtn = () => {
        handleSearch(value)
        setIsFocused(false)
        inputRef.current?.blur()
    }
    return (
        <section className="pt-25">
            <Container className="flex flex-col gap-4">
                <Typography
                    variant="title2"
                    title="도서 검색"
                />

                <div className="flex items-start gap-4 mb-2">
                    <div className="relative w-full max-w-120">
                        <div className={`flex items-center gap-2.75 p-2.5 bg-light-gray ${isShowHistory ? "rounded-t-2xl" : "rounded-full"}`}>
                            <SearchIcon
                                className="w-[1.875rem] h-[1.875rem] shrink-0"
                                role="img"
                                aria-label="검색"
                            />
                            <input
                                ref={inputRef}
                                type="text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
                                className="bg-transparent outline-0 w-full"
                                placeholder="검색어를 입력하세요"
                            />
                        </div>
                        {isShowHistory && (
                            <ul className="top-full left-0 z-10 absolute bg-light-gray pb-2 rounded-b-2xl w-full">
                                {history.map((keyword, idx) => (
                                    <li
                                        key={idx}
                                        className="flex justify-between items-center hover:bg-gray px-5 py-2.5 cursor-pointer"
                                        onMouseDown={(e) => {
                                            e.preventDefault()
                                            handleHistoryClick(keyword)
                                        }}
                                    >
                                        <span className="text-default text-t-secondary">
                                            {keyword}
                                        </span>

                                        <XMark
                                            className="w-6 h-6 cursor-pointer"
                                            role="img"
                                            aria-label="삭제"
                                            onMouseDown={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleRemove(keyword)
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button
                        className="px-[10px] py-[10.6px] border border-t-sub-title rounded-lg cursor-pointer shrink-0"
                        onClick={handleBtn}
                    >
                        <Typography
                            variant="body2"
                            title="상세검색"
                            className="text-t-sub-title!"
                        />
                    </button>

                </div>

                <div className="flex items-center gap-4 font-medium text-t-primary">
                    <p>도서 검색 결과</p>
                    <p>총 <span className="text-primary">{totalCount}</span>건</p>
                </div>
            </Container>

            <Container>
                {isLoading ? (
                    <div className="flex justify-center items-center mt-30">
                        <p className="text-t-sub-title">검색 중...</p>
                    </div>
                ) :
                    books && books.length > 0 ? (
                        <div className="mt-9">
                            {
                                books.map((book, idx) => (
                                    <BookArea
                                        key={idx}
                                        book={book}
                                        idx={idx}
                                    />
                                ))
                            }
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
                                title="검색된 결과가 없습니다."
                                className="text-t-sub-title!"
                            />
                        </div>
                    )}
            </Container>
        </section>
    )
}

export default Section1 
import type { IBook } from "@/api/kakaoBook"
import { Typography } from "@/components/Typography"
import CustomButton from "@/components/Common/CustomButton"
import { useState, useEffect } from "react"
import LikeOff from "@/assets/icon/likeOff.svg?react"
import LikeOn from "@/assets/icon/likeOn.svg?react"
import Arrow from "@/assets/icon/arrow.svg?react"

const getLikes = (): string[] => {
    try {
        return JSON.parse(localStorage.getItem('like_books') ?? "[]")
    } catch {
        return []
    }
}

const toggleLike = (isbn: string): boolean => {
    const prev = getLikes()
    const isLiked = prev.includes(isbn)
    const next = isLiked ? prev.filter((i) => i !== isbn) : [isbn, ...prev,]
    localStorage.setItem('like_books', JSON.stringify(next))
    return !isLiked
}

interface IBookArea {
    book: IBook
    idx: number
    onLikeChange?: () => void
}

const BookArea = ({ book, idx, onLikeChange }: IBookArea) => {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
    const isSelected = selectedIdx === idx
    const [liked, setLiked] = useState<boolean>(false)

    useEffect(() => {
        setLiked(getLikes().includes(book.isbn))
    }, [book.isbn])

    const handleLike = () => {
        const next = toggleLike(book.isbn)
        setLiked(next)
        onLikeChange?.()
    }

    const hasDiscount = book.sale_price > 0 && book.sale_price !== book.price

    return (
        <div className="flex gap-0 py-4 border-[#D2D6DA] border-b">
            {/* 이미지 */}
            <div className={`relative shrink-0 transition-all duration-300 ${isSelected ? "mx-9 w-52.5 h-70" : "mx-12 w-12 h-17"}`}>
                <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover" />
                <button
                    className={`absolute cursor-pointer ${isSelected ? "top-2 right-2" : "top-0 right-0"}`}
                    onClick={handleLike}
                    aria-label={liked ? "찜 해제" : "찜하기"}
                >
                    {liked
                        ? <LikeOn className={isSelected ? "w-6 h-6" : "w-5 h-5"} />
                        : <LikeOff className={isSelected ? "w-6 h-6" : "w-5 h-5"} />
                    }
                </button>
            </div>

            {isSelected ? (
                /* ── 상세보기 열린 상태 ── */
                <>
                    {/* 중앙: 제목/저자 + 책 소개 + 내용 */}
                    <div className="flex flex-col flex-1 gap-4 pt-5 min-w-0">
                        <div className="flex flex-wrap items-center gap-4">
                            <Typography
                                variant="title3"
                                title={book.title}
                                className=""
                            />
                            <Typography
                                variant="body2"
                                title={book.authors.join(', ')}
                                className="text-t-secondary shrink-0"
                            />
                        </div>
                        <Typography
                            variant="body2B"
                            title="책 소개"
                            className=""
                        />
                        <p className="text-10 text-t-primary">
                            {book.contents
                                ? book.contents.split(/  /).map((line, i, arr) => (
                                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                                ))
                                : "상세 내용이 없습니다."}
                        </p>
                    </div>

                    {/* 우측: 상세보기 버튼 + (가격 + 구매하기) */}
                    <div className="flex flex-col justify-between items-end px-4 shrink-0">
                        <CustomButton
                            isSecondary
                            icon={Arrow}
                            iconReverse={isSelected}
                            label="상세보기"
                            className=""
                            onClick={() => setSelectedIdx(null)}
                        />
                        <div className="flex flex-col items-end gap-7">
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-2">
                                    <p className="text-10 text-t-secondary">
                                        원가
                                    </p>
                                    <p className={`text-lg ${hasDiscount ? "font-[350] line-through" : "font-bold"}`}>{(hasDiscount ? book.sale_price : book.price).toLocaleString()}원</p>
                                </div>
                                {hasDiscount && (
                                    <div className="flex items-center gap-2">
                                        <p className="text-10 text-t-secondary">
                                            할인가
                                        </p>
                                        <p className="font-bold text-lg">{book.price.toLocaleString()}원</p>
                                    </div>
                                )}
                            </div>
                            <CustomButton
                                label="구매하기"
                                width={240}
                                className="h-16"
                                onClick={() => window.open(book.url, "_blank")}
                            />
                        </div>
                    </div>
                </>
            ) : (
                /* ── 기본 상태 ── */
                <div className="flex flex-1 justify-between items-center">
                    <div className="flex items-center gap-4 w-102">
                        <Typography
                            variant="title3"
                            title={book.title}
                            className="truncate"
                        />
                        <Typography
                            variant="body2"
                            title={book.authors.join(', ')}
                            className="text-t-secondary shrink-0"
                        />
                    </div>
                    <Typography
                        variant="title3"
                        title={`${book.price.toLocaleString()}원`}
                    />
                    <div className="flex items-center gap-2 px-4">
                        <CustomButton
                            label="구매하기"
                            onClick={() => window.open(book.url, "_blank")}
                        />
                        <CustomButton
                            isSecondary
                            icon={Arrow}
                            iconReverse={isSelected}
                            label="상세보기"
                            onClick={() => setSelectedIdx(idx)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default BookArea

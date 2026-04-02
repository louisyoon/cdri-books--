import { Typography } from "../Typography"

interface IHeader {
    tab: number
    setTab: React.Dispatch<React.SetStateAction<number>>
}

const Header = ({ tab, setTab }: IHeader) => {
    const menu: string[] = ["도서 검색", "내가 찜한 책"]

    const changeTab = (idx: number) => {
        setTab(idx)
    }

    return (
        <header className="top-0 z-50 sticky bg-white">
            <div className="z-50 relative flex justify-center items-center mx-auto max-w-400 h-20">
                <div className="top-0 left-0 absolute flex items-center h-full">
                    <Typography
                        variant="title1"
                        title="CERTICOS BOOKS"
                    />
                </div>

                <nav className="flex items-center gap-14">
                    {
                        menu.map((label, idx) => (
                            <div
                                onClick={() => changeTab(idx)}
                                key={idx}
                            >
                                <Typography
                                    variant="body1"
                                    title={label}
                                    className={`border-b cursor-pointer ${tab === idx ? 'border-primary' : 'border-transparent'}`}
                                    isSpan
                                />
                            </div>
                        ))
                    }
                    <div className="w-19.75"></div>
                </nav>
            </div>
        </header>
    )
}

export default Header
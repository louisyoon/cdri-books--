interface IConatainer {
    children: React.ReactNode
    className?: React.HTMLAttributes<HTMLElement>["className"];
}

const Container = ({ children, className }: IConatainer) => {
    return (
        <div className={`container ${className ? className : ''}`}>
            {children}
        </div>
    )
}

export default Container
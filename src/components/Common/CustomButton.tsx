import { Typography } from "../Typography";

interface ICustomButton {
    label: string
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
    isSecondary?: boolean
    className?: string
    iconReverse?: boolean
    width?: number
}

const CustomButton = ({
    label,
    onClick,
    icon: Icon,
    isSecondary = false,
    className = "",
    iconReverse = false,
    width,
}: ICustomButton) => {
    return (
        <button
            className={`flex items-center justify-center gap-1.5 rounded-lg w-28.75 h-12 transition-all cursor-pointer ${isSecondary ? "bg-light-gray hover:bg-[#ededed]" : "bg-primary hover:bg-[#3e6ac2]"} ${className}`}
            style={width ? { width } : undefined}
            onClick={onClick}
        >
            <Typography
                variant="caption"
                title={label}
                className={isSecondary ? "text-t-secondary!" : "text-white!"}
            />
            {Icon && <Icon className={`w-4 h-4 transition-all duration-300 ${iconReverse ? "rotate-180" : "rotate-0"}`} />}
        </button>
    )
}

export default CustomButton

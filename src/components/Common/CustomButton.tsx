import { Typography } from "../Typography";

interface ICustomButton {
    label: string
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const CustomButton = ({
    label,
    onClick
}: ICustomButton) => {
    return (
        <button
            className="bg-primary hover:bg-[#3e6ac2] rounded-lg w-28.75 h-12 transition-all cursor-pointer"
            onClick={onClick}
        >
            <Typography
                variant="caption"
                title={label}
                className="text-white!"
            />
        </button>
    )
}

export default CustomButton
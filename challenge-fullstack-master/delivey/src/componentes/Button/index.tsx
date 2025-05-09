import style from "./Button.module.css";

type ButtonProps = {
    label: string
    color: string
    onClick?: () => void
}

const Button = (props: ButtonProps) => {
    return (
        <button onClick={props.onClick} className= {style.button} style={{backgroundColor: props.color}}>{props.label} 
        </button>
    )
}

export default Button;
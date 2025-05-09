import style from "./Input.module.css";

type Props = {
    label: string;
    aoAlterar: (value : string) => void
};


const Input = (props: Props) => {


    return (
        <div className={style.container}>
            <input
                onChange={(e)=> props.aoAlterar(e.target.value)}
                id={props.label}
                type="text"
                placeholder={props.label}
            />
        </div>
    );
};

export default Input;

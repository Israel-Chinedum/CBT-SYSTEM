// import './style.css'
import { Colors } from "./Color";

export function Button(props) {
    return (
        <button
            type={props.type}
            onClick={props.onClick}
            disabled={props.disabled}
            className={`${props.className || ""} myBtn p-2 rounded font-bold ${
                props.disabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
            style={{
                background: Colors.gradient,
                color: Colors.light
            }}
        >
            {props.name}
        </button>
    );
}

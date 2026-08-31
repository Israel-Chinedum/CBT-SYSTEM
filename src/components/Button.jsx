// import './style.css'
import { Colors } from "./Color";
export function Button(props) {
    return(
        <button 
            onClick={props.onClick}
            // ${props.className || ""}
            className={props.className + "myBtn p-2 rounded font-bold"}
            style={{
                background: Colors.gradient,
                color: Colors.light
    }}
        >{props.name}</button>
    );
}
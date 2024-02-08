import { useEffect, useRef } from "react";

export const Question = ({question, options} : {question : string, options: Array<string>}) => {
    return (
        <div className="container text-center p-4 mx-auto my-4 rounded bg-slate-200 shadow-lg">
            <p className="text-2xl font-bold text-black">{question}</p>
            {options.map(option => <Option name={question} option={option} />)}
        </div>
    );
}

const Option = ({name, option} : {name: string, option: string}) => {
    const input = useRef(null);

    return (
        <div>  
            <input hidden className="peer pointer-events-none" ref={input} name={name} id={option} type="radio" value={option}/>
            <div onClick={() => input.current ? input.current.click() : undefined} className="container box-border text-xl py-2 active:border active:border-4 active:border-slate-600 peer-checked:border-none my-1 bg-slate-200 rounded mx-auto hover:bg-slate-400 active:bg-slate-300 peer-checked:bg-blue-600 text-slate-700 peer-checked:text-slate-100 cursor-pointer peer-checked:cursor-default">
                <label className="pointer-events-none" htmlFor={option}>{option}</label>
            </div>
        </div>
    )
}
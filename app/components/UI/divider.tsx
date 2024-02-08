export const Divider = ({text} : {text?: string}) => {
    return (
        <div className="my-1 py-1 bg-white">
            <div className="mx-auto px-1 w-4/5 min-w-64">
                <div className="relative">
                    <div className="items-center flex inset-0 absolute">
                        <div className="mx-auto border-t-2 border-gray-500/50 border-solid w-full">

                        </div>
                    </div>
                    <div className="h-[1rem] justify-center flex relative">
                        {!!text ? <span className="px-1 bg-white">{text}</span> : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
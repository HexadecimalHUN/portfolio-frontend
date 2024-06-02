

interface WrapperProps{
    isIndex: boolean;
    children: React.ReactNode;
}

export default function Wrapper({ isIndex, children }: WrapperProps) {
    return (
        <div className={`md:w-4/5 w-full justify-center mt-20 overflow-y-scroll scrollbar-hide ${isIndex? "md:w-full":"" }`}>
            {children}
        </div>
    );
}
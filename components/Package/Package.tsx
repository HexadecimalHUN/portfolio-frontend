import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface PackageProps {
    isOpen: boolean;
    onClose: () => void;
    isHighlighted: boolean;
    children: React.ReactNode;
    
  }
  

export default function Package({isOpen, onClose, isHighlighted, children}: PackageProps) {
    const { t } = useTranslation();

    if(!isOpen) return null;
    return(
        <div className={`absolute md:top-0 left-0 top-16 w-screen h-auto md:h-screen m-0 z-40 flex justify-center items-center backdrop-blur-lg md:backdrop-brightness-50 ${isHighlighted ? "bg-gradient-to-br from-yellow-100/80 to-yellow-600/80 md:bg-none ":"bg-gradient-to-br from-slate-400/80 to-gray-300/80 md:bg-none"}`}>
            <div className={`flex bg-none top-16 ${isHighlighted ? " md:bg-gradient-to-br from-yellow-100/70 to-yellow-500/80":" md:bg-gradient-to-br from-slate-100/70 to-gray-300/80"} p-3 gap-2 rounded-xl md:shadow-2xl w-screen md:w-3/4 flex-col justify-start items-start  backdrop-blur-lg p-3`}>
                <div className="flex w-full justify-end items-center h-auto">
                    <button className="w-10 min-w-10 min-h-10 mt-2 mr-4 bg-slate-200/50 font-semibold text-slate-900 border rounded-full text-center hover:bg-red-700/80 hover:border:slate-700/70 hover:text-white text-xl text-bold" onClick={onClose}><FontAwesomeIcon icon={faXmark}></FontAwesomeIcon></button>
                </div>
                {children}
                
            </div>
        </div>
    )
}
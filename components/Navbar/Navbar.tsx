
import { useEffect} from "react"
import { useState } from "react"
import { Switch, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ProjectContext } from "../Context/ProjectContext";
import { useTranslation } from "react-i18next";
import Index from "../Index/Index";

interface NavigationItem {
    name: string;
    component: JSX.Element;
    current: boolean;
}

interface NavbarProps {
    currentComponent: JSX.Element | null;
    setCurrentComponent: (component: JSX.Element | null) => void;
    Navigation: NavigationItem[];
}


export default function Navbar({currentComponent, setCurrentComponent, Navigation}: NavbarProps){
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const {t, i18n} = useTranslation();
    const [isEnglish, setIsEnglish] = useState(i18n.language === 'en');

    useEffect(() => {
        // Update the state on the client after the initial render
        setIsMobile(window.innerWidth <= 768);
        // Add a resize event listener to update the state when the window size changes
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        // Remove the event listener in the cleanup function
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const toggleLanguage = () => {
        const NewLanguage = isEnglish ? 'hu' : 'en';
        i18n.changeLanguage(NewLanguage);
        setIsEnglish(!isEnglish);
    };


    const handleClick = (component: JSX.Element) => {
        setCurrentComponent(component);
        if(isMobile){
            setIsOpen(false);
        }
        window.scrollTo(0, 0);
    }
    return(
        <div className="flex top-0 fixed w-screen bg-black h-auto items-strech text-center flex-row items-center justify-center p-4 z-50 ">
                <div className="w-1/2 md:1/3">
                    <button onClick={() => handleClick(<Index currentComponent={currentComponent} setCurrentComponent={setCurrentComponent}/>)}>
                    <h1 className="text-white text-xl mb-1/2 inline-block">Háda<span className="font-bold inline-block">Károly</span></h1>
                    <h1 className="text-white text-m font-bold">Phtotography</h1>
                    </button>
                </div>
                {isMobile ?  (
                    <div className="flex w-full overflow-hidden justif-center items-end flex-col pl-2 pr-2">
                        <button onClick={()=> setIsOpen(!isOpen)} className="">
                            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-white text-2xl" />
                        </button>
                        <Transition
                            show={isOpen}
                            enter="transition ease-in-out duration-150"
                            enterFrom="opacity-0 scale-100"
                            enterTo="opacity-100 scale-100"
                            leave="transition ease-in-out duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-100"
                            >
                                <nav className="absolute right-0 w-1/2 h-screen bg-black flex flex-col justify-center gap-10 mt-5 ">
                                    {Navigation.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleClick(item.component)}
                                            className={`font-extralight ${currentComponent === item.component ? "text-white" : "text-gray-400"}`}
                                        >
                                            {item.name}
                                        </button>
                                    ))}
                                </nav>
                        </Transition>
                    </div>
                    
                ) : (
                    <nav className="flex w-2/3 justify-evenly">
                        {Navigation.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleClick(item.component)}
                                className={` font-light text-lg ${currentComponent === item.component ? "text-white" : "text-gray-400"}`}
                            >
                                {item.name}
                            </button>
                        ))}
                        <div>
                        <div className="flex items-center space-x-4">
                            <Switch
                                checked={isEnglish}
                                onChange={toggleLanguage}
                                className={`${
                                isEnglish ? 'bg-blue-600' : 'bg-gray-200'
                                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
                            >
                                <span
                                className={`${
                                    isEnglish ? 'translate-x-6' : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                                />
                            </Switch>
                            <span className={isEnglish ? 'text-white' : 'text-gray-400'}>
                                {isEnglish ? 
                                <img src="/britain.svg" alt="ENG" className="h-6 w-6 runded-sm"/> 
                                : 
                                <img src="/hungary.svg" about="HUN" className="h-5 w-6 rounded-"/>
                                }
                            </span>
                            </div>
                        </div>
                    </nav>
                )
                }
        </div>
    )
}
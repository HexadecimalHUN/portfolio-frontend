import { useEffect, useState, useContext } from "react"
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faAngleLeft, faAngleRight, faGift, faStar} from "@fortawesome/free-solid-svg-icons";
import { PackageContext } from "../Context/ProjectContext";
import {motion, useAnimation} from 'framer-motion';
import Packages from "../Packages/Packages";


interface PackagePrice{
    title: string;
    description: string;
    price: number;
    items: string[];
}

interface Banner {
    url: string;
}

interface Packages{
    title: string;
    higlighted: boolean;
    description: string;
    banner: Banner;
    images: string[];
    price: PackagePrice[]
    short_description: string;
}

interface IndexProps {
    currentComponent: JSX.Element | null;
    setCurrentComponent: (component: JSX.Element | null) => void;
}

interface SlideShowImages {
    thumbnail: string;
    large: string;
    medium: string;
    small: string;
    full: string;
}

interface SlideShow {
    images: SlideShowImages[];
}


interface Review {
    name: string;
    description: string;
    portrait: string;
    stars: number;
}

export default function Index({currentComponent, setCurrentComponent}: IndexProps) {
    const { packages} = useContext(PackageContext);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [pckButtonHoovered, setPckButtonHoovered] = useState(false);
    const [slideshows, setSlideshows] = useState<SlideShow[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    const { t } = useTranslation();

    const highlightedPackages: Packages[] = packages.filter((packageItem: Packages) => packageItem.higlighted);

    const nextImage = () => {
        setCurrentIndex((currentIndex + 1) % highlightedPackages[0].images.length);
    };

    const prevImage = () => {
        setCurrentIndex((currentIndex - 1 + highlightedPackages[0].images.length) % highlightedPackages[0].images.length);
    };
    const controls = useAnimation();

    let cheapestPackage;
    if (highlightedPackages[0] && highlightedPackages[0].price) {
    cheapestPackage = highlightedPackages[0].price.reduce((cheapest, current) => cheapest.price < current.price ? cheapest : current, highlightedPackages[0].price[0]);
    }
    

    useEffect(() => {
        controls.start(i => ({
            top: `${i * 50}px`,
            left: `${i * 40}px`,
            transition: { duration: 1.5 }
        }));
    }, [currentIndex, controls]);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const goToPackages = () => {
        setCurrentComponent(<Packages/>);
    };

    useEffect(() => {
        fetch('http://localhost:1337/api/slideshows?populate=*')
        .then(response => response.json())
        .then((data:any) => {
            const slideshows: SlideShow[] = data.data.map((item:any) => ({
                images: [
                    {
                        thumbnail: item.attributes.image.data.attributes.formats.thumbnail.url,
                        large: item.attributes.image.data.attributes.formats.large.url,
                        medium: item.attributes.image.data.attributes.formats.medium.url,
                        small: item.attributes.image.data.attributes.formats.small.url,
                        full: item.attributes.image.data.attributes.url
                    }
                ]
            }));
            setSlideshows(slideshows);
        });

        fetch('http://localhost:1337/api/reviews?populate=*')
        .then(response => response.json())
        .then((data:any) => {
            const reviews: Review[] = data.data.map((item:any) => ({
                name: item.attributes.name,
                description: item.attributes.description,
                portrait: item.attributes.portrait.data.attributes.url,
                stars: item.attributes.stars
            }))
            setReviews(reviews);
        });
    },[])
    return (
        <div className="flex mt-0 w-full h-auto bg-black flex-col items-center font-sans">
            <div className="relative flex flex-col h-auto w-full items-center justify-center customIndex h-screen">
                <div className="flex items-center text-center text-white flex-col gap-5   bg-black/10 p-2 pl-3 pr-3 backdrop-blur-sm ">
                    <div className="text-5xl md:text-8xl font-sans  rounded-md font-medium"><meta name="Site Name"/>{t("indexTitle")}</div>
                    <div className="text-2xl md:text-5xl font-light font-sans rounded-md pl-10 pr-10 md:pl-0 md:pr-0"><meta name="Site Slogen"/>{t("slogenText")}</div>
                </div>
                <div className="absolute bottom-24 text-white">
                    <FontAwesomeIcon icon={faAnglesDown} className="text-white text-3xl animate-bounce slow-bounce" />
                </div>
                <div className="absolute bottom-0 h-10 w-full bg-gradient-to-b from-black/0 to-black"></div>
            </div>
            {highlightedPackages.length > 0 && (
                <div className="flex md:w-4/5 w-full min-h-screen h-auto justify-start items-center mt-24 flex-col">
                    <div className="flex w-full text-white text-center items-center justify-center text-5xl md:text-7xl italic md:mb-40 mb-32 pl-2 pr-2">{`${t("highlighted_package")} : ${highlightedPackages[0].title}`}</div>
                    <div className="flex w-full h-auto text-white flex-col md:flex-row">
                        <div className="flex w-full md:w-1/2 justify-start items-start text-center  flex-col">
                            <div className="flex flex-col w-full justify-center gap-10" style={{height:'500px'}}>
                                <div className="relative flex w-auto h-auto jsutify-center items-center">
                                    {/* Placeholder */}
                                    <div className={windowWidth <= 640 ? 'placeholder-small' : windowWidth <= 768 ? 'placeholder-medium' : 'placeholder-large'}></div>
                                    {[currentIndex, (currentIndex + 1) % highlightedPackages[0].images.length, (currentIndex + 2) % highlightedPackages[0].images.length].map((index, i) => (
                                    <motion.img 
                                        key={index}
                                        custom={i}
                                        animate={controls}
                                        style={{ 
                                            zIndex: `${3 + i}`,
                                            filter: i !== 2 ? 'grayscale(100%) ' : 'none',
                                            opacity: i !== 2 ? 0.85 : 1,
                                            transition: 'opacity 3.8s ease, filter 0.8s ease',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 100,
                                            bottom: 100,
                                            margin: 'auto',       
                                        }} 
                                        className={`absolute rounded-2xl border border-1 border-slate-600/40 drop-shadow-lg ${windowWidth <= 640 ? 'img-small' : windowWidth <= 768 ? 'img-medium' : 'img-large'}`}
                                        src={`http://localhost:1337${highlightedPackages[0].images[index]}`}
                                    />
                                ))}
                                </div>
                                <div className="flex items-center justify-center text-center w-full h-full gap-10" style={{height:"2vh"}}>
                                    <button onClick={nextImage} className="bg-slate-800 justify-center items-center w-10 h-10 rounded-full hover:bg-slate-600">
                                        <FontAwesomeIcon icon={faAngleLeft} className="text-3xl text-white" />
                                    </button>
                                    <button onClick={prevImage} className="bg-slate-800 justify-center items-center w-10 h-10 rounded-full hover:bg-slate-600">
                                        <FontAwesomeIcon icon={faAngleRight} className="text-3xl text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-fill md:w-1/2 pl-10 p-10 jsutify-center items-center text-center border-t md:border-t-0  md:border-l border-slate-700 pl-10">
                            <div className="flex text-white gap-10 leading-7 flex-col">
                                <div className="text-start font-light text-xl ">{`${highlightedPackages[0].description}`}</div>
                                <ul className="list-disc list-inside text-start leading-8">
                                {cheapestPackage && cheapestPackage.items.map((item: string, index: number) =>(
                                    <li key={index} className="text-md font-light text-lg mr-2 ml-2 italic">{item}</li>
                                ))}
                                    <li className="text-md font-light mr-2 ml-2 italic">{t("and_more")}</li>
                                </ul>
                                
                            </div>
                        </div>
                    </div>
                    <div className="relative flex flex-start w-full items-center justify-center md:mt-36 mb-24" >
                        <button 
                            onClick={goToPackages} 
                            className="w-auto rounded-2xl bg-gray-100/90 p-2 pl-4 text-xl pr-4 text-slate-900 font-light italic text-lg hover:bg-slate-800 hover:text-slate-200 tranform duration-200"
                            onMouseEnter={() => setPckButtonHoovered(true)}
                            onMouseLeave={() => setPckButtonHoovered(false)}
                            >                 
                            <FontAwesomeIcon icon={faGift} className={` text-2xl  mr-2 ${pckButtonHoovered ? "text-blue-400" : "text-slate-900" }`} />
                            {t("load_pck_btn")}
                        </button>
                    </div>
                </div>
            )}
            <div className="flex h-auto w-full">
                {reviews.length > 0 && (
                    <div className="h-auto w-full flex flex-col md:flex-row justify-center gap-10 items-center md:items-start mb-24 ">
                        {reviews.slice(-4).map((review, index) => (
                            <div className="w-80 h-auto flex bg-black border border-1 border-slate-200/20 flex-col text-slate-100 p-5 rounded-lg" key={index}>
                                <div className="flex flex-row w-full h-auto items-center justify-start gap-5 mb-6">
                                    <img src={`http://localhost:1337${review.portrait}`} alt={`Review ${index + 1}`} className="w-24 h-24 rounded-full"/>
                                    <div className="">
                                        <div className="text-2xl">{review.name}</div>
                                        <div className="">
                                            {Array.from({length: review.stars}, (_, i) => (
                                                <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500 text-md shadow-lg font-light" />
                                            ))}
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className="text-lg">{review.description}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex min-h-screen w-full">
            {slideshows.length > 0 && (
                    <div className="">
                    {slideshows.map((slideshow, index) => (
                      slideshow.images.map((image, imageIndex) => (
                        <img
                          key={imageIndex}
                          src={`http://localhost:1337${window.innerWidth <= 640 ? image.large : image.full}`}
                          alt={`Slideshow ${index + 1} Image ${imageIndex + 1}`}
                          className="w-screen h-auto"
                        />
                      ))
                    ))}
                  </div>
            )} 
            </div>
        </div>
    )
}
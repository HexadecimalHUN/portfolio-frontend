import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { Dialog } from '@headlessui/react';


export default function Gallery() {
    const [pictures, setPictures] = useState([]);
    const [numberOfPicturesToDisplay, setNumberOfPicturesToDisplay] = useState(10);
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [displayedImage, setDisplayedImage] = useState('');

    const { t } = useTranslation();
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    const handleLoadMore = () => {
        setNumberOfPicturesToDisplay(numberOfPicturesToDisplay + 10);
    };

    useEffect(() => {
        fetch(`${serverUrl}/api/posts?populate=*`)
        .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
        .then(data => {
            const allImages = data.data.flatMap((item:any) => item.attributes.images.data.map((image:any) => image.attributes.url));
            setPictures(allImages);
        })
        .catch(error => console.error('Error:', error));
    }, [])

    return (
        <div className="flex flex-col w-full mb-14  font-sans">
            <div className={`w-full h-auto  text-slate-200 text-center gap-2  mt-12 mb-12`}>
                <div className="text-6xl font-bold">{t("gallery")}</div>
                <div className="text-2xl font-light italic">{t("gallery_description")}</div>
            </div>
        
            <div className="z-10 flex flex-row flex-wrap gap-4 w-full grow items-center justify-around md:justify-start mb-5">
                {pictures.slice(0, numberOfPicturesToDisplay).map((picture, index) => (
                    <div key={index} className="flex justify-center items-center">
                        <img 
                            className="flex w-auto h-auto max-h-72 max-w-xl object-cover transform transition-all duration-500 grow wrap hover:scale-110 cursor-pointer opacity-0 imageLoad" 
                            src={`${serverUrl}${picture}`} 
                            alt={`Gallery picture ${index + 1}`} 
                            onLoad={(e) => {
                                e.currentTarget.style.opacity = "1";
                            }}
                            onClick={() => {
                            setDisplayedImage(`${serverUrl}${picture}`);
                            setIsDialogOpen(true);
                            }}
                        />
                    </div>
                ))}
               

                <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className="fixed inset-0 flex items-center justify-center z-10">
                <Dialog.Overlay className="fixed inset-0" />
                <div className="bg-none  rounded-lg">
                    <img className="md:h-screen h-auto w-screen md:w-auto" src={displayedImage} alt="Displayed Gallery Image" />
                </div>
                </Dialog>
            </div>
            {pictures.length > numberOfPicturesToDisplay && (
                <div className="w-full h-full flex items-center justify-center">
                    <div onClick={handleLoadMore} className="flex p-2 pl-3 pr-3 items-center justify-center flex-col w-auto h-auto transform transition-all duration-500 wrap hover:scale-110 bg-slate-800/10 border border-1 border-slate-200/30 text-slate-100 rounded-2xl cursor-pointer">
                        <h1 className="font-md text-md">{t("load_more")}</h1>
                    </div>
                </div>
                )}
        </div>
    )
}


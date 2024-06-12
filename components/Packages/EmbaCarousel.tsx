import { EmblaOptionsType } from "embla-carousel";
import { useState, useEffect } from "react";
import { PrevButton, NextButton, UsePrevNextButtons } from "./EmbaCarouselArrowButton";
import useEmblaCarousel from "embla-carousel-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import Package from "../Package/Package";
import { Disclosure } from '@headlessui/react';


/**
 * EmblaCarousel is a React component that renders a carousel of packages.
 * Each package is represented by a slide in the carousel.
 * 
 * @component
 * @example
 * // packages is an array of Packages objects
 * // options is an optional EmblaOptionsType object
 * <EmblaCarousel slides={packages} options={options} />
 * 
 * @param {Object} props - The properties that define the EmblaCarousel component.
 * @param {Packages[]} props.slides - An array of Packages objects that represent the slides in the carousel.
 * @param {EmblaOptionsType} [props.options] - Optional. The options for the Embla carousel.
 * 
 * @returns {ReactElement} The EmblaCarousel component.
 */


interface Banner {
    url: string;
}

interface Image {
    url: string;
    
}

interface PackagePrice{
    title: string;
    description: string[];
    price: number;

}

interface Packages{
    title: string;
    higlighted: boolean;
    description: string;
    banner: Banner;
    images: string[];
    prices: PackagePrice[]
    short_description: string;
}

type PropType = {
 slides: Packages[];
 options?: EmblaOptionsType;
}

const EmblaCarousel: React.FC<PropType> = (props) => {
    const {slides, options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options);
    const [emblaRef2, emblaApi2] = useEmblaCarousel(options);
    const {t} = useTranslation();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const [displayedPackage, setDisplayedPackage] = useState<Packages | null>(null);


  
    const {
      prevBtnDisabled,
      nextBtnDisabled,
      onPrevButtonClick,
      onNextButtonClick
    } = UsePrevNextButtons(emblaApi)

    const {
      prevBtnDisabled: prevBtnDisabled2,
      nextBtnDisabled: nextBtnDisabled2,
      onPrevButtonClick: onPrevButtonClick2,
      onNextButtonClick: onNextButtonClick2
    } = UsePrevNextButtons(emblaApi2);

  
    return (
      <section className="embla w-full h-auto flex flex-col h-auto bg-none">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container w-full">
            {slides
            .sort((a: Packages, b: Packages) => (b.higlighted === true ? 1 : -1))
            .map((packageItem:Packages, index: number) => (
              <div className="embla__slide w-auto md:w-auto p-3 ml-3" key={index}>
                <div className="embla__slide__number">
                <div key={index} className="relative flex shadow-lg w-full">
                    <div className={`flex flex-col h-auto  md:auto w-96 rounded-xl  ${packageItem.higlighted ? 'bg-gradient-to-br from-slate-100/10 to-yellow-500/60 border-yellow-300 ' :'bg-gradient-to-br from-slate-400/20 to-gray-600/40'} backdrop-blur-md`}>
                        
                        <div className="relative flex-col w-full h-full justify-around items-center rounded-xl w-96">
                            
                            <img src={`${serverUrl}${packageItem.images[0]}`} alt={`${packageItem.images[0]}`} className='flex rounded-tr-xl rounded-tl-xl h-72 object-cover w-full object-top'></img>
                            <div className={`w-full p-2 text-2xl font-bold ${packageItem.higlighted ? 'text-yellow-400':'text-slate-200'}`}>{packageItem.title}</div>
                            <div className="p-2 text-md text-slate-300">{packageItem.short_description}</div>
                            <div className="flex felx-col justify-start align-center p-2 text-xl italic font-semibold text-slate-100">
                                <h1 className="pr-1">{t("from_txt_start")}</h1>
                                {packageItem.prices && packageItem.prices.length > 0 && packageItem.prices.reduce((min, p) => Number(p.price) < min ? Number(p.price) : min, Number(packageItem.prices[0].price))}
                                <h1 className="pl-1">{t("from_txt_end")}</h1>
                            </div>

                            <div className="flex w-full h-fit items-center justify-center mt-10 pb-4">
                                <button 
                                  className={`p-2 pr-3 pl-3 font-semibold rounded-xl w-auto border border-1 border-slate-300/70 hover:border-slate-300 text-lg  text:black transform duration-200 ${packageItem.higlighted? `bg-slate-100 hover:bg-yellow-700 hover:text-white`:`bg-slate-200  hover:bg-slate-700 hover:text-white`}`}
                                  onClick={() => {setDisplayedPackage(packageItem), setIsDialogOpen(true)}}
                                >{t("learn_btn")}</button>
                            </div>
                        </div>
                        <div className="absolute flex w-full h-auto top-0 right-0 ">
                            {packageItem.higlighted ? (
                                <div className="flex w-auto italic text-lg font-semibold flex-row justify-center items-center gap-2  rounded-lg bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md pr-2 pl-2 p-1 ">
                                    <h1 className='text-yellow-500/90'>{t("highlighted")}</h1>
                                    <FontAwesomeIcon icon={faStar} className="text-yellow-400/90"/>
                                </div>
                            ):(
                                <div className="flex w-auto italic text-lg font-semibold flex-row justify-center items-center gap-2 p-1 rounded-lg border border-transparent select-none">
                                    <h1 className='text-slate-100/0'>Nothing</h1>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        <div className="embla__controls w-full justify-center items-center mb-10">
          <div className="embla__buttons justify-center w-full">
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
          </div>
  
        </div>
        
        <Package isOpen={isDialogOpen} isHighlighted={!!displayedPackage?.higlighted} onClose={()=>setIsDialogOpen(false)}>
          <div className="flex w-full h-full md:max-h-auto overflow-y-hidden overflow-hidden  mt-2 gap-10 flex-col md:flex-row ">
            <div className="w-full md:w-1/2  flex flex-col ">
              <div className="flex flex-col justify-center items-center gap-1">
                <section className="embla flex flex-col w-full bg-none">
                  <div className="embla__viewport" ref={emblaRef2}>
                    <div className="embla__container w-full">
                    {displayedPackage?.images.map((image: string, index: number) => (
                      <div className="embla__slide " key={index}>
                        <div className="embla__slide__number">
                          <img src={`${serverUrl}${image}`} alt={`${image}`} className='flex rounded-md max-h-72 md:max-h-96 object-contain shadow-lg'></img>

                        </div>
                      </div>
                    ))}
                    </div>
                    </div>
                </section>
                <div className="embla__controls w-full justify-center items-center">
                  <div className="embla__buttons justify-center w-full">
                    <PrevButton onClick={onPrevButtonClick2} disabled={prevBtnDisabled2} />
                    <NextButton onClick={onNextButtonClick2} disabled={nextBtnDisabled2} />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col mb-12 md:mb-0">
              <div className="w-full font-bold text-3xl text-slate-900 mb-2">{displayedPackage?.title}</div>
              <div className="w-full text-lg text-md pr-2 mb-2" dangerouslySetInnerHTML={{ __html: (displayedPackage?.description || '').replace(/<br\/>/g, '<br>') }}></div>
              <div className="w-full font-bold text-xl text-slate-950 mb-2 italic text-center md:text-left">{t("ideal_package")}</div>
              <div className="w-full max-h-80 overflow-y-scroll custom-scrollbar">
                {displayedPackage?.prices.map((priceObj: PackagePrice, index: number) =>(
                  <Disclosure key={index}>
                    {({ open }) => (
                      <div className="mb-1 ">
                        <Disclosure.Button className="flex justify-between w-full p-2 text-lg font-semibold bg-gradient-to-br from-slate-700/10 to-zinc-800/10 rounded-md border border-1 border-slate-300/40 hover:border-slate-300/30 hover:bg-slate-800 hover:text-white/80 text-black transition transition-500">
                          <span>{priceObj.title}</span>
                          <span>{Number(priceObj.price).toLocaleString('hu-HU')} Ft</span>
                        </Disclosure.Button>
                        <Disclosure.Panel className="p-2 text-slate-900">
                          <div className="text-lg font-semibold">{t("package_contains")}</div>
                          <ul className="list-disc list-inside">
                            {priceObj.description.map((item: string, index: number) => (
                              <li key={index} className="text-md font-semibold mr-2 ml-2">{item}</li>
                            ))}
                          </ul>
                        </Disclosure.Panel>
                      </div>
                    )}
                  </Disclosure>
                  
                ))}
              </div>
            </div>
          </div>
        </Package>

      </section>
    )
  }
  
  export default EmblaCarousel
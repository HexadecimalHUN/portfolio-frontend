import { useContext} from 'react';
import { useTranslation } from 'react-i18next';
import { PackageContext } from '../Context/ProjectContext';


import EmblaCarousel from './EmbaCarousel';
import { EmblaOptionsType } from 'embla-carousel';

interface Banner {
    url: string;
}

interface PackagePrice{
    title: string;
    description: string;
    price: number;
}

interface Packages{
    title: string;
    higlighted: boolean;
    description: string;
    banner: Banner;
    images: string[];
    package_prices: PackagePrice[];
}

/**
 * Packages component
 * 
 * This component is used to display a carousel of packages. It uses the EmblaCarousel component to display the packages.
 * 
 * The component first gets the `packages` state and `setPackages` function from the PackageContext.
 * 
 * It then sets the `SLIDE_COUNT` to the length of the `packages` array and `SLIDES` to the `packages` array itself.
 * 
 * The component returns a div that contains the title and description of the packages, and the EmblaCarousel component.
 * 
 * The EmblaCarousel component takes in the `OPTIONS` object and `SLIDES` array as props. The `OPTIONS` object sets the alignment of the carousel to 'start'.
 * 
 * @returns {JSX.Element} The Packages component.
 */

const OPTIONS: EmblaOptionsType = {align:'start'}

export default function Packages() {
    const { packages } = useContext(PackageContext);
    const {t} = useTranslation();
    
    const SLIDES = packages;

    return(
    <div className='flex flex-col w-full justify-center items-center  font-sans'>
        <div className=" w-full h-auto  text-slate-200 flex flex-col text-center gap-2  mt-12 mb-12">
            <div className="text-6xl font-bold">{t("packages2")}</div>
            <div className="text-2xl font-light italic">{t("packages_description")}</div>
        </div>
        <EmblaCarousel options={OPTIONS} slides={SLIDES}/>   
    </div>
    )
}
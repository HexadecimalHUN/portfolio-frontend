import { useEffect, useState, useContext } from "react";
import { ProjectContext } from "../Context/ProjectContext";
import { useTranslation } from "react-i18next";

/**
 * ProjectCard component
 * 
 * This component is used to display a project card. It takes in a `post` object as a prop.
 * 
 * The component first checks if the `isPortrait` state is null. If it is, it returns a loading text.
 * 
 * If `isPortrait` is not null, it returns a div that displays the project card. The div's class changes based on the `isPortrait` state.
 * 
 * Inside the div, there are two child divs:
 * 1. The first div contains an img tag that displays the project's image. The image's source is obtained from the `post` object.
 * 2. The second div contains a h1 tag that displays the project's publish date. The date is obtained from the `post` object and is formatted to a locale string.
 * 
 * The `handleClick` function is called when the parent div is clicked. This function sets the selected project in the ProjectContext.
 * 
 * The `isPortrait` state is set in a useEffect hook that runs when the `post.images` array changes. It creates a new Image object and sets `isPortrait` based on the image's dimensions.
 * 
 * @param {Object} post - The post object containing the details of the project.
 * 
 * @returns {JSX.Element} The ProjectCard component.
 */

interface ProjectProps {
    post: {
        publishDate: string;
        title: string;
        images: { 
            url: string,
        }[];
        resizedImages:{
            small:{
                url: string
            },
            medium:{
                url: string
            },
            large:{
                url: string
            },
            thumbnail:{
                url: string
            }
        }[];
        review: {
            description: string;
            name:string;
            stars: number;
        } | null;
    };
}



export default function ProjectCard({ post }: ProjectProps) {
    const [isPortrait, setIsPortrait] = useState<boolean | null>(null);
    const {setSelectedProject} = useContext(ProjectContext);
    const { t } = useTranslation();
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    const handleClick = () => {
        setSelectedProject(post);
    };

    useEffect(() => {
        const img = new Image();
        img.onload = function(){
            setIsPortrait(img.height > img.width);
        }
        img.src = `${serverUrl}${post.images[0]}`;
    }, [post.images]);
    if (isPortrait === null) {
        return <div>{t("loadingtext")}</div>
    }

    return (
    <div onClick={handleClick} className={`group flex flex-col w-full h-full  gap-1 transition-colors duration-300 p-2 text-black items-center justify-center overflow-hidden cursor-pointer` }>
        <div className="w-full h-full rounded-t-lg flex items-center justify-center relative">
            <img src={`${serverUrl}${post.resizedImages[0].medium}`} alt="project" className=" h-full w-auto object-cover  shadow-lg transform transition-all duration-300 group-hover:translate-y-2 group-hover:scale-110 "/>
        </div>
        <div className="flex flex-col w-full p-4">
            <h1 className="text-sm transform transition-all  text-slate-400 duration-300 group-hover:translate-y-4 group-hover:text-slate-200">{new Date(post.publishDate).toLocaleDateString()}</h1>
        </div>
    </div>
    );
}


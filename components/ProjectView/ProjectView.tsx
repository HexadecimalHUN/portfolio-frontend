import { useContext , useState, useEffect} from "react";
import { ProjectContext } from "../Context/ProjectContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

interface Image {
    url: string;
}

interface Project{
    images: Image[];
    title: string;
}

interface ProjectViewProps{
    project: Project;
}

export default function ProjectView( {project}: ProjectViewProps) {
    const {selectedProject, setSelectedProject} = useContext(ProjectContext);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isPortrait, setIsPortrait] = useState(false);
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    const handleNextClick = () => {
        setSelectedImageIndex((selectedImageIndex + 1) % project.images.length);
    };

    const handlePreviousClick = () => {
        setSelectedImageIndex((selectedImageIndex - 1 + project.images.length) % project.images.length);
    };

    const handleImageClick = (index: number) => {
        if (index >= 0 && index < project.images.length) {
            setSelectedImageIndex(index);
          }
    };

    const handleBackClick = () => {
        setSelectedProject(null);
    };

    useEffect(() => {
        const image = new Image();
        image.onload = function(){
            setIsPortrait(image.height > image.width);
        }
        image.src = `${serverUrl}${project.images[selectedImageIndex]}`;
    }, [project.images, selectedImageIndex]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          const { key } = event;
      
          switch (key) {
            case 'ArrowLeft':
              handlePreviousClick();
              break;
            case 'ArrowRight':
              handleNextClick();
              break;
            case 'Escape':
              handleBackClick();
              break;
            default:
              break;
          }
        };
      
        window.addEventListener('keydown', handleKeyDown);
      
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, [selectedImageIndex]);

    return (
        <div className="flex min:w-screen w-auto absolute  bg-black flex-col items-center gap-4 p-4 min:h-screen h-auto select-none top-4 left-0 right-0  z-55 overflow-x-visible">
            <div className="flex flex-row justify-between w-full p-2">
                <div className="text-white text-4xl font-thin">{project.title}</div>
                <div onClick={handleBackClick} className="text-black">
                    <FontAwesomeIcon icon={faTimesCircle} className="text-white text-5xl hover:text-slate-300 transition-transform duration-100 hover:scale-110" />
                </div>
            </div>
            <div className="flex flex-row w-full h-auto justify-center items-center">
                <div onClick={handlePreviousClick}>
                    <FontAwesomeIcon icon={faAngleLeft} className="text-white text-6xl hover:text-slate-300 transition-transform duration-100 hover:scale-110" />
                </div>
                <div className="flex flex-row gap-4 ">
                {(() => {
                let startIndex, endIndex;
                if (selectedImageIndex === 0) {
                    startIndex = project.images.length - 1;
                    endIndex = 2;
                } else if (selectedImageIndex === project.images.length - 1) {
                    startIndex = selectedImageIndex - 1;
                    endIndex = 1;
                } else {
                    startIndex = selectedImageIndex - 1;
                    endIndex = selectedImageIndex + 2;
                }
                let images = [...project.images.slice(startIndex, project.images.length), ...project.images.slice(0, endIndex)];
                images = images.slice(0, 3); // Ensure only 3 images are displayed
                return images.map((image, index) => {
                    const imageIndex = (startIndex + index) % project.images.length;
                    const isSelected = imageIndex === selectedImageIndex;
                    return(
                    <img 
                    className={`max-h-16 md:max-h-20 h-auto  cursor-pointer hover:scale-110 transition-transform duration-500 rounded-sm shadow-lg select-none${isSelected ? " border-2 border-red-500" : " border-0"}`}
                    key={index} 
                    src={`${serverUrl}${image}`} 
                    alt="Project Pictures" 
                    onClick={() => handleImageClick((startIndex + index) % project.images.length)}
                    />
                    );
                });
                })()}
                </div>
                <div onClick={handleNextClick}>
                    <FontAwesomeIcon icon={faAngleRight} className="text-white text-6xl hover:text-slate-300 transition-transform duration-100 hover:scale-110" />
                </div>
            </div>
            <div className="flex items-center justify-center gap-5">
                <div className={`${isPortrait ? " w-full md:w-1/2 " : "w-full"}`}>
                    <img className="w-full select-none" src={`${serverUrl}${project.images[selectedImageIndex] }`} alt="Selected Project Picture"></img>
                </div>
            </div>
        </div>
    )
}
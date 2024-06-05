import { createContext, useState, useEffect } from "react";

export const ProjectContext = createContext({    
    selectedProject: null,
    setSelectedProject: (project: any) => {},
});

export const PackageContext = createContext({
    packages: [],
    setPackages : (packages: any) => {},
});

export default function ProjectProvider({ children }: any) {
    const [selectedProject, setSelectedProject] = useState(null);
    const [packages, setPackages] = useState([]);
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    useEffect(() => {
        fetch(`${serverUrl}/api/packages?populate=*`)
            .then(response => {
                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const packagesData = data.data.map((item: any) => ({
                ...item.attributes,
                banner: item.attributes.custom_banner.data.map((banner:any) => banner.attributes.url),
                images: item.attributes.package_images.data.map((image:any) => image.attributes.url),
                price: item.attributes.package_prices.data.map((price:any) => price.attributes),
                }))
                setPackages(packagesData);
                })
            .catch(error => console.error('Error:', error));;
      }, []);

    
    return (
        <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
            <PackageContext.Provider value= {{ packages, setPackages}} >
                {children}
            </PackageContext.Provider>
        </ProjectContext.Provider>
    );
}
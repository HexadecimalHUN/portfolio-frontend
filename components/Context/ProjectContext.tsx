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
                    id: item.id,
                    description: item.attributes.description,
                    higlighted: item.attributes.higlighted,
                    title: item.attributes.title,
                    short_description: item.attributes.short_description,
                    banner: item.attributes.banner.data.attributes.url,
                    images: item.attributes.package_images.data.map((image:any) => image.attributes.url),
                    prices: item.attributes.package_prices.data.map((price:any) => ({
                        id: price.id,
                        title: price.attributes.title,
                    })),
                }))
                //Here we loop on the packae_prices to get the 
                fetch(`${serverUrl}/api/package-prices?populate=*`)
                .then(response => {
                    if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const linkedPackagePrice = data.data.map((item: any) => ({
                        id: item.id,
                        linked_packages: item.attributes.packages.data.map((linked_package:any) => linked_package.id),
                        price: item.attributes.price,
                        descriptions: item.attributes.package_price_descriptions.data.map((description:any) => description.attributes.name),
                    }))

                    const updatedPackagesData = packagesData.map((packageData:any) => {
                        // Map over the prices array in the package
                        const updatedPrices = packageData.prices.map((priceData:any) => {
                          // Find the linked price for this price data
                          const linkedPrice = linkedPackagePrice.find((price:any) => price.id === priceData.id);
                      
                          // If a linked price was found, add the price and description to the price data
                          if (linkedPrice && linkedPrice.price && linkedPrice.descriptions) {
                            return {
                              ...priceData,
                              price: linkedPrice.price,
                              description: linkedPrice.descriptions,
                            };
                          }
                      
                          // If no linked price was found, return the price data unchanged
                          return priceData;
                        });
                      
                        // Return the package data with the updated prices array
                        if (updatedPrices.some((priceData:any) => priceData.price && priceData.description)) {
                            return {
                              ...packageData,
                              prices: updatedPrices,
                            };
                          }
                            return packageData;
                      });
                      
                      setPackages(updatedPackagesData);
                })           
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
"use client";
import i18n from "@/i18n/i18n";
import { Loader } from "@googlemaps/js-api-loader"
import { I18nextProvider } from "react-i18next";
import { useState, useEffect, useTransition, Component, useContext } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Wrapper from "@/components/Wrapper/Wrapper";
import Index from "@/components/Index/Index";
import Projects from "@/components/Projects/Projects";
import Gallery from "@/components/Gallery/Gallery";
import About from "@/components/About/About";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import Packages from "@/components/Packages/Packages";
import ProjectProvider, { ProjectContext } from "@/components/Context/ProjectContext";
import ProjectView from "@/components/ProjectView/ProjectView";
import {useTranslation } from "react-i18next";
import {ReCaptchaProvider} from "next-recaptcha-v3";



type NavigationItem = {
  name: string;
  component: JSX.Element;
  current: boolean;
};


export default function Home() {

  

  const {t} = useTranslation();
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [currentComponent, setCurrentComponent] = useState<JSX.Element | null>(null);
  const [selectedProject, setSelectedProject] = useState(null);


  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: "weekly",
    });
  
    loader.loadCallback((error) => {
      if (error) {
        console.error(error);
      } else {
        const mapElement = document.getElementById("map");
        if (mapElement) {
          const map = new google.maps.Map(mapElement as HTMLElement, {
            center: {lat: 47.6807308, lng: 16.6065311},
            zoom: 8,
          });
        }
      }
    });
  }, []); 

  useEffect(() => {
    const navItems = [
      {name: t('projects'), component: <Projects />, current: false},
      {name: t('gallery'), component: <Gallery />, current: false},
      {name: t('packages'), component: <Packages />, current: false},
      {name: t('about'), component: <About />, current: false},
      {name: t('contact'), component: <Contact />, current: false}
      
    ];
    setNavigation(navItems);
    setCurrentComponent(<Index currentComponent={currentComponent} setCurrentComponent={setCurrentComponent}/>);
  }, [i18n.language]);
  
  return (
    <div className={`flex w-screen h-screen justify-start items-center flex-col m-0 p-0  ${currentComponent?.type === Index ? 'bg-index' : 'bg-svg'}`}>
      <ReCaptchaProvider reCaptchaKey="">
        <I18nextProvider i18n={i18n}>
        {!selectedProject && <Navbar currentComponent={currentComponent} setCurrentComponent={setCurrentComponent} Navigation={navigation} />}
          <Wrapper isIndex={currentComponent?.type === Index}>
            <ProjectProvider  >
              <ProjectContext.Provider value ={{selectedProject, setSelectedProject}}>
                {selectedProject ? <ProjectView project = {selectedProject}/> : currentComponent}
              </ProjectContext.Provider>
            </ProjectProvider>
            {!selectedProject &&<Footer />}
          </Wrapper>
        </I18nextProvider>
      </ReCaptchaProvider>
      
      
    </div>
  );
}

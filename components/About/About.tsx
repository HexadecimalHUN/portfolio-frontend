import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import FAQItem from "../Faq/Faq";
import { InstagramEmbed, FacebookEmbed } from 'react-social-media-embed';
import React from 'react';

interface FAQ {
    question: string;
    answer: string;
  }

interface TableProps{
    name: string;
    price: string;
    details: string;

}

export default function About() {
    const [faq, setFaq] = useState<FAQ[]>([]);
    const [tablePoprs, setTableProps] = useState<TableProps[]>([])
    const { t } = useTranslation();


    useEffect(() => {
        fetch('http://localhost:1337/api/faqs')
        .then(response => response.json())
        .then(data => {
            const faqs = data.data.map((item: any) => ({
                question: item.attributes.question,
                answer: item.attributes.answer
            }));
            setFaq(faqs);
        
        })
    },[])


    return (
        <div className="flex w-full  flex-col font-sans">
            <div className="flex flex-col w-full pt-16 pb-16 justify-center gap-5 p-5 h-screen scroll-snap-y mandatory">
                <h1 className="text-3xl md:text-6xl font-bold text-white/90">"{t("quote_text")}"</h1>
                <h1 className="text-xl md:text-3xl font-light italic text-right verflow-y-auto text-slate-100/90">-{t("quote_author")}</h1>
            </div>
            <div className="justify-center scroll-snap-start">
                <div className="flex flex-col md:flex-row bg-gradient-to-br from-slate-800/10 to-gray-700/10 rounded-xl items-center text-black justify-evenly m-5 backdrop-blur-md">
                    <div className=" w-full md:w-2/5">
                    
                        <img src='profile.jpg' alt="Profile" className="rounded-full w-full p-0 md:p-10"></img>
                    </div>
                    <div className="w-full sm:w-3/5 md:text-xl text-md text-center md:text-left font-md italic p-3 md:p-10 pt-10 pb-10 text-slate-200">
                        {t("profile_text").split('\n').map((line, index) =>(
                            <React.Fragment key={index}>
                                {line}
                                <br/><br/>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
            



            <div className="flex w-full p-5 mt-10 h-screen justify-center flex-col scroll-snap-start">
                <div className="flex w-full text-6xl font-bold text-center mt-6 mb-6 pb-3 justify-center text-slate-100">{t("faq_title")}</div>
                {faq.map((item, index) => (
                    <FAQItem key={index} question={t(item.question)} answer={t(item.answer)}/>
                ))}
            </div>
            
            


        </div>
    )
}
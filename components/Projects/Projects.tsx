import { useEffect, useState } from "react";	
import ProjectCard from "../ProjectCard/ProjectCard";
import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { height } from "@fortawesome/free-solid-svg-icons/faEllipsis";




interface Post {
    category: string;
    createdAt: string;
    images: { url: string; }[];
    publishDate: string;
    publishedAt: string;
    shootDate: string;
    title: string;
    updatedAt: string;
    tag: string[];
    review: { description: string; name: string; stars: number; } | null;
    resizedImages: {
        small: { url: string; };
        medium: { url: string; };
        large: { url: string; };
        thumbnail: { url: string; };
    }[];
}


export default function Projects() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isTagOpen, setIsTagOpen] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [isHovering, setIsHovering] = useState(false);

    const { t } = useTranslation();
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedTags(prev => [...prev, e.target.value]);
        } else {
            setSelectedTags(prev => prev.filter(tag => tag !== e.target.value));
        }
    };

    useEffect(() => {
        const cachedPosts = localStorage.getItem('posts');
        if(cachedPosts){
            setPosts(JSON.parse(cachedPosts));
        } else {
            fetch(`${serverUrl}/api/posts?populate=*`)
            .then(response => response.json())
            .then(data =>{
                const postsData = data.data.map((item: any) => ({
                    ...item.attributes,
                    tag: item.attributes.post_tags.data.map((tag:any) => tag.attributes.Name),
                    category: item.attributes.post_categories.data.map((category:any) => category.attributes.Name),
                    images: item.attributes.images.data.map((image:any) => image.attributes.url),
                    resizedImages: item.attributes.images.data.map((image:any) => ({
                        small: image.attributes.formats.small.url,
                        thumbnail: image.attributes.formats.thumbnail.url,
                        medium: image.attributes.formats.medium.url,
                        large: image.attributes.formats.large.url,
                    })),
                    review: item.attributes.review.data !== null 
                    ? {
                        description: item.attributes.review.data.attributes.description,
                        name: item.attributes.review.data.attributes.name,
                        stars: item.attributes.review.data.attributes.stars,
                    } 
                    : null,
                    

                }));
                console.log(postsData);
                setPosts(postsData); 
            });
        };
    }, []);



    useEffect(() =>{
        const uniqueCategories = [...new Set(posts.map(post => post.category))];
        setCategories(['All', ...uniqueCategories]);
        console.log(categories)
        setFilteredPosts(posts);
    },[posts]);

    useEffect(() => {
        const allTags = posts.flatMap(post => post.tag).filter(Boolean);
        const uniqueTags = [...new Set(allTags)];
        setTags(uniqueTags);
    }, [posts]);

    useEffect(() => {
        let filtered = posts;

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(post => post.category.includes(selectedCategory));
        }
        
        if (selectedTags.length > 0 && !(selectedTags.length === 1 && selectedTags[0] === 'All')) {
            filtered = filtered.filter(post => post.tag && post.tag.some(tag => selectedTags.includes(tag)));
        }
        
        setFilteredPosts(filtered);
        console.log(filtered);

        

    }, [selectedCategory, selectedTags, posts]);

    return (
        <div className="flex flex-col  font-sans">
            <div className={`w-full h-auto  text-gray-900 text-center gap-2  mt-12 mb-12 pl-2 pr-2`}>
                <div className="text-6xl text-slate-200 font-bold">{t("projects2")}</div>
                <div className="text-2xl text-slate-200 font-light italic">{t("projects_description")}</div>
            </div>
            <div className="flex md:flex-row flex-col  mt-5 mb-5 gap-2 w-full justify-start items-start">
                <div className="flex flex-col w-full md:w-2/12 h-fit gap-4 pl-2 pr-2">
                    <div className={`w-full h-fit backdrop-blur-md text-white rounded-md  transition bg-gray-800/20 duration-200 hover:bg-gradient-to-br from-slate-700 to-gray-900 ${isCategoriesOpen ? 'bg-gradient-to-br from-slate-400/20 to-gray-600/40':''}`} >
                        <button className="w-full p-3" onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}>
                            {isCategoriesOpen ? 
                            <div className="flex flex-row w-full justify-between">
                                <div className="text-xl text-center">{t("categories")}</div>
                                <FontAwesomeIcon icon={faChevronUp} className="text-white text-xl"/>
                            </div>
                            :
                            <div className="flex flex-row w-full justify-between">
                                <div className="text-xl text-center">{t("categories")}</div>
                                <FontAwesomeIcon icon={faChevronDown} className="text-white text-xl"/>
                            </div>
                             }
                        </button>
                        {isCategoriesOpen && (
                        <div className="p-3">
                        <div className="text-sm">
                          <input 
                            type="radio"
                            name="category"
                            id="category-All"
                            value="All"
                            checked={selectedCategory === 'All'}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="custome-checkbox mr-2"
                          ></input>
                          <label htmlFor="category-All" className="capitalize">{t("all_title")}</label>
                        </div>
                        {[...new Set(posts.flatMap((post) => post.category))].map((category) => (
                          <div className="text-sm" key={category}>
                            <input 
                              type="radio"
                              name="category"
                              id={`category-${category}`}
                              value={category}
                              checked={selectedCategory === category}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="custome-checkbox mr-2"
                            ></input>
                            <label htmlFor={`category-${category}`} className="capitalize">{category}</label>
                          </div>
                        ))}
                      </div>
                        )}              
                    </div>
                    <div className={`w-full h-fit backdrop-blur-md text-white bg-gray-800/20 rounded-md  transition duration-500 hover:bg-gradient-to-br from-slate-700 to-gray-900 ${isTagOpen ? 'bg-gradient-to-br from-slate-400/20 to-gray-600/40':''}`}>
                        <button className="w-full p-3" onClick={() => setIsTagOpen(!isTagOpen)}>
                            {isTagOpen ? 
                            <div className="flex flex-row w-full justify-between">
                                <div className="text-xl text-center">{t("tags")}</div>
                                <FontAwesomeIcon icon={faChevronUp} className="text-white text-xl"/>
                            </div>
                            :
                            <div className="flex flex-row w-full justify-between">
                                <div className="text-xl text-center">{t("tags")}</div>
                                <FontAwesomeIcon icon={faChevronDown} className="text-white text-xl"/>
                            </div>
                             }
                        </button>
                        {isTagOpen && (
                            <div className="p-3">
                                {tags.map((tag) => (
                                    <div className="text-sm" key={tag}>
                                        <input 
                                            type="checkbox"
                                            id={`tag-${tag}`}
                                            value={tag}
                                            checked={selectedTags.includes(tag)}
                                            onChange={handleTagChange}
                                            className="custome-checkbox mr-2"
                                        ></input>
                                        <label htmlFor={`tag-${tag}`} className="capitalize">{tag} </label>
                                    </div>
                                ))}
                            </div>
                        )}   
                    </div>
                </div>
                <div className="max-w-full md:w-10/12 flex flex-row gap-0 flex-shrink-0 overflow-y-scroll flex-wrap justify-start scrollbar-hide flex-none" >
                    {filteredPosts.map((post) => (
                        <div className={`flex align-start flex-col lg:w-1/4 sm:w-1/3 w-ful transition-opacity duration-500 ${isHovering && hoveredCard !== post.title ? 'other-card' : ''}` } 
                        style={{ opacity: 0 }}
                        key={post.title}
                        onLoad={(e) => {
                            e.currentTarget.style.opacity = "1";
                        }}
                        onMouseEnter={() => {
                            setHoveredCard(post.title);
                            setIsHovering(true);
                          }}
                          onMouseLeave={() => {
                            setHoveredCard(null);
                            setIsHovering(false);
                          }}
                        >
                            <ProjectCard post={post} />
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
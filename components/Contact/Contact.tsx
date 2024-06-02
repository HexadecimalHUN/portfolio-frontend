
import { GoogleMap, OverlayView} from '@react-google-maps/api';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ContactPopup from './ContactPopup';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationPin } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';




  


export default function Contact() {
    const[name, setName] = useState('');
    const[email, setEmail] = useState('');
    const[message, setMessage] = useState('');
    const[isPopupOpen, setIsPopupOpen] = useState(false);
    const[formError, setFormError] = useState(false);
    const[status, setStatus] = useState<'success' | 'error' >('error');
    const { t } = useTranslation();
    
    const containerStyle = {
        width: window.innerWidth <= 640 ? '80vw' : '40vw',
        height: window.innerWidth <= 640 ? '50vh' : '50vh'
        };
      
    const center = {
        lat: -3.745,
        lng: -38.523
      };
    
    const mapStyles = [
        {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#212121"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#212121"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#181818"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1b1b1b"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#2c2c2c"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#8a8a8a"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#373737"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#3c3c3c"
              }
            ]
          },
          {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#4e4e4e"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#000000"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#3d3d3d"
              }
            ]
          }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message){
            setFormError(true);
            return;

        }else{
            setFormError(false);
        }

        try{
            const response = await axios.post('/api/sendEmail', {name, email, message})
            setStatus('success');
            setName('');
            setEmail('');
            setMessage('');
        }catch(error){
            setStatus('error');
        } finally{
            setIsPopupOpen(true);
        }
    };

  return (
    <div className="w-full max-w-full gap-10 flex items-center flex-col flex-grow min-h-screen mt-10 font-sans">
       <div className="flex max-w-full gap-10 flex items-center flex-col flex-grow w-full min-h-fit">
            <div className="flex w-full flex-col backdrop-blur-md shadow-lg md:flex-row lg:flex-row xl:flex-row flex-colheight-fit p-10 bg-gradient-to-br from-slate-800/10 to-gray-700/10 rounded-md justify-around items-center gap-10">
                <div className="flex-col min-w-1/2 max-w-full max-h-1/2 gap-4 flex">
                    <div className="text-4xl md:text-5xl text-slate-100 font-bold"><meta className='Contact Information Title'/>{t("contact_top")}</div>
                    <div className="text-2xl text-slate-100 font-sm"><meta className='Contact Information Address'/>{t("contact_address")}: Budapest - Kálmán Imre Utca 5.</div>
                    <div className="text-2xl text-slate-100 font-sm"><meta className='Contact Information Phone Number'/>{t("contact_phone")}: </div>
                </div>
                <div className="min-w-1/2  w-full md:max-w-full max-h-1/2 justify-center items-center shadow-lg">
                    < GoogleMap
                        mapContainerStyle={containerStyle}
                        center={{ lat: 47.506426751854285, lng: 19.050273237023678 }}
                        zoom={15}
                        options={{ styles: mapStyles }}
                    />
                    <OverlayView
                        position={{ lat: 47.506426751854285, lng: 19.050273237023678 }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500 text-2xl w-10 h-10" />
                    </OverlayView>
                </div>
            </div>
            <div className="flex w-full flex-col md:flex-row backdrop-blur-md shadow-lg p-10 bg-gradient-to-br from-slate-800/10 to-gray-700/10 rounded-md justify-around items-center ">
                <div className="flex flex-col md:w-1/2 gap-4 ">
                    <div className="text-4xl md:text-5xl text-slate-100 font-bold">{t("contact_bot")}</div>
                    <div className="text-2xl text-slate-100 font-sm">{t("contact_fil")}</div>
                </div>
                <div className="flex md:w-1/4 w-full max-h-fit justify-center items-center h-fit " style={containerStyle}>
                    <form className=" w-full justify-center items-center" onSubmit={handleSubmit}>
                        <div className="mb-4 w-full">
                            <label className={`block text-slate-200 text-md font-semibold mb-2 ${formError? "text-red-500" :""}`} htmlFor="name">
                            {t("name")}
                            </label>
                            <input className={`shadow-lg appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formError? "border border-2 border-red-600":""}`} id="name" type="text" placeholder={formError? t("error_name_placeholder"):t("name_placeholder")} value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className="mb-4">
                            <label className={`block text-slate-200 text-md font-semibold mb-2 ${formError? "text-red-500" :""}`} htmlFor="email">
                            {t("email")}
                            </label>
                            <input className={`shadow-lg appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formError? "border border-2 border-red-600":""}`} id="email" type="email" placeholder={formError? t("error_email_placeholder") : t("email_placeholder")} value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="mb-6">
                            <label className={`block text-slate-200 text-md font-semibold mb-2 ${formError? "text-red-500" :""}`} htmlFor="message" >
                            {t("message")}
                            </label>
                            <textarea className={`shadow-lg appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20 ${formError? "border border-2 border-red-600":""}`} id="message" placeholder={formError? t("error_message_placeholder") : t("message_placeholder")} value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                        </div>
                        <div className="flex items-center justify-center w-full">
                            <button className="bg-slate-800 hover:bg-slate-200 text-white hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition-all  duration-300" type="submit" >
                            {t("send_button")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
        <ContactPopup isOpen={isPopupOpen} status={status} onClose={() => setIsPopupOpen(false)} />

        
    </div>
  )
}
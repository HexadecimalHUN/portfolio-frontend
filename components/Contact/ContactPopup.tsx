import { useTranslation } from "react-i18next";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface contactProps {
    isOpen: boolean;
    status: "success" | "error";
    onClose: () => void;
    
}

export default function ContactPopup({isOpen, status, onClose}: contactProps) {
    const { t } = useTranslation();
    return (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="absolute fixed inset-0 z-10 bg-black/90  backdrop-blur-md flex jsutify-center items-center w-screen h-screen overflow-hidden "
            onClose={onClose}
          >
            <div className="relative flex h-auto w-auto items-center justify-center flex-col text-center rounded-md bg-slate-950 m-auto p-5 ">
              <Dialog.Overlay className="fixed inset-0 " />
    
                <div className="flex mb-4 w-5 h-5 items-start top-0 left-0 w-full h-auto relative flex-shrink">
                    <button
                    type="button"
                    className="btn btn-primary w-6 h-6 p-2 bg-white rounded-full items-center justify-center flex absolute top-0 right-0 m-2 hover:bg-red-600 hover:text-white text-slate-900"
                    onClick={onClose}
                    >
                    <FontAwesomeIcon icon={faXmark}  />
                    </button>
                </div>
        
                <Dialog.Title
                    as="h3"
                    className={`flex flex-grow w-auto text-lg leading-6 font-medium ${status === 'success' ? 'text-green-500' : 'text-red-600'}`}
                >
                    {status === 'success' ? t('contact.successTitle') : t('contact.errorTitle')}
                </Dialog.Title>
    
              <div className="mt-2">
                <p className="text-sm text-gray-300">
                  {status === 'success' ? t('contact.successDescription') : t('contact.errorDescription')}
                </p>
              </div>
    
              
            </div>
          </Dialog>
        </Transition>
      );
}
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from "@heroicons/react/16/solid"; 

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  return (
    <Disclosure>
      {({ open }) => (
        <div className='mb-3'>
          <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-2xl font-md text-left text-white backdrop-blur-md bg-gradient-to-br from-slate-800/10 to-gray-700/10 rounded-lg hover:bg-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 transform duration-200">
            <span>{question}</span>
            <ChevronUpIcon
              className={`${open ? 'transform rotate-180' : ''
                } w-6 h-6 text-white`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-lg text-white bg-gradient-to-br from-slate-700/10 to-gray-800/10 backdrop-blur-md rounded-lg justify-center mt-1">
            {answer}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

export default FAQItem;
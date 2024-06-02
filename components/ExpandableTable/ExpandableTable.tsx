import { Disclosure } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { useTranslation } from "react-i18next";

interface TableItem {
    name: string;
    price: string;
    details: string;
  }
  
  interface ExpandableTableProps {
    data: TableItem[];
  }
  
  const ExpandableTable: React.FC<ExpandableTableProps> = ({ data }) => {

    const { t } = useTranslation();

    return (

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>{t("prices_category")}</th>
            <th>{t("prices_price")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <Disclosure as="tr" key={index} className="text-center">
              {({ open }) => (
                <>
                  <td>{item.name}</td>
                  <td>{new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF' }).format(Number(item.price))}</td>
                  <td>
                    <Disclosure.Button>
                      <ChevronRightIcon
                        className={`${open ? 'transform rotate-180' : ''
                          } w-5 h-5`}
                      />
                    </Disclosure.Button>
                  </td>
                  <Disclosure.Panel as="tr">
                    <td colSpan={3}>{item.details}</td>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </tbody>
      </table>
    );
  };
  
  export default ExpandableTable;
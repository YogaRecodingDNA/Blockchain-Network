// LIBRARIES
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import { Tooltip } from "react-tooltip";
// HOOKS
import { useState } from 'react';
// COMPONENTS
import { Disclosure } from '@headlessui/react'
import { Link } from 'react-router-dom'
// ASSETS/ICONS/STATUS COMPONENTS
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { GiWallet } from "react-icons/gi";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function WalletHeader() {
  const [ isLoggedIn, setIsLoggedIn ] = useState(secureLocalStorage.getItem("loggedIn"));
  const [ isActiveWallet, setIsActiveWallet ] = useState(secureLocalStorage.getItem("address"));
  const navigate = useNavigate();

  console.log("address local storage 1 ==", secureLocalStorage.getItem("address"));
  
  window.addEventListener('secureLocalStorage', () => {
    setIsLoggedIn(secureLocalStorage.getItem("loggedIn"));
    setIsActiveWallet(secureLocalStorage.getItem("address"));
  });
  
  const navigation = [
    { name: 'Create New Wallet', path: '/wallet/create', current: false },
    { name: 'Open Existing Wallet', path: '/wallet/open-existing', current: false },
    { name: 'Balance', path: '/wallet/balance', current: false },
    { name: 'Send Transaction', path: '/wallet/send-transaction', current: false },
  ]

  const handleActivation = () => {
    if (isActiveWallet) {
      secureLocalStorage.removeItem("privKey");
      secureLocalStorage.removeItem("pubKey");
      secureLocalStorage.removeItem("address");
      setIsActiveWallet(false);
    } else {
      secureLocalStorage.removeItem("privKey");
      secureLocalStorage.removeItem("pubKey");
      secureLocalStorage.removeItem("address");
      setIsActiveWallet(false);
      navigate("/wallet/open-existing");
    }

    // window.dispatchEvent(new Event("secureLocalStorage"));
    
    console.log("LOGGED STORAGE", secureLocalStorage.getItem("loggedIn"));

    if (isLoggedIn === false) {
      secureLocalStorage.clear();
    }
  }

  return (
    <Disclosure as="nav" className="bg-gradient-to-b from-gray-700 via-gray-500 to-gray-700 border-y border-sky-400">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-10 items-center justify-between">
            <div className="absolute inset-y-0 right-0 flex items-center md:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 text-black hover:text-sky-400 focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-center">
                <div data-tooltip-content={isActiveWallet ? "Activated address: " + secureLocalStorage.getItem("address") : "Go open an existing wallet or create a new one to activate your session"} data-tooltip-id='toolTip1' data-place='top' className="flex flex-shrink-0 items-center text-xs font-medium">
                <Tooltip id="toolTip1" />
                  {isLoggedIn && isActiveWallet ?
                  <div className="flex items-center space-x-1 hover:cursor-pointer text-emerald-500 hover:text-emerald-400">
                    <GiWallet onClick={handleActivation} className="block h-6 w-auto" />
                    <p className="font-bold">Active</p>
                  </div> :
                  <div className="flex items-center space-x-1 hover:cursor-pointer text-red-800 hover:text-red-600">
                    <GiWallet onClick={handleActivation} className="block h-6 w-auto" />
                    <p>Inactive</p>
                  </div>
                  }
                </div>
                <div className="hidden md:ml-6 md:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={classNames(
                          item.current ? 'text-violet-400' : 'text-gray-300 hover:bg-gray-900 hover:text-sky-400',
                          'px-5 py-px rounded-full text-sm font-normal'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-px pt-2 pb-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-900 hover:text-white',
                    'block px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
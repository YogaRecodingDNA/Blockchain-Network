// LIBRARIES
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
// HOOKS
import { useState, useEffect } from 'react';
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
  const navigate = useNavigate();
  
  const navigation = [
    { name: 'Create New Wallet', path: '/wallet/create', current: false },
    { name: 'Open Existing Wallet', path: '/wallet/open-existing', current: false },
    { name: 'Balance', path: '/wallet/balance', current: false },
    { name: 'Send Transaction', path: '/wallet/send-transaction', current: false },
  ]

  const handleLogin = () => {
    if (!isLoggedIn) {
      secureLocalStorage.setItem("loggedIn", true);
      setIsLoggedIn(true);
      navigate("/wallet/create");
    } else {
      secureLocalStorage.setItem("loggedIn", false);
      setIsLoggedIn(false);
    }
    
    console.log("LOGGED STORAGE", secureLocalStorage.getItem("loggedIn"));

    if (isLoggedIn === false) {
      secureLocalStorage.clear();
    }
  }

  // const handleClick = () => {
  //   navigate("/wallet");
  // }

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
                {/* hover text bubble */}
                {/* <div class="relative ">
                  <a class="absolute inset-0 z-10 bg-black/40 text-center flex flex-col items-center justify-center opacity-0 hover:opacity-100 bg-opacity-90 duration-300">
                  <GiWallet onClick={handleLogin} className="block h-6 w-auto hover:cursor-pointer text-sky-500" />
                  </a>
                  <a href="#" class="relative">
                    <div class="h-48 flex flex-wrap content-center">
                      test
                    </div>
                  </a>
                </div> */}
                <div className="flex flex-shrink-0 items-center text-xs font-medium">
                  {isLoggedIn ? 
                    <GiWallet onClick={handleLogin} className="block h-6 w-auto hover:cursor-pointer text-red-600 hover:text-violet-400" /> :
                    <GiWallet onClick={handleLogin} className="block h-6 w-auto hover:cursor-pointer text-emerald-500 hover:text-violet-400" />
                  }
                </div>
                <div className="hidden md:ml-6 md:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        state={{loggedState: isLoggedIn}}
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
                  state={{loggedState: isLoggedIn}}
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
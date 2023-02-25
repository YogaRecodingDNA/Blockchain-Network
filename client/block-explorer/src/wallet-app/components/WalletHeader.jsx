// HOOKS
import { useNavigate } from 'react-router-dom';
// COMPONENTS
import { Disclosure } from '@headlessui/react'
// ASSETS/ICONS/STATUS COMPONENTS
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { GiWallet } from "react-icons/gi";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function WalletHeader({ isLoggedIn }) {
  const navigate = useNavigate();
  
  const navigation = [
    { name: 'Create New Wallet', path: '/wallet/create', current: false },
    { name: 'Open Existing Wallet', path: '/wallet/open-existing', current: false },
    { name: 'Balance', path: '/wallet/balance', current: false },
    { name: 'Send Transaction', path: '/wallet/send-transaction', current: false },
  ]

  const handleClick = () => {
    navigate("/wallet");
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
                <div className="flex flex-shrink-0 items-center">
                  <GiWallet onClick={handleClick} className="block h-6 w-auto text-gray-900 cursor-pointer hover:text-white" />
                </div>
                <div className="hidden md:ml-6 md:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.path}
                        className={classNames(
                          item.current ? 'text-violet-400' : 'text-gray-300 hover:bg-gray-900 hover:text-sky-400',
                          'px-5 py-px rounded-full text-sm font-normal'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-px pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.path}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-900 hover:text-white',
                    'block px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
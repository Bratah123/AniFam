'use client';
import { Disclosure } from '@headlessui/react';
import { FaSearch, FaBars, FaCross } from 'react-icons/fa';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type NavBarProp = {
  isAdmin: boolean;
  // These determine what button to highlight
  onHome: boolean;
  onForums: boolean;
  onAdmin: boolean;
};

export default function Navbar({ isAdmin, onHome, onForums, onAdmin }: NavBarProp) {
  const navigation = [
    { name: 'Home', href: '/home', current: onHome },
    { name: 'Forums', href: '/forums', current: onForums },
  ];

  if (isAdmin) {
    navigation.push({ name: 'Admin', href: '/admin', current: onAdmin });
  }

  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="max-w-10xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <FaCross className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <FaBars className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <a href="/home">
                    <Image
                      className="h-8 w-auto"
                      src="/anya_chibi_t.png"
                      alt="Anya chibi image"
                      width={100}
                      height={100}
                    />
                  </a>
                </div>
                {/*Website name */}
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-1">
                    <a href="/home">
                      <h1 className="text-2xl font-bold text-white">
                        Ani x Family
                      </h1>
                    </a>
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {isSearchOpen && (
                <div className="fixed inset-0 p-4">
                  <div
                    className="absolute inset-0 bg-gray-900 opacity-90"
                    onClick={() => setIsSearchOpen(false)}
                  ></div>

                  <div className="relative w-full max-w-3xl rounded bg-gray-800">
                    <input
                      className="w-full rounded border-gray-600 bg-gray-800 px-8 py-3 text-gray-400 focus:outline-none"
                      autoFocus
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Link
                      href={{
                        pathname: '/home',
                        query: {
                          search: search,
                        },
                      }}
                    >
                      <button
                        className="absolute right-2 top-2 rounded p-2 text-gray-400 hover:text-black"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <FaSearch />
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              {!isSearchOpen && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    type="button"
                    className="relative flex space-x-2 rounded-full border border-gray-400 bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <input
                      className="w-48 rounded-full bg-gray-800 px-2 py-1 text-left text-base text-gray-400 focus:outline-none"
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <FaSearch className="h-6 w-6 pr-2" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium',
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
  );
}

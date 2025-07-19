'use client';
import React from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
const Header = () => {
  return (
    <div className="text-[#2d7ad9] flex bg-[hsl(210,100%,98%)]  justify-between pt-[2rem] w-full  fixed top-0   ">
      <div className="text-3xl ml-[30px]">GasEye . </div>
      <div className="mr-[1rem] md:hidden cursor-pointer">
        <Sheet>
          <SheetTrigger>
            <RxHamburgerMenu></RxHamburgerMenu>
          </SheetTrigger>
          <SheetContent className="bg-slate-900 text-white  ">
            <SheetHeader></SheetHeader>
            <SheetDescription>
              <div className="text-xl space-y-5  ">
                <Link href={'./'}>
                  <div className="mt-[50px] cursor-pointer font-bold">Home</div>
                </Link>
                <div className="mt-[20px] cursor-pointer font-bold">About</div>
              </div>
            </SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
      <div className=" gap-[70px] mr-[50px] hidden md:flex ">
        <Link href={'./'}>
          {' '}
          <div className="cursor-pointer font-bold">Home</div>
        </Link>
        <div className="cursor-pointer font-bold ">About</div>
      </div>
    </div>
  );
};

export default Header;

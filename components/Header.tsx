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
import { Button } from './ui/button';
const Header = () => {
  return (
    <div className="text-[#2d7ad9] flex justify justify-between mt-[2rem] max-w-full ">
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
                <div className="mt-[50px] cursor-pointer">Home</div>
                <div className="mt-[20px] cursor-pointer">About</div>
              </div>
            </SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
      <div className=" gap-[70px] mr-[50px] hidden md:flex ">
        <div className="cursor-pointer">Home</div>
        <div className="cursor-pointer ">About</div>
      </div>
    </div>
  );
};

export default Header;

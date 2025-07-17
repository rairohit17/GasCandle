import React from 'react'

const Header = () => {
  return (
    <div className='text-[#2d7ad9] flex justify justify-between mt-[2rem] max-w-full '>
        <div className='text-3xl ml-[30px]'>Logo</div>
        <div className='flex gap-[200px] mr-[50px] '>
            <div className='cursor-pointer'>Home</div>
            <div className='cursor-pointer '>About</div>
        </div>
    </div>
  )
}

export default Header
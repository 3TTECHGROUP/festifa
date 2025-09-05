// import React from 'react'
import arrowRight from '@/assets/images/arrow-right.svg'
import { Button } from '@/components/ui/button'
import popout from '@/assets/images/popout.png'

export const Banner = () => {
  return (
    <div className="bg-[#FFA500] h-[900px] relative before:content-[''] before:absolute before:top-auto before:left-0 before:bg-[url('/src/assets/images/banner-bg.png')] before:bg-contain before:z-[1] before:m-auto before:right-0 before:bottom-0 before:bg-center before:w-full before:h-[500px] before:bg-no-repeat">
            <div className="container mx-auto p-4 md:p-6 lg:p-8 xl:p-10">
                <div className="text-center flex flex-col items-center justify-center pt-[120px] relative z-[1]">
                    <div className="flex mb-[10px] bg-white gap-[10px] items-center text-base font-medium rounded  px-[10px] py-[6px]">
                        Explore our new templates 
                        <img src={arrowRight} alt="Icon" />
                    </div>
                    <h1 className="text-[96px] leading-[100px] mb-[30px] font-semibold">Make the most out <br/> of every moment!</h1>
                    <p className="mb-[30px] text-xl font-medium">
                    Do you want to Host an event or attend an event around you? Festifa makes <br/> that really easy. Don't just take our word for it, Try it out yourself
                    </p>

                    <div className='flex gap-2'>
                        <Button className='py-[35px] px-[50px] flex items-center text-base font-semibold border-none gap-[14px] rounded-[50px] min-w-[258px]' variant="outline">
                            <img src={popout} alt="Icon" />
                             Create an Event
                             </Button>
                        <Button className='py-[35px] px-[50px] flex items-center text-base font-semibold border-none gap-[14px] rounded-[50px] min-w-[258px]'>Browse Events</Button>
                    </div>
                </div>
            </div>
    </div>
  )
}

import { Data2 } from '@/constants/productSliderData/Data2';
import SliderProduct from '../../homeslider/Slider';
import React from 'react';

const SmartWatch = () => {
  return (
    <>
      {/* Smart Watches Section */}
      <div className="w-full bg-gradient-to-r from-[#ffffff] to-[#fff1d6] py-8 px-1">
        {/* Header Section */}
        <div className="md:grid md:grid-cols-2 flex flex-col w-full items-center md:items-start">
          <div className="md:col-span-1 flex justify-center md:justify-start mx-4 md:mx-8">
            <img
              src="https://www.boat-lifestyle.com/cdn/shop/files/img_2_mob_390x.png?v=1686117497"
              alt="Smart Watches image"
              className="max-w-full"
            />
          </div>
          <div className="md:col-span-1 mx-4 md:mx-8 text-center md:text-left">
            <p className="text-3xl sm:text-4xl lg:text-6xl xl:text-8xl font-light leading-tight">
              Smart Watches
            </p>
            <p className="text-lg md:text-2xl font-light mt-2">
              Starting from &#8377;999
            </p>
          </div>
        </div>

        {/* Slider Section */}
        <SliderProduct Data={Data2} />

        {/* Best Sellers Section */}
        <div className="mx-4 md:mx-8 my-8">
          <p className="font-metropolis text-2xl md:text-4xl font-bold py-3">
            Best Sellers
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              {
                img: "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/boAt-Storm.jpg?v=1682583585",
                name: "Airpodes 131",
                price: "₹899",
              },
              {
                img: "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Storm_Call.jpg?v=1682408982",
                name: "Airpodes 131",
                price: "₹899",
              },
              {
                img: "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/boAt-Storm.jpg?v=1682583585",
                name: "Airpodes 131",
                price: "₹899",
              },
              {
                img: "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Xtend_6a57e3cd-0fa0-47ac-a46e-ea788a526627.jpg?v=1682583585",
                name: "Airpodes 131",
                price: "₹899",
              },
            ].map((product, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="cursor-pointer w-full aspect-[4/5] object-cover"
                />
                <p className="text-base font-bold mx-3 mt-2">{product.name}</p>
                <p className="text-sm font-semibold text-gray-600 mx-3">{product.price}</p>
                <div className="flex rounded-xl bg-black text-white h-10 m-3 items-center justify-center cursor-pointer hover:bg-gray-800 hover:shadow-md transition-all duration-300">
                  <p className="font-light">Add to Cart</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SmartWatch;

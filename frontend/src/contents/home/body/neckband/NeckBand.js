import React from 'react';

const NeckBand = () => {
  return (
    <div>
      {/* Neck Bands Section */}
      <div className="w-full bg-gradient-to-r from-[#ffffff] to-[#f2edff] py-8 px-1">
        {/* Header Section */}
        <div className="md:grid md:grid-cols-2 flex flex-col w-full items-center md:items-start">
          <div className="md:col-span-1 mx-4 md:mx-8 text-center md:text-left">
            <p className="text-3xl sm:text-4xl lg:text-6xl xl:text-8xl font-light leading-tight">
              Neck Bands
            </p>
            <p className="text-lg md:text-2xl font-light mt-2 ">
              Starting from &#8377;999
            </p>
          </div>
          <div className="md:col-span-1 flex justify-center md:justify-end mx-4 md:mx-8">
            <img
              src="https://www.boat-lifestyle.com/cdn/shop/files/img_3_mob_1282x.png?v=1686131082"
              alt="Neck Bands"
              className="max-w-full"
            />
          </div>
        </div>

        {/* Best Sellers Section */}
        <div className="mx-4 md:mx-8 my-8 border-black">
          <p className="font-metropolis text-2xl md:text-4xl font-bold py-3">
            Best Sellers
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              {
                img: "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Nirvana_751_ANC.jpg?v=1698909797",
                name: "Airpodes 131",
                price: "₹899",
              },
              {
                img: "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Rockerz_551_ANC_75520e83-ecd9-48d4-8d58-cb6ca3c78374.jpg?v=1698912191",
                name: "Airpodes 131",
                price: "₹899",
              },
              {
                img: "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Nirvana_751_ANC.jpg?v=1698909797",
                name: "Airpodes 131",
                price: "₹899",
              },
              {
                img: "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/IM_400.gif?v=1691387449",
                name: "Airpodes 131",
                price: "₹ 899",
              },
            ].map((product, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full cursor-pointer aspect-[4/5] object-cover"
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
    </div>
  );
};

export default NeckBand;

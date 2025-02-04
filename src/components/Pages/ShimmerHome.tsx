const Shimmer = () => {
  return (
    <div className="w-[31%] mr-5 mb-5">
      <div className="w-full">
        <div className="w-full h-56 bg-gray-200" />
      </div>
      <div className="flex mt-2">
        <div className="mr-2">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        </div>
        <div className="w-11/12">
          <div className="bg-gray-200 mb-2 w-full h-5" />
          <div className="bg-gray-200 mb-2 w-full h-5" />
          <div className="bg-gray-200 mb-2 w-full h-5" />
        </div>
      </div>
    </div>
  );
};

const ShimmerHome = () => {
  return (
    <div className="mx-10 flex flex-wrap w-full">
      <Shimmer />
      <Shimmer />
      <Shimmer />
      <Shimmer />
      <Shimmer />
      <Shimmer />
      <Shimmer />
      <Shimmer />
      <Shimmer />
    </div>
  );
};

export default ShimmerHome;

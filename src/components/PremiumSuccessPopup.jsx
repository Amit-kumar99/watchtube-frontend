const PremiumSuccessPopup = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-black border border-gray-700 p-10 rounded-lg shadow-lg max-w-md mx-auto">
        <div>
          <h1 className="text-xl">Premium Purchase Successful!</h1>
          <p>Redirecting to the homepage...</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumSuccessPopup;

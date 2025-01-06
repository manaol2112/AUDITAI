import backgroundImage from '../../assets/images/iStock-1544760741.jpg';

export function SlimLayout({ children }) {
  return (
    <div className="relative flex min-h-screen">
      {/* Registration Form Section */}
      <div className="flex-1 flex justify-center items-center bg-white px-4 py-10 shadow-2xl sm:justify-center md:px-28">
        <div className="w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
          {children}
        </div>
      </div>

      {/* Background Image Section */}
      <div className="hidden lg:block lg:w-3/5 relative">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={backgroundImage}
          alt="Background"
          unoptimized
        />
      </div>
    </div>
  );
}

const loginForm = () => {
  return (
    <section className="py-20 bg-white min-h-[600px] flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-brand-blue font-heading mb-4 relative inline-block">
            <div className="absolute -left-12 top-1/2 h-[4px] w-8 bg-brand-red"></div>
            Login to your account
            <div className="absolute -right-12 top-1/2 h-[4px] w-8 bg-brand-red"></div>
          </h2>
          <p className="text-gray-500">
            Enter your credentials to access your account
          </p>

          <form className="space-y-6 w-full bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100">
            {/* Role Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Select Role
              </label>
              <select className="w-full p-4 border border-gray-200 text-sm focus:outline-none focus:border-brand-red transition-colors rounded bg-white text-gray-800">
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-4 border border-gray-200 text-sm focus:outline-none focus:border-brand-red transition-colors rounded bg-white text-gray-800"
                required
              />
            </div>

            {/* Conditional Fields */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-4 border border-gray-200 text-sm focus:outline-none focus:border-brand-red transition-colors rounded bg-white text-gray-800"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-red text-white px-10 py-4 text-sm font-bold tracking-widest hover:bg-red-700 transition-colors uppercase rounded disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
            ></button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default loginForm;

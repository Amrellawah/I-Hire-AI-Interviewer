export default function FeaturesSection() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-[#fbf9f9]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1 bg-gradient-to-r from-[#be3144] to-[#f05941] rounded-full"></div>
          </div>
          <h2 className="text-4xl font-extrabold text-[#191011] sm:text-5xl">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#be3144] to-[#f05941]">AI Interviewer?</span>
          </h2>
          <p className="mt-6 text-xl text-[#8e575f] max-w-3xl mx-auto leading-relaxed">
            Revolutionizing the hiring process with cutting-edge AI technology that delivers measurable results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              image: "https://cdn.usegalileo.ai/sdxl10/cc72ffe5-27c1-4ed6-aca2-521b002d06a2.png",
              title: "The future of hiring",
              description: "Our platform uses advanced AI to deliver a more efficient, effective, and equitable hiring process.",
              cta: "Learn more",
              link: "/features",
              stats: "80% faster screening"
            },
            {
              image: "https://cdn.usegalileo.ai/sdxl10/a063781f-d24f-4876-bae5-0d13d5ec7a81.png",
              title: "Ready to get started?",
              description: "Sign up today and start hiring the best talent, faster. No commitment required.",
              cta: "Get started",
              link: "/signup",
              stats: "14-day free trial"
            },
            {
              image: "https://cdn.usegalileo.ai/sdxl10/d62c176d-e495-437b-9c50-8a5ab25a5294.png",
              title: "Need help?",
              description: "Have questions? We're here to help. Contact our team to learn more about our platform.",
              cta: "Contact us",
              link: "/contact",
              stats: "24/7 support"
            },
            {
              image: "https://cdn.usegalileo.ai/sdxl10/b34ff144-392c-446e-ba7e-242a163c5adb.png",
              title: "Our mission",
              description: "We're on a mission to help companies build better teams, faster through AI technology.",
              cta: "Our story",
              link: "/about",
              stats: "500+ happy clients"
            },
          ].map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden border border-[#e4d3d5] hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-[#fbf9f9] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-6 h-full flex flex-col">
                <div className="flex items-start mb-6">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl w-20 h-20 shrink-0 border border-[#e4d3d5] group-hover:border-[#be3144]/30 transition-all duration-300"
                    style={{ backgroundImage: `url(${feature.image})` }}
                  ></div>
                  <div className="ml-5">
                    <h3 className="text-xl font-bold text-[#191011] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-[#be3144] to-[#f05941] transition-all duration-300">
                      {feature.title}
                    </h3>
                    <div className="mt-1 text-sm font-medium text-[#be3144]">
                      {feature.stats}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-base text-[#8e575f] flex-grow">
                  {feature.description}
                </p>
                <div className="mt-8">
                  <a
                    href={feature.link}
                    className="inline-flex items-center text-base font-semibold text-[#be3144] group-hover:text-[#f05941] transition-colors"
                  >
                    {feature.cta}
                    <svg
                      className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <a
            href="/pricing"
            className="relative inline-flex items-center px-8 py-4 overflow-hidden text-lg font-bold text-white rounded-xl group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#be3144] to-[#f05941] group-hover:from-[#f05941] group-hover:to-[#ff7b54] transition-all duration-300"></span>
            <span className="relative z-10 flex items-center">
              Explore All Features
              <svg
                className="ml-3 w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
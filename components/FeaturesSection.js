export default function FeaturesSection() {
    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {/* Feature Cards */}
        {[
          {
            image: "https://cdn.usegalileo.ai/sdxl10/cc72ffe5-27c1-4ed6-aca2-521b002d06a2.png",
            title: "The future of hiring is here",
            description: "AI Interviewer is revolutionizing the way companies hire. Our platform uses advanced AI to deliver a more efficient, effective, and equitable hiring process.",
          },
          {
            image: "https://cdn.usegalileo.ai/sdxl10/a063781f-d24f-4876-bae5-0d13d5ec7a81.png",
            title: "Ready to get started?",
            description: "Sign up for AI Interviewer today and start hiring the best talent, faster. It's free to get started, and there's no commitment required.",
          },
          {
            image: "https://cdn.usegalileo.ai/sdxl10/d62c176d-e495-437b-9c50-8a5ab25a5294.png",
            title: "Want to learn more?",
            description: "Have questions about AI Interviewer? We're here to help. Contact our team to learn more about our platform, features, and pricing.",
          },
          {
            image: "https://cdn.usegalileo.ai/sdxl10/b34ff144-392c-446e-ba7e-242a163c5adb.png",
            title: "About us",
            description: "At AI Interviewer, we're on a mission to help companies build better teams, faster. Learn more about our company, team, and vision.",
          },
        ].map((feature, index) => (
          <div key={index} className="flex flex-1 gap-3 rounded-lg border border-[#e4d3d5] bg-[#fbf9f9] p-4 flex-col">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-10 shrink-0"
              style={{ backgroundImage: `url(${feature.image})` }}
            ></div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[#191011] text-base font-bold leading-tight">{feature.title}</h2>
              <p className="text-[#8e575f] text-sm font-normal leading-normal">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
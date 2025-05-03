export default function WhyAISection() {
    return (
      <div className="flex flex-col gap-10 px-4 py-10 @container">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-[#191011] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]">
              Why AI Interviewer
            </h1>
            <p className="text-[#191011] text-base font-normal leading-normal max-w-[720px]">
              AI Interviewer is designed to help you hire the best talent, faster. Our platform uses advanced AI to deliver a more efficient, effective, and equitable hiring process.
            </p>
          </div>
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#be3144] text-[#fbf9f9] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] w-fit"
          >
            <span className="truncate">Get started</span>
          </button>
        </div>
      </div>
    );
  }
  
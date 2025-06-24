import Header from "../dashboard/_components/Header";
import FeaturesSection from "../../components/FeaturesSection";
import Head from "next/head";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#fbf9f9] flex flex-col">
      <Head>
        <title>Features | I-Hire</title>
        <meta name="description" content="Discover all the powerful features of I-Hire's AI-powered interview platform." />
      </Head>
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start pt-32 pb-16 px-4">
        <section className="max-w-3xl text-center mb-16">
          <h1 className="text-5xl font-extrabold text-[#191011] mb-6">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#be3144] to-[#f05941]">Features</span>
          </h1>
          <p className="text-xl text-[#8e575f] leading-relaxed">
            I-Hire leverages advanced AI to transform your hiring process. Discover how our platform can help you find, assess, and hire top talent faster and smarter.
          </p>
        </section>
        <FeaturesSection />
        <section className="max-w-4xl mx-auto mt-24 text-center">
          <h2 className="text-3xl font-bold text-[#191011] mb-4">What Makes Us Different?</h2>
          <p className="text-lg text-[#8e575f] mb-8">
            Our platform is designed for both employers and job seekers, offering:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="inline-block w-3 h-3 mt-2 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941]"></span>
                <span>AI-driven candidate screening and ranking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block w-3 h-3 mt-2 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941]"></span>
                <span>Automated, unbiased interview questions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block w-3 h-3 mt-2 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941]"></span>
                <span>Instant, actionable feedback for candidates</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block w-3 h-3 mt-2 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941]"></span>
                <span>Seamless integration with your workflow</span>
              </li>
            </ul>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="inline-block w-3 h-3 mt-2 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941]"></span>
                <span>24/7 support and onboarding assistance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block w-3 h-3 mt-2 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941]"></span>
                <span>Customizable interview templates</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block w-3 h-3 mt-2 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941]"></span>
                <span>Data-driven analytics and reporting</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block w-3 h-3 mt-2 rounded-full bg-gradient-to-r from-[#be3144] to-[#f05941]"></span>
                <span>Secure, privacy-first infrastructure</span>
              </li>
            </ul>
          </div>
        </section>
        <section className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-[#191011] mb-4">Ready to experience the future of hiring?</h2>
          <p className="text-lg text-[#8e575f] mb-8">Sign up now and start your journey with I-Hire today.</p>
          <a href="/signup" className="inline-block px-8 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-[#be3144] to-[#f05941] hover:from-[#f05941] hover:to-[#ff7b54] transition-all duration-300 shadow-lg">
            Get Started Free
          </a>
        </section>
      </main>
    </div>
  );
} 
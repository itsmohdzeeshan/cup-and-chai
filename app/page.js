import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-black via-slate-900 to-black text-white">

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">

        {/* Glow Background */}
        <div className="absolute w-[500px] h-[500px] bg-purple-600 opacity-20 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>
        <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
          Get me a Cup Of <span className="text-purple-400">Chai ☕</span>
        </h1>

        <p className="mt-6 text-sm sm:text-base md:text-lg text-gray-300 max-w-xl">
          A modern crowdfunding platform for creators. Let your fans support you with a chai — simple, fast, and powerful.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/login">
            <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer">
              Start Now
            </button>
          </Link>
          <button className="px-6 py-3 rounded-lg border border-gray-600 hover:bg-white/10 transition-all duration-300 cursor-pointer">
            Read More
          </button>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="h-[1px] bg-white/10"></div>

      {/* FEATURES */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">

        <h2 className="text-2xl sm:text-3xl font-bold mb-12">
          Why Choose Us?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* CARD 1 */}
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-105 transition duration-300">
            <img src="man.gif" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="font-semibold text-lg">Fund Yourself</h3>
            <p className="text-gray-400 text-sm mt-2">
              Let your audience support your journey effortlessly.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-105 transition duration-300">
            <img src="coin.gif" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="font-semibold text-lg">Instant Payments</h3>
            <p className="text-gray-400 text-sm mt-2">
              Receive money instantly with secure integrations.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-105 transition duration-300">
            <img src="group.gif" className="mx-auto mb-4 w-14 h-14" />
            <h3 className="font-semibold text-lg">Build Community</h3>
            <p className="text-gray-400 text-sm mt-2">
              Turn your followers into a strong supporting community.
            </p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center px-6">

        <div className="max-w-3xl mx-auto backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-10">

          <h2 className="text-2xl sm:text-3xl font-bold">
            Ready to get your first chai? ☕
          </h2>

          <p className="text-gray-400 mt-4">
            Join thousands of creators already earning from their fans.
          </p>

          <Link href={'/login'}>
            <button className="mt-6 px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:scale-105 transition duration-300 shadow-lg cursor-pointer">
              Get Started
            </button>
          </Link>

        </div>
        
      </section>

    </div>
  );
}
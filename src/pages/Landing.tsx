import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroA from '@/assets/stellar-odyssey-hero.jpg';
import heroB from '@/assets/crimson-horizon-hero.jpg';
import batman from '@/assets/66a4263d01a185d5ea22eeec_6408f6e7b5811271dc883aa8_batman-min.png';
import poster1 from '@/assets/wc.jpg';
import poster2 from '@/assets/joker.jpg';
import poster3 from '@/assets/images.jpg';

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen landing-hero overflow-hidden">
      <div className="landing-dots" />

  <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-16">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
    {/* Left copy */}
    <div className="lg:col-span-7">
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-[hsl(265_83%_58%_/_.15)] text-[hsl(265_83%_88%)] border border-[hsl(265_83%_58%_/_.25)] mb-6">
        Always Free • No Subscription Required
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white mb-6">
        Free Movies & TV
        <br />
        Fewer Ads than Cable
        <br />
        No Subscription Required
      </h1>
      <p className="text-base md:text-lg text-gray-300 mb-10 max-w-2xl">
        Thousands of movies and TV shows. Always Free. 100% Legal.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button
          className="btn-cta px-8 py-6 text-lg"
          onClick={() => navigate('/browse')}
        >
          Start Watching
        </Button>
        <Button
          variant="secondary"
          className="px-8 py-6 text-lg"
          onClick={() => navigate('/login')}
        >
          Sign In
        </Button>
      </div>
    </div>

          {/* Posters Section (stacked in one column like a chain) */}
        {/* Posters Section (clustered on the right) */}
<div className="lg:col-span-5 relative flex justify-center lg:justify-end">
  <div className="grid grid-cols-2 gap-6">
    <img
      src={heroB}
      alt="Poster"
      className="w-36 sm:w-44 lg:w-48 rounded-xl shadow-2xl border border-[hsl(230_16%_26%_/_.6)] rotate-3"
    />
    <img
      src={heroA}
      alt="Poster"
      className="w-40 sm:w-48 lg:w-56 rounded-xl shadow-2xl border border-[hsl(230_16%_26%_/_.6)] -rotate-2"
    />
    <img
      src={batman}
      alt="Poster"
      className="w-32 sm:w-40 lg:w-48 rounded-xl shadow-2xl border border-[hsl(230_16%_26%_/_.6)] rotate-1"
    />
    <img
      src={poster1}
      alt="Poster"
      className="w-36 sm:w-44 lg:w-52 rounded-xl shadow-2xl border border-[hsl(230_16%_26%_/_.6)] rotate-2"
    />
    <img
      src={poster2}
      alt="Poster"
      className="w-40 sm:w-48 lg:w-56 rounded-xl shadow-2xl border border-[hsl(230_16%_26%_/_.6)] -rotate-1"
    />
    <img
      src={poster3}
      alt="Poster"
      className="w-32 sm:w-40 lg:w-48 rounded-xl shadow-2xl border border-[hsl(230_16%_26%_/_.6)] rotate-3"
    />
  </div>
</div>
</div>
      </div>
    </div>
  );
};

export default Landing;

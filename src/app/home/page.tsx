import YouTubeMusicPlayer from '../../components/MusicPlayer/HomeMusicPlayer';

const PlaylistPage = () => {
  return (
    <div 
    style={{ backgroundImage: 'url("https://www.nasheedio.com/_next/static/media/bg-cover.a4978066.png")', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}
    className="flex flex-wrap pt-20 p-10 md:p-0-mx-3 justify-around items-center">

      <div className="lg:w-5/12 md:w-1/2 w-full sm:px-3 md:mb-0 mb-5">
        <span className="text-xs border border-[#dddddd] text-white inline-block px-3 py-[2px] rounded-xl">
          Early access
        </span>
        <h1 className="text-white lg:text-[48px] md:text-[42px] text-[30px] mt-4">
          Muslim-Friendly Listening💚
        </h1>
        <p className="md:text-lg text-sm mt-3 text-[rgba(255,255,255,.5)]">
          Make listening productive, enjoyable, rewarding, and guilt-free.
        </p>
        <div className="mt-6">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black inline-block py-2 lg:px-4 px-3 rounded-lg md:text-base text-sm"
            href="https://docs.google.com/forms/d/e/1FAIpQLSf9FbCC_XnBZf8VWE7_NhL30L0Yroa0vS26uTsoqT9yew39ow/viewform?usp=sf_link"
          >
            Get started
          </a>
          <a
            className="border border-white ml-2 inline-block py-2 px-4 rounded-lg text-white md:text-base text-sm"
            href="/company"
          >
            Watch
          </a>
        </div>
      </div>
      <div className="lg:w-5/12 md:w-1/2 w-full mt-10 md:mt-0 sm:px-3">
        <p className="text-white text-center text-sm mb-6">START LISTENING</p>
          <YouTubeMusicPlayer/>
      </div>
    </div>
  );
};

export default PlaylistPage;

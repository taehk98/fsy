import AnimationWrapper from '../common/page-animation';
import shorts from '../assets/fsy_activity_day.jpg';
import logo from '../assets/fsy_logo.png';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <AnimationWrapper>
      <section className='flex flex-col items-center justify-center pt-10 mt-6' >
        <div className='flex pt-10 mt-6 lg:mt-10'>
          <img src={shorts} width={100} height={100} className='w-full h-full md:w-96 md:h-96 rounded-xl' alt='banner' />
        </div>
    
        <div className='pt-6 flex flex-items gap-5'>
        <Link to='/editor' className='mb-20 lg-mb-30 rounded-xl bg-gradient-to-r from-indigo-500 
        via-purple-500 to-pink-500 hover:from-indigo-400  hover:via-pink-400 hover:to-red-500 px-6 py-4 font-bold text-white text-2xl'>실시간 순위 보기</Link>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
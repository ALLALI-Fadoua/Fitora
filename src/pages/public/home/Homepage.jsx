import Header from './Header';
import Hero from './Hero';
import QuickActions from './QuickActions';
import FeaturedSessions from './FeaturedSessions';
import NewCourses from './NewCourses';
import FeaturedCoaches from './FeaturedCoaches';
import WhyFITORA from './WhyFitora';
import SpecialOffers from './SpecialOffers';
import Footer from './Footer';

const Homepage = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white font-cairo" dir="rtl">
            <Header onNavigate={onNavigate} />
            <div className="pt-[60px]">
                <Hero onNavigate={onNavigate} />
                <QuickActions onNavigate={onNavigate} />
                <FeaturedSessions onNavigate={onNavigate} />
                <div className="h-px bg-[#2A2A30]" />
                <NewCourses onNavigate={onNavigate} />
                <FeaturedCoaches onNavigate={onNavigate} />
                <div className="h-px bg-[#2A2A30]" />
                <WhyFITORA />
                <SpecialOffers onNavigate={onNavigate} />
                <Footer />
            </div>
        </div>
    );
};
export default Homepage;
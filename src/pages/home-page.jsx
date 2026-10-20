import HeroSection from '../components/hero-section.jsx';
import AboutSection from '../components/about-section.jsx';
import SkillsSection from '../components/skills-section.jsx';
import ExperienceSection from '../components/experience-section.jsx';
import ProjectsSection from '../components/projects-section.jsx';
import EducationSection from '../components/education-section.jsx';
import ContactSection from '../components/contact-section.jsx';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <EducationSection />
      <ContactSection />
    </>
  );
}

import { useLanguage } from '../context/language-context.jsx';
import { profile } from '../data/profile-data.js';
import SectionTitle from './section-title.jsx';
import './skills-section.css';

export default function SkillsSection() {
  const { t, tr } = useLanguage();

  return (
    <section id="skills" className="page-section">
      <div className="container">
        <SectionTitle symbol="{" color="purple">
          {t('skills.title')}
        </SectionTitle>

        <div className="skills-list">
          {profile.skills.map((group, index) => (
            <div key={group.group.en} className="skills-group" data-aos="fade-up" data-aos-delay={index * 80}>
              <h3 className="skills-group-title">{tr(group.group)}</h3>
              <ul className="chip-list">
                {group.items.map((item) => (
                  <li key={tr(item)} className="chip">
                    {tr(item)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useLanguage } from '../context/language-context.jsx';
import { profile } from '../data/profile-data.js';
import SectionTitle from './section-title.jsx';
import './education-section.css';

export default function EducationSection() {
  const { t, tr } = useLanguage();

  return (
    <section id="education" className="page-section">
      <div className="container">
        <SectionTitle symbol="≈" color="mint">
          {t('education.title')}
        </SectionTitle>

        <ul className="education-list">
          {profile.education.map((item, index) => (
            <li key={item.place} className="education-item" data-aos="fade-up" data-aos-delay={index * 80}>
              <p className="education-status text-purple">{tr(item.status)}</p>
              <h3 className="education-title">{tr(item.title)}</h3>
              <p className="muted">{item.place}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

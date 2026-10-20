import { useLanguage } from '../context/language-context.jsx';
import { profile } from '../data/profile-data.js';
import SectionTitle from './section-title.jsx';
import './experience-section.css';

export default function ExperienceSection() {
  const { t, tr } = useLanguage();

  return (
    <section id="experience" className="page-section">
      <div className="container">
        <SectionTitle symbol="≡" color="mint">
          {t('experience.title')}
        </SectionTitle>

        <ol className="experience-list">
          {profile.experience.map((job) => (
            <li key={job.company + job.role.en} className="experience-item" data-aos="fade-up">
              <p className="experience-date">
                {tr(job.start)}
                {job.current && ` — ${t('experience.now')}`}
                {job.end && ` — ${tr(job.end)}`}
              </p>

              <div className="experience-body">
                <h3 className="experience-role">{tr(job.role)}</h3>
                <p className="experience-company text-coral">{job.company}</p>
                <ul className="experience-points">
                  {job.points.map((point) => (
                    <li key={point.en}>{tr(point)}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import { useLanguage } from '../../context/LanguageContext';
import { privacyContent } from '../../i18n/privacy';
import SEO from '../SEO/SEO';
import { getTranslations } from '../../i18n/translations';
import './privacypolicy.css';

const PrivacyPolicy = () => {
    const { language } = useLanguage();
    const text = getTranslations(language);
    const content = privacyContent[language] || privacyContent.en;

    return (
        <main className="privacy-policy">

            <SEO title={text.seo.privacy.title} description={text.seo.privacy.description} />
            <h1>{content.title}</h1>

            <p className="privacy-policy-updated">
                {content.updatedLabel}: {content.updated}
            </p>

            {content.sections.map((section) => (
                <section key={section.heading}>
                    <h2>{section.heading}</h2>

                    {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}

                    {section.items && (
                        <ul>
                            {section.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    )}

                    {section.after?.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                </section>
            ))}
        </main>
    );
};

export default PrivacyPolicy;
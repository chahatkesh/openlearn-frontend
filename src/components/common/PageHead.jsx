import { useEffect } from 'react';

const PageHead = ({ title, description, keywords }) => {
  useEffect(() => {
    // Set page title
    const fullTitle = title ? `${title} | OpenLearn` : 'OpenLearn - Gamified Learning for NITJ Innovators';
    document.title = fullTitle;

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || 'OpenLearn is a student-led cohort-based learning platform at NIT Jalandhar that transforms educational experiences through gamification and collaborative competition.');
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = description || 'OpenLearn is a student-led cohort-based learning platform at NIT Jalandhar that transforms educational experiences through gamification and collaborative competition.';
      document.head.appendChild(newMetaDescription);
    }

    // Set meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const defaultKeywords = 'OpenLearn, NIT Jalandhar, gamified learning, education, cohort-based learning, programming, technology';
    const keywordsContent = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
    
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywordsContent);
    } else {
      const newMetaKeywords = document.createElement('meta');
      newMetaKeywords.name = 'keywords';
      newMetaKeywords.content = keywordsContent;
      document.head.appendChild(newMetaKeywords);
    }

    // Set Open Graph tags for social sharing
    const setOGTag = (property, content) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (ogTag) {
        ogTag.setAttribute('content', content);
      } else {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        ogTag.setAttribute('content', content);
        document.head.appendChild(ogTag);
      }
    };

    setOGTag('og:title', fullTitle);
    setOGTag('og:description', description || 'OpenLearn is a student-led cohort-based learning platform at NIT Jalandhar that transforms educational experiences through gamification and collaborative competition.');
    setOGTag('og:type', 'website');
    setOGTag('og:site_name', 'OpenLearn');

  }, [title, description, keywords]);

  return null;
};

export default PageHead;

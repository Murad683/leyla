import { useEffect } from 'react';

export const useSEO = ({ title, description, ogImage }) => {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;
    }
    if (title) updateOrCreateMeta('property', 'og:title', title);
    if (description) updateOrCreateMeta('property', 'og:description', description);
    if (ogImage) updateOrCreateMeta('property', 'og:image', ogImage);
  }, [title, description, ogImage]);
};

function updateOrCreateMeta(attribute, attributeValue, content) {
  let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attributeValue);
    document.head.appendChild(element);
  }
  element.content = content;
}

export default useSEO;

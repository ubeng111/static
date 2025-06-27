
import { getdictionary } from '@/dictionaries/get-dictionary';
import { headers } from 'next/headers';
import { i18nConfig, defaultLocale } from '@/config/i18n';

export default async function LanguageLayout({ children, params }) {
  const headersList = headers();
  const urlLangSlug = params?.lang || defaultLocale;

  let initialLangSlugForDictionary = defaultLocale;
  const configByUrlSlug = i18nConfig.find(config => config.code === urlLangSlug);
  if (configByUrlSlug) {
    initialLangSlugForDictionary = configByUrlSlug.code;
  } else {
    console.warn(`[LanguageLayout Warn] Invalid urlLangSlug "${urlLangSlug}". Falling back to default locale: ${defaultLocale}`);
  }

  const dictionary = await getdictionary(initialLangSlugForDictionary);

  const baseUrl = 'https://hoteloza.com';
  let contentPath = headersList.get('x-content-pathname') || '';
  if (contentPath.startsWith('/')) {
    contentPath = contentPath.slice(1);
  }
  const validatedSlugPath = contentPath;

  const hreflangMap = new Map();
  i18nConfig.forEach((config) => {
    const langHref = `${baseUrl}/${config.code}${validatedSlugPath ? `/${validatedSlugPath}` : ''}`;
    const specificLangCode = config.htmlLangCode.toLowerCase();
    hreflangMap.set(specificLangCode, langHref);

    if (config.defaultForLanguage) {
      const genericLangCode = config.language;
      hreflangMap.set(genericLangCode, langHref);
    }
  });

  const xDefaultHref = `${baseUrl}/${defaultLocale}${validatedSlugPath ? `/${validatedSlugPath}` : ''}`;
  hreflangMap.set('x-default', xDefaultHref);

  const hreflangLinks = Array.from(hreflangMap.entries()).map(([hreflangCode, hrefUrl]) => (
    <link key={hreflangCode} rel="alternate" hrefLang={hreflangCode} href={hrefUrl} />
  ));

  const canonicalUrl = `${baseUrl}/${urlLangSlug}${validatedSlugPath ? `/${validatedSlugPath}` : ''}`;

  return (
    <>
      {hreflangLinks}
      <link rel="canonical" href={canonicalUrl} />
      {children}
    </>
  );
}
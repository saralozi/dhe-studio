export const servicesQuery = `
  *[_type == "service"] | order(order asc) {
    _id,

    "title": coalesce(
      title[language == $language][0].value,
      title[language == "en"][0].value
    ),

    "slug": slug.current,

    "shortDescription": coalesce(
      shortDescription[language == $language][0].value,
      shortDescription[language == "en"][0].value
    ),

    "fullDescription": coalesce(
      fullDescription[language == $language][0].value,
      fullDescription[language == "en"][0].value
    ),

    image {
      asset,
      hotspot,
      crop
    },

    "imageAlt": coalesce(
      image.alt[language == $language][0].value,
      image.alt[language == "en"][0].value
    ),

    order
  }
`;

export const projectsQuery = `
  *[_type == "project"] | order(order asc) {
    _id,

    "title": coalesce(
      title[language == $language][0].value,
      title[language == "en"][0].value
    ),

    "slug": slug.current,

    category,

    "projectType": coalesce(
      projectType[language == $language][0].value,
      projectType[language == "en"][0].value
    ),

   location,

    year,
    status,
    area,

    "shortDescription": coalesce(
      shortDescription[language == $language][0].value,
      shortDescription[language == "en"][0].value
    ),

    coverImage {
      asset,
      hotspot,
      crop
    },

    "coverImageAlt": coalesce(
      coverImage.alt[language == $language][0].value,
      coverImage.alt[language == "en"][0].value
    ),

    featured,
    order
  }
`;

export const projectBySlugQuery = `
  *[
    _type == "project" &&
    slug.current == $slug
  ][0] {
    _id,

    "title": coalesce(
      title[language == $language][0].value,
      title[language == "en"][0].value
    ),

    "slug": slug.current,

    category,

    "projectType": coalesce(
      projectType[language == $language][0].value,
      projectType[language == "en"][0].value
    ),

    location,

    year,
    status,
    area,

    "shortDescription": coalesce(
      shortDescription[language == $language][0].value,
      shortDescription[language == "en"][0].value
    ),

    "fullDescription": coalesce(
      fullDescription[language == $language][0].value,
      fullDescription[language == "en"][0].value
    ),

    coverImage {
      asset,
      hotspot,
      crop
    },

    "coverImageAlt": coalesce(
      coverImage.alt[language == $language][0].value,
      coverImage.alt[language == "en"][0].value
    ),

    "heroVideoUrl": heroVideo.asset->url,
    "heroVideoMimeType": heroVideo.asset->mimeType,

    order,

gallery[] {
  _key,
  _type,

  asset,
  hotspot,
  crop,

  // Direct URL and file information used by videos
  "assetUrl": asset->url,
  "mimeType": asset->mimeType,

  // Image alternative text
  "alt": coalesce(
    alt[language == $language][0].value,
    alt[language == "en"][0].value
  ),

  // Video title
  "title": coalesce(
    title[language == $language][0].value,
    title[language == "en"][0].value
  ),

  // Shared image or video caption
  "caption": coalesce(
    caption[language == $language][0].value,
    caption[language == "en"][0].value
  ),

  // Optional video cover image
  poster {
    asset,
    hotspot,
    crop,

    "alt": coalesce(
      alt[language == $language][0].value,
      alt[language == "en"][0].value
    )
  }
}
  }
`;

export const featuredProjectsQuery = `
  *[
    _type == "project" &&
    featured == true
  ] | order(order asc) {
    _id,

    "title": coalesce(
      title[language == $language][0].value,
      title[language == "en"][0].value
    ),

    "slug": slug.current,

    category,

    "projectType": coalesce(
      projectType[language == $language][0].value,
      projectType[language == "en"][0].value
    ),
    location,

    year,

    "shortDescription": coalesce(
      shortDescription[language == $language][0].value,
      shortDescription[language == "en"][0].value
    ),

    coverImage {
      asset,
      hotspot,
      crop
    },

    "coverImageAlt": coalesce(
      coverImage.alt[language == $language][0].value,
      coverImage.alt[language == "en"][0].value
    ),

    order
  }
`;

export const aboutQuery = `
  *[_type == "about"][0] {
    _id,

    "heroLabel": coalesce(
      heroLabel[language == $language][0].value,
      heroLabel[language == "en"][0].value
    ),

    "heroTitleFirstLine": coalesce(
      heroTitleFirstLine[language == $language][0].value,
      heroTitleFirstLine[language == "en"][0].value
    ),

    "heroTitleSecondLine": coalesce(
      heroTitleSecondLine[language == $language][0].value,
      heroTitleSecondLine[language == "en"][0].value
    ),

    "heroIntroduction": coalesce(
      heroIntroduction[language == $language][0].value,
      heroIntroduction[language == "en"][0].value
    ),

    storyImage {
      asset,
      hotspot,
      crop,

      "alt": coalesce(
        alt[language == $language][0].value,
        alt[language == "en"][0].value
      )
    },

    storyParagraphs[] {
      _key,

      "text": coalesce(
        text[language == $language][0].value,
        text[language == "en"][0].value
      )
    },

    "projectsLinkLabel": coalesce(
      projectsLinkLabel[language == $language][0].value,
      projectsLinkLabel[language == "en"][0].value
    ),

    "approachLabel": coalesce(
      approachLabel[language == $language][0].value,
      approachLabel[language == "en"][0].value
    ),

    principles[] {
      _key,

      "title": coalesce(
        title[language == $language][0].value,
        title[language == "en"][0].value
      ),

      "description": coalesce(
        description[language == $language][0].value,
        description[language == "en"][0].value
      )
    }
  }
`;
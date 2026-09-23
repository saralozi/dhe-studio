export const servicesQuery = `
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    fullDescription,
    image,
    "imageAlt": image.alt,
    order
  }
`;

export const projectsQuery = `
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    category,
    projectType,
    location,
    year,
    status,
    area,
    shortDescription,
    coverImage,
    "coverImageAlt": coverImage.alt,
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
    title,
    "slug": slug.current,
    category,
    projectType,
    location,
    year,
    status,
    area,
    shortDescription,
    fullDescription,
    coverImage,
    "coverImageAlt": coverImage.alt,
    order,
    gallery[] {
      _key,
      asset,
      alt,
      caption
    }
  }
`;

export const featuredProjectsQuery = `
  *[
    _type == "project" &&
    featured == true
  ] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    category,
    projectType,
    location,
    year,
    shortDescription,
    coverImage,
    "coverImageAlt": coverImage.alt,
    order
  }
`;
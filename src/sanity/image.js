import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';

const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source) => {
  return builder.image(source);
};

// sanity returns image information rather than a normal path
// urlFor() helper will convert that information into a usable image URL
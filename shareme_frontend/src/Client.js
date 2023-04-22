import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Read(https://www.sanity.io/docs/js-client)
export const client = sanityClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2022-10-26",
  useCdn: false,
  token: process.env.REACT_APP_SANITY_TOKEN,
});

// To build a url for img from sanity database --Read(https://www.sanity.io/docs/image-url)
const builder = imageUrlBuilder(client);

export const urlFor = (source) => {
  return builder.image(source);
};

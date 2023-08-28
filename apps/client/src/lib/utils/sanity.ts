import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { env } from '$env/dynamic/public'

const client = sanityClient({
	projectId: env.PUBLIC_SANITY_PROJECT_ID,
	dataset: env.PUBLIC_SANITY_DATASET,
	apiVersion: '2021-10-21',
	useCdn: false
})

const builder = imageUrlBuilder(client)

export function urlFor(source: string) {
	return builder.image(source)
}

export async function getProject({ handle }: { handle: string }) {
	return await client.fetch(
		`*[_type == "project" && slug.current == $handle][0]{
      ...,
      title,
      description,
      body,
      status,
      "image": {
        "src": image.asset->url,
        "alt": image.alt,
        "caption": image.caption,
        "color": image.asset->metadata.palette.lightVibrant.background,
      },
      "links": links[]{
        title,
        href
      },
      "color": image.asset->metadata.palette.lightVibrant.background,
      "cast": cast[]{
        castname,
        "name": person->name,
        "link": person->link
      },
      "crew": crew[]{
        "role": role->title,
        "name": person->name,
        "link": person->link
      },
      "posters": posters[]{
        "src": asset->url,
        "alt": alt,
        "caption": caption,
      }
    }`,
		{
			handle
		}
	)
}

export async function getAllProjects() {
	return await client.fetch(`*[_type == "project"]{
    ...,
    title,
    description,
    slug,
    image{
      asset->    
    },
    mainImage{
      asset->,
      alt,
      caption,
    },
  }`)
}

export async function getSettings() {
	return await client.fetch(`*[_type == "siteSettings"][0]`)
}

export async function getSongs() {
	return await client.fetch(`*[_type == "song"]`)
}

# VoynichSC

This project is hosted at https://voynichsc.uni-koeln.de/

This is the repository for the web portal of Voynich Studies Cologne (VoynichSC), a collection of videos about the Voynich Mansucript by University Of Cologne students and staff.

## Technology

The VoynichSC portal is a static website that is generated with the [11ty satatic site generator](https://www.11ty.dev/).


# Development

### Content

Content is represented in markdown format:

- topic pages in `src/pages`
- home page: `src/index.md`

### Build static files

Requirements: **node** and **npm**

- **install dependencies**: run `npm install`
- **Build files:** run `npx @11ty/eleventy`.
- For development, running `npx @11ty/eleventy --serve` also starts a local development server with hot reloading that can be reached at http://localhost:8080

# Deployment
Copy the built static files from `dist` into the webroot of the server.
<!-- GETTING STARTED -->
## Getting Started

Here are instructions on how to clone the project into your local directory:

### Installation
1. Clone the repository
```sh
git clone https://github.com/francisngo/celebrity.ai.git
```

2. Change into the directory 
```sh
cd celebrity.ai
```

3. Install NPM packages
```sh
npm install
```

4. Create .env file (see prerequisites below)

5. Run application locally
```sh
npm run dev
```

### Prerequisites
* Create a .env file in root dir
* (Auth) Set up Clerk Publishable Key and Secret Key at https://clerk.com/docs/quickstarts/nextjs
* (Categories & Celebrities) Set up MySQL database URL with PlanetScale at https://planetscale.com/
* (Image upload) Set up Cloudinary API key at https://cloudinary.com/
* (Chat messages) Set up Long-Term Memory Database with Pinecone at https://pinecone.io/
* (Performance) Set up Redis Database with Upstash at https://upstash.com/
* Set up OpenAI embedding with OpenAI platform at https://platform.openai.com/
* Set up Replicate API token at https://replicate.com

Your .env should look something like this: 
```
DATABASE_URL=""

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""

PINECONE_INDEX=""
PINECONE_ENVIRONMENT=""
PINECONE_API_KEY=""

UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

OPENAI_API_KEY=

REPLICATE_API_TOKEN=
```


# Pix0 AI Job Site

Welcome to Pix0 AI Job Site! This repository contains the source code for a dynamic job site powered by AI technology.

## Features

- **AI-Powered Job Posting**: Generate job descriptions instantly by providing a job title.
- **AI-Based Applicant Scoring**: Evaluate job applicants and resumes using AI algorithms.
- **Resume Builder**: Job seekers can create professional resumes quickly and easily.
- **Content Filtering**: Ensure job posts, resumes, and user-generated content are suitable and safe.
- **Future Features**: Personalized job matching and more enhancements in development.

## Technologies Used

- Next.js: Frontend framework for building the user interface.
- Google Gemini Generative AI API: AI capabilities for job description generation and applicant scoring.
- Tailwind CSS: Utility-first CSS framework for styling.
- Other libraries used: pix0-core-ui, React Icon, and other 3rd party React UI and NodeJS libs.

## Online Demo Version
https://jobs.pix0.xyz

Demo Video :point_down:

[![Demo Video](https://img.youtube.com/vi/PGfsemT04po/0.jpg)](https://www.youtube.com/watch?v=PGfsemT04po)

Submission For Devpost Google AI Hackathon
https://devpost.com/software/pix0-ai-job-site

Implementation of the Google Gemini AI can be found in the REST API code in ```src/pages/api/modules/gai.ts```

## Getting Started

1. Clone the repository: `git clone https://github.com/ketyung/pix0-ai-job-site.git`
2. Install dependencies: `yarn`
3. Set up environment variables (if any).
4. Start the development server: `yarn dev`

## Environment Variables

Create a `.env` file in the project folder and add in the following parameters:

```plaintext
DATABASE_URL="...."   # The database URL to your MySQL host

GOOGLE_CLIENT_ID=".....apps.googleusercontent.com" # Google Credential Needed for NextAuth
GOOGLE_CLIENT_SECRET="xxxxxxx"

# Parameters for Image Upload To Cloudinary
CLOUDINARY_PARAMS=[{"name":"ababababa","api_key":"xxxxx","secret":"xxxx", "upload_folder":"xxxxx"}]
# Cloudinary Image Upload URL
NEXT_PUBLIC_CLOUD_UPLOAD_URL="https://api.cloudinary.com/v1_1/:cloud_name/image/"

GEMINI_API_KEY="...."  # API Key For GOOGLE Gemini AI 

REST_API_KEY="........xxx" # The REST API KEY of the project backend REST API

SERVER_HOST=""          # Specify a server host here if you intend to host on a host rather than the localhost

NEXTAUTH_SECRET="....."  
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL='http://localhost:3000/api/'

# Optional Encryption Keys for AES 256 Encryption with Random IV and Salt for sensitive user's info
# In The Future We'll Migrate To Use Google Key Manager, These Will NOT Be Needed Anymore
UID_ENCRYPT_KEY="...."
EM_ENCRYPT_KEY="..."
TEL_ENCRYPT_KEY="..."
PW_ENCRYPT_KEY="..."
GC_ENCRYPT_KEY="...."
GID_ENCRYPT_KEY="...."
```

## Usage

Provide instructions on how to use the Pix0 AI Job Site, including:

- How to post a job.
- How to apply for a job.
- How to use the resume builder.
- Any other relevant usage instructions.

## License

Include information about the license under which your project is distributed. For example:

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Mention any individuals, organizations, or resources that you'd like to acknowledge for their contributions or inspiration.

## Contact

- Provide contact information for users to reach out with questions, feedback, or inquiries.

# AI Government Scheme Assistant

A chat-based web application that helps users learn about Indian government schemes using AI.

## Features

- Interactive chat interface for asking questions about government schemes
- AI-powered responses using OpenAI's GPT model
- Comprehensive knowledge base of popular Indian government schemes
- Information about eligibility, benefits, documents, and application processes
- Modern, responsive UI built with React
- Express.js backend with API integration

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Styling**: CSS3 with modern design

## Government Schemes Included

1. Pradhan Mantri Awas Yojana (PMAY)
2. Pradhan Mantri Jan Dhan Yojana (PMJDY)
3. Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)
4. Pradhan Mantri Kaushal Vikas Yojana (PMKVY)
5. Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)
6. Sukanya Samriddhi Yojana (SSY)
7. Pradhan Mantri Ujjwala Yojana (PMUY)
8. Atal Pension Yojana (APY)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "AI Government Scheme Assistant"
```

2. Install dependencies for both frontend and backend:
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. Set up environment variables:
```bash
cd ../server
cp .env.example .env
```

4. Add your OpenAI API key to the `.env` file:
```
OPENAI_API_KEY=your_actual_api_key_here
PORT=5000
```

## Running the Application

### Start the Backend

```bash
cd server
npm start
```

The backend will run on `http://localhost:5000`

### Start the Frontend

In a new terminal:

```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is in use)

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Type your question about government schemes in the chat input
3. The AI assistant will provide information about the scheme, including:
   - Description
   - Eligibility criteria
   - Benefits
   - Required documents
   - Application links

## Example Questions

- "Tell me about PMAY"
- "What is the eligibility for Ayushman Bharat?"
- "What documents do I need for PMJDY?"
- "What are the benefits of Atal Pension Yojana?"

## API Endpoints

### POST /api/chat
Send a message to the AI assistant.

**Request:**
```json
{
  "message": "Tell me about PMAY"
}
```

**Response:**
```json
{
  "response": "Pradhan Mantri Awas Yojana (PMAY) is a housing scheme..."
}
```

### GET /api/schemes
Get all government schemes in the knowledge base.

**Response:**
```json
{
  "schemes": [...]
}
```

### GET /api/health
Health check endpoint.

## Project Structure

```
AI Government Scheme Assistant/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                # Express backend
│   ├── index.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## Customization

### Adding New Schemes

To add more government schemes, edit the `governmentSchemes` object in `server/index.js`:

```javascript
{
  name: "Scheme Name",
  description: "Description of the scheme",
  eligibility: "Eligibility criteria",
  benefits: "Benefits provided",
  documents: "Required documents",
  link: "Official website URL"
}
```

### Changing the AI Model

To use a different OpenAI model, modify the `model` parameter in the chat completion in `server/index.js`:

```javascript
const completion = await openai.chat.completions.create({
  model: "gpt-4", // or any other model
  messages: [...],
  max_tokens: 500,
  temperature: 0.7,
});
```

## Troubleshooting

1. **Frontend can't connect to backend**: Ensure the backend is running on port 5000
2. **API errors**: Check that your OpenAI API key is valid and has credits
3. **CORS errors**: The backend is configured to allow CORS, but check if the proxy settings in vite.config.js are correct

## Future Enhancements

- User authentication and personalization
- Document upload for application assistance
- Multi-language support
- Scheme eligibility calculator
- Application deadline reminders
- Integration with official government APIs

## License

This project is open source and available for educational purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Government scheme knowledge base
const governmentSchemes = {
  schemes: [
    {
      name: "Pradhan Mantri Awas Yojana (PMAY)",
      description: "Housing for All by 2022 mission to provide affordable housing to urban poor",
      eligibility: "Annual income up to ₹18 lakh for EWS/LIG/MIG categories",
      benefits: "Interest subsidy on home loans up to ₹2.67 lakh",
      documents: "Aadhaar card, income certificate, property documents",
      link: "https://pmay.gov.in"
    },
    {
      name: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
      description: "Financial inclusion program to provide access to banking services",
      eligibility: "All Indian citizens, especially from poor and marginalized sections",
      benefits: "Zero balance bank account, RuPay debit card, overdraft facility up to ₹10,000",
      documents: "Aadhaar card, PAN card, passport size photo",
      link: "https://pmjdy.gov.in"
    },
    {
      name: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)",
      description: "Health insurance scheme providing coverage of ₹5 lakh per family per year",
      eligibility: "Families from deprived rural and urban labor categories",
      benefits: "Health coverage of ₹5 lakh per family for secondary and tertiary care",
      documents: "Aadhaar card, ration card, income certificate",
      link: "https://pmjay.gov.in"
    },
    {
      name: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
      description: "Skill development scheme to enable youth to take up industry-relevant skill training",
      eligibility: "Indian citizens aged 14-35 years, unemployed or underemployed",
      benefits: "Free skill training, placement assistance, monetary reward",
      documents: "Aadhaar card, educational certificates, bank account",
      link: "https://pmkvy.gov.in"
    },
    {
      name: "Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)",
      description: "Guarantee of 100 days of wage employment in rural areas",
      eligibility: "Adult members of rural households willing to do unskilled manual work",
      benefits: "Minimum wage employment, social security, skill development",
      documents: "Aadhaar card, job card, bank account",
      link: "https://nrega.nic.in"
    },
    {
      name: "Sukanya Samriddhi Yojana (SSY)",
      description: "Savings scheme for girl child to ensure financial security",
      eligibility: "Parents of girl child below 10 years",
      benefits: "High interest rate, tax benefits, long-term savings",
      documents: "Birth certificate of girl child, ID proof of parents",
      link: "https://www.postalgov.in"
    },
    {
      name: "Pradhan Mantri Ujjwala Yojana (PMUY)",
      description: "Providing LPG connections to BPL households",
      eligibility: "BPL families, women in households with no LPG connection",
      benefits: "Free LPG connection, stove, and first refill",
      documents: "Aadhaar card, BPL card, bank account",
      link: "https://www.pmuy.gov.in"
    },
    {
      name: "Atal Pension Yojana (APY)",
      description: "Pension scheme for unorganized sector workers",
      eligibility: "Indian citizens aged 18-40 years working in unorganized sector",
      benefits: "Guaranteed minimum pension of ₹1,000-5,000 per month after 60 years",
      documents: "Aadhaar card, bank account, mobile number",
      link: "https://www.npscra.nsdl.co.in"
    }
  ]
};

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // If OpenAI is not configured, use fallback mode
    if (!openai) {
      const fallbackResponse = generateFallbackResponse(message);
      return res.json({ response: fallbackResponse });
    }

    // Create system prompt with government scheme knowledge
    const systemPrompt = `You are a helpful AI assistant for Indian Government Schemes.
You provide accurate information about various government schemes, their eligibility criteria, benefits, required documents, and application processes.

Here is the knowledge base of government schemes:
${JSON.stringify(governmentSchemes, null, 2)}

When answering questions:
1. Provide clear and accurate information about the schemes
2. Include eligibility criteria, benefits, and documents required
3. Provide official links when available
4. If the question is not about government schemes, politely redirect the user
5. Be concise but informative
6. Use bullet points for better readability when listing multiple items`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    res.json({ response });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      error: 'Failed to process your request',
      details: error.message
    });
  }
});

// Fallback response generator for when OpenAI is not configured
function generateFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Search for relevant scheme
  const relevantScheme = governmentSchemes.schemes.find(scheme =>
    lowerMessage.includes(scheme.name.toLowerCase()) ||
    lowerMessage.includes(scheme.name.split(' ').slice(-2).join(' ').toLowerCase())
  );

  if (relevantScheme) {
    return `**${relevantScheme.name}**

${relevantScheme.description}

**Eligibility:**
${relevantScheme.eligibility}

**Benefits:**
${relevantScheme.benefits}

**Required Documents:**
${relevantScheme.documents}

**More Information:**
${relevantScheme.link}`;
  }

  // If no specific scheme found, provide general information
  return `I can help you with information about the following government schemes:

${governmentSchemes.schemes.map(scheme => `- ${scheme.name}`).join('\n')}

Please ask about a specific scheme for detailed information including eligibility, benefits, and application process.

Note: This is a demo mode without AI. For full AI-powered responses, please configure your OpenAI API key in the server .env file.`;
}

// Get all schemes endpoint
app.get('/api/schemes', (req, res) => {
  res.json(governmentSchemes);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

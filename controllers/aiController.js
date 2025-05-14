//Most of the comments paraphrased and made more understandable with the help of AI,
//P.S. if you need further clarification let me know, Shok

// Import GPT-4.1 Azure SDK components
const ModelClient = require("@azure-rest/ai-inference").default;
const { isUnexpected } = require("@azure-rest/ai-inference");
const { AzureKeyCredential } = require("@azure/core-auth");

// Load credentials from .env
const token = process.env.GITHUB_TOKEN;
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const model = process.env.AZURE_OPENAI_MODEL;

// Controller function to handle itinerary generation
exports.generateItinerary = async (req, res, next) => {
    // Extract user-submitted form data
    const { destination, days, startDate, endDate, budget, preferences } = req.body;

    // Format the prompt with user input for the AI
    const prompt = `
Create a detailed travel itinerary for a trip to ${destination}.
- Duration: ${days} days (${startDate} to ${endDate})
- Budget: $${budget}
- Preferences: ${preferences || "None specified"}

Respond with a nicely formatted day-by-day plan including brief activities, local suggestions, and optional budgeting tips.
`;

    // Define the message structure for GPT-4.1
    const messages = [
        { role: "system", content: `
You are a travel planner AI. Your job is to create personalized, detailed travel itineraries.

IMPORTANT:
— Use proper HTML formatting.—Use <h3> for each day (e.g., <h3>Day 1: Arrival in Tokyo</h3>).
— List daily activities using <ul><li>...</li></ul>.
— If a location (e.g., Eiffel Tower) is mentioned, include a Google Maps link like:
  <a href="https://www.google.com/maps/search/Eiffel+Tower" target="_blank">View on map</a>.—Return only the structured HTML for direct rendering on the website.
— Ensure each day's section is clearly separated.
`
        },
        { role: "user", content: prompt }
    ];

    try {
        // Initialize the Azure OpenAI client
        const client = ModelClient(endpoint, new AzureKeyCredential(token));

        // Send request to GPT model
        const response = await client.path("/chat/completions").post({
            body: {
                model: model,
                messages: messages,
                temperature: 0.9,   // Creativity level
                top_p: 1.0          // Diversity in responses
            }
        });

        // Handle API errors
        if (isUnexpected(response)) {
            console.error("GPT API error:", response.body?.error?.message || response.status);
            return res.status(500).render("index", {
                title: "Home",
                message: "Welcome to the Authentication Template",
                itineraryResult: "Something went wrong while generating the itinerary."
            });
        }

        // Extract generated itinerary text from response
        const reply = response.body?.choices?.[0]?.message?.content;
        const cityMatch = reply.match(/Day\s1:.*in\s([A-Z][a-zA-Z\s]+)/i);
        const extractedCity = cityMatch ? cityMatch[1].trim() : null;

        if (extractedCity) {
            console.log("🗺️ Extracted city from AI response:", extractedCity);
        }


        // If user is logged in, save itinerary to History model
        if (req.session.user) {
            const History = require('../models/History');
            const User = require('../models/User');

            // Create and save new history record
            const history = new History({
                userId: req.session.user.id,
                location: destination,
                itinerary: reply
            });

            await history.save();

            // Link history to the user
            await User.findByIdAndUpdate(req.session.user.id, {
                $push: { history: history._id }
            });
        }

        // Render homepage with the AI-generated itinerary
        res.render("index", {
            title: "Home",
            message: "Welcome to the Authentication Template",
            itineraryResult: reply
        });

    } catch (err) {
        // Catch and report any unexpected errors
        console.error("Itinerary generation error:", err);
        res.status(500).render("index", {
            title: "Home",
            message: "Welcome to the Authentication Template",
            itineraryResult: "An error occurred. Please try again later."
        });
    }
};

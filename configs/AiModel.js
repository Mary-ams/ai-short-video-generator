const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  /**
   * Uploads the given file to Gemini.
   *
   * See https://ai.google.dev/gemini-api/docs/prompting_with_media
   */
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
  
    // TODO Make these files available on the local file system
    // You may need to update the file paths
  
    export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Write a script to generate 30 seconds video on topic: Interesting historical story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field "},
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: `\`\`\`json
        [
          {
            "imagePrompt": "Realistic image: A bustling medieval marketplace in Florence, Italy, 14th century. Crowds of people in period clothing, stalls overflowing with goods, vibrant colors, sunlight streaming through the buildings.",
            "ContentText": "The year is 1347. Florence, a city bursting with life, yet unknowingly on the brink of disaster. Our story begins in this marketplace..."
          },
          {
            "imagePrompt": "Realistic image: A close-up of a worried merchant's face, sweat beading on his brow, his eyes filled with fear. He's dressed in simple but well-worn clothing, holding a small pouch of coins.",
            "ContentText": "Giovanni, a cloth merchant, notices something amiss. A strange sickness is spreading, a fever that leaves its victims with black boils..."
          },
          {
            "imagePrompt": "Realistic image: Grim scene of death and despair in a Florence street. Bodies lie in the street, people are desperately trying to help the sick, faces showing grief and fear. The setting sun casts long shadows.",
            "ContentText": "The Black Death has arrived. Within weeks, half the city is dead. Fear grips the population..."
          },
          {
            "imagePrompt": "Realistic image: A determined-looking young woman in simple clothing tending to a sick person. Her expression is compassionate but weary. The scene is dimly lit, perhaps in a makeshift hospital.",
            "ContentText": "But amidst the chaos, hope remains. Isabella, a young apothecary, risks her own life to tend to the sick, experimenting with herbs and remedies..."
          },
          {
            "imagePrompt": "Realistic image: Isabella presenting a concoction of herbs to a recovering patient. The patient is pale but improving. There is a sense of cautious optimism in the scene.",
            "ContentText": "Through trial and error, she discovers a treatment that, while not a cure, dramatically improves survival rates..."
          },
          {
            "imagePrompt": "Realistic image: A wide shot of Florence slowly recovering months later. People are cautiously returning to the marketplace, though the streets are still quieter than before. A sense of rebuilding and resilience.",
            "ContentText": "Slowly, Florence begins to rebuild. Isabella's contribution, though unrecognized at the time, plays a crucial role in the city's recovery. The Black Death's horrific legacy serves as a stark reminder of humanity's resilience in the face of unimaginable suffering."
          }
        ]
        \`\`\``
            }
          ]
        },
      ],
    });
  
    
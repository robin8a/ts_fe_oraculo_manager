# Help to create a new UI/UX

1. Let me input the for: url, API Key and Project in order to fetch the data API from KobolToolBox

2. Fetch the data from KoboltoolBox using step 1. inputs

- Use schema.graphql, mutations, queries  
- From the project: "Levantamiento Info Parcelas"
- For every column name create a new feature if doesn't exist.
- Use every row to create a new "Tree" and asociate the "Feature" created with its corresponding value
- For the colum audio upload to S3 amplify configured storage bucket and asociate the feature with the s3 URL using the corresponding TreeID.

## Audio features to Trees lambda funciont an UI

1. Help me to create a amplify lambda function that:

- Recieve as a parameters the tree ID or IDs to be process, or all the trees. Also the template. Gemini API key.
- For every audio audio detected for instances the "audio_levantamiento" in the Trees from using the GraphQL API.
- Use the Features asociated to a "Template" as a key words to find the features and its value in to the audio using Gemini API as follow in the next python code as an example.
- For every feature detected form the template in the audio, set the value creating the RawData with its own tree_id, feature_id and value


```python
import google.generativeai as genai

# Configure your API Key
genai.configure(api_key="YOUR_API_KEY")

# 1. Upload the audio (File API is recommended for long audios)
audio_file = genai.upload_file(path="field_inventory.mp3")

# 2. Configure the model for JSON output
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash", # Flash is ideal for speed and cost
    generation_config={
        "response_mime_type": "application/json",
    }
)

# 3. Prompt with your list of keywords from the Template
prompt = """
Extract the technical information from the audio and return it strictly in JSON format.
If a value is not mentioned, set it to null.
Required fields:
- plot_number (string)
- tree_number (integer)
- dbh (number)
- total_height (number)
- commercial_height (number)
- observations (string)
"""

response = model.generate_content([prompt, audio_file])
extracted_data = response.text # This is now a JSON string
```

2. Create a new UI component

- Name it as "Audio to features"
- Add to the sidebar
- Allow to set the function parameters
- Show the total audios detected for every tree
- Show the progress for every tree audio process

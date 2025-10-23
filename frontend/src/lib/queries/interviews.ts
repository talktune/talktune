import axios from "axios";

export async function getInterviews() {
  try {
    let data = JSON.stringify({
      query: `
        query getAllInterviews {
          getAllInterviews {
            dynamicTemplateId
            category
            interviewId
            introduction
            tagContents
            interviewStages {
              stageNumber
              stage
              numberOfQuestions
              isStageInOrder
            }
            isTimeLimited
            preferences {
              name
              type
              defaultValue
              label
              removeOption
              addNewOption
              indexNo
              options 
              validation {
                required
                min
                max
              }
              placeHolder
            }
            interviewText
            timeLimit
            imageUrl
            isInterimEnabled
            interviewLabel
            description
          }
        }
`,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.NEXT_PUBLIC_BACKEND_URL,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    const res = await axios.request(config);
    if (res.data?.data?.getAllInterviews) {
      return res.data.data.getAllInterviews;
    }

  } catch (error) {
    console.error('Error fetching interviews:', error);
    return [];
  }
}

export async function generateDynamicPrompt(
  promptID: string,
  preferencesSchema: any
) {
  try {
    let data = JSON.stringify({
      query: `
            mutation GenerateDynamicPrompt($input: GenerateDynamicPromptInput!) {
              generateDynamicPrompt(generateDynamicPromptInput: $input) {
                id
                promptName
                prompt {
                  id
                  stageNumber
                  noOfQuiz
                  preparationTime
                  quizTime
                  promptTemplate
                  isTimeLimited
                  isQuizLimited
                  validationTemplate
                }
              }
            }`,
      variables: {
        input: {
          promptId: promptID,
          preferencesSchema: JSON.stringify(preferencesSchema),
        },
      },
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.NEXT_PUBLIC_BACKEND_URL,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    const res = await axios.request(config);
    if (res.data?.data?.generateDynamicPrompt) {
      return res.data.data.generateDynamicPrompt;
    }

  } catch (error) {

  }
}